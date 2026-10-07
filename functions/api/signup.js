function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'Signup storage is not configured yet.' }, 503);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid signup details.' }, 400); }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!name || name.length > 80) return json({ error: 'Enter a name up to 80 characters long.' }, 400);
  if (email.length > 254 || !/^\\S+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return json({ error: 'Enter a valid email address.' }, 400);
  if (body.consent !== 'yes') return json({ error: 'Please consent to receive DailySwag updates.' }, 400);

  try {
    await env.DB.prepare('INSERT INTO signup_submissions (name, email, consent) VALUES (?, ?, 1) ON CONFLICT(email) DO NOTHING')
      .bind(name, email).run();
  } catch {
    return json({ error: 'Signup storage is temporarily unavailable. Please try again.' }, 503);
  }
  return json({ success: true });
}
