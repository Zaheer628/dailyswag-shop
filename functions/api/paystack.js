const products = new Map([
  [1, { name: 'Your Name Heavyweight Tee', price: 18000 }],
  [2, { name: 'City Stamp Tee', price: 22000 }],
  [3, { name: 'DS +234 Jersey', price: 25000 }],
  [4, { name: 'Blue Jersey', price: 25000 }],
  [5, { name: 'Everyday Six-Panel', price: 14000 }],
  [6, { name: 'Washed Cotton Cap', price: 16000 }],
  [7, { name: 'Everyday Plain Tee', price: 12000 }],
  [8, { name: 'Heavyweight Plain Tee', price: 16000 }],
  [9, { name: 'DS Black Jersey', price: 25000 }],
  [10, { name: 'DS Stripe Blue Jersey', price: 25000 }],
  [11, { name: 'DS Stripe Green Jersey', price: 25000 }],
  [12, { name: 'DS White NG Jersey', price: 25000 }]
]);

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' }
  });
}

async function callPaystack(env, path, options = {}) {
  return fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.PAYSTACK_SECRET_KEY) {
    return json({ error: 'Payments are not configured yet.' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Enter a valid email address.' }, 400);
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
    return json({ error: 'Your bag is empty or invalid.' }, 400);
  }

  let totalNaira = 0;
  const orderItems = [];

  for (const item of body.items) {
    // Normalize values because browser/session storage payloads can arrive as strings.
    const productId = Number.parseInt(String(item?.id ?? ''), 10);
    const quantity = Number.parseInt(String(item?.quantity ?? ''), 10);
    const size = typeof item?.size === 'string' ? item.size.trim() : '';
    const product = products.get(productId);
    const allowedSizes = [5, 6].includes(productId)
      ? ['One size']
      : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10 || !allowedSizes.includes(size)) {
      return json({ error: 'Your bag contains an invalid item, size, or quantity.' }, 400);
    }

    totalNaira += product.price * quantity;
    orderItems.push({ name: product.name, quantity, size });
  }

  let paystackResponse;
  try {
    paystackResponse = await callPaystack(env, '/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email,
        amount: String(totalNaira * 100),
        currency: 'NGN',
        channels: ['card', 'bank_transfer'],
        callback_url: new URL('/', request.url).toString(),
        metadata: {
          expected_amount: totalNaira * 100,
          order_items: orderItems
        }
      })
    });
  } catch {
    return json({ error: 'Could not connect to Paystack. Try again.' }, 502);
  }

  let result;
  try {
    result = await paystackResponse.json();
  } catch {
    return json({ error: 'Paystack returned an invalid response.' }, 502);
  }

  if (!paystackResponse.ok || !result.status || !result.data?.authorization_url) {
    return json({ error: result.message || 'Paystack could not start checkout. Try again.' }, 502);
  }

  return json({ authorizationUrl: result.data.authorization_url });
}

export async function onRequestGet({ request, env }) {
  if (!env.PAYSTACK_SECRET_KEY) {
    return json({ error: 'Payments are not configured yet.' }, 503);
  }

  const reference = new URL(request.url).searchParams.get('reference');
  if (typeof reference !== 'string' || !/^[A-Za-z0-9.=\-]{1,100}$/.test(reference)) {
    return json({ error: 'Invalid payment reference.' }, 400);
  }

  let paystackResponse;
  try {
    paystackResponse = await callPaystack(
      env,
      `/transaction/verify/${encodeURIComponent(reference)}`
    );
  } catch {
    return json({ error: 'Could not connect to Paystack. Try again.' }, 502);
  }

  let result;
  try {
    result = await paystackResponse.json();
  } catch {
    return json({ error: 'Paystack returned an invalid response.' }, 502);
  }

  if (!paystackResponse.ok || !result.status || !result.data) {
    return json({ error: 'Could not verify this payment with Paystack.' }, 502);
  }

  const transaction = result.data;
  const expectedAmount = Number(transaction.metadata?.expected_amount);
  const verified = transaction.status === 'success'
    && transaction.reference === reference
    && transaction.currency === 'NGN'
    && Number.isSafeInteger(expectedAmount)
    && expectedAmount > 0
    && transaction.amount === expectedAmount;

  return json({
    verified,
    status: transaction.status,
    reference: transaction.reference,
    channel: transaction.channel || null
  });
}

