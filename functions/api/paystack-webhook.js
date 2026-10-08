function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function verifySignature(request, rawBody, secret) {
  const signature = request.headers.get('x-paystack-signature') || '';
  if (!signature || !secret) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const expected = [...new Uint8Array(digest)]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  return signature.length === expected.length
    && [...signature].every((char, index) => char.toLowerCase() === expected[index]);
}

export async function onRequestPost({ request, env }) {
  const rawBody = await request.text();
  if (!await verifySignature(request, rawBody, env.PAYSTACK_SECRET_KEY)) {
    return json({ error: 'Invalid signature.' }, 401);
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: 'Invalid payload.' }, 400);
  }

  if (event.event !== 'charge.success' || !event.data?.reference || !env.DB) {
    return json({ received: true });
  }

  const transaction = event.data;
  const items = Array.isArray(transaction.metadata?.order_items)
    ? JSON.stringify(transaction.metadata.order_items)
    : '[]';

  await env.DB.prepare(
    `INSERT INTO orders (reference, email, amount, currency, status, channel, items)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(reference) DO UPDATE SET
       email = excluded.email,
       amount = excluded.amount,
       currency = excluded.currency,
       status = excluded.status,
       channel = excluded.channel,
       items = excluded.items`
  ).bind(
    transaction.reference,
    transaction.customer?.email || '',
    Number(transaction.amount) || 0,
    transaction.currency || 'NGN',
    transaction.status || 'success',
    transaction.channel || '',
    items
  ).run();

  return json({ received: true });
    }
