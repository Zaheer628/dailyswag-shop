import { onRequestGet as verifyPaystack, onRequestPost as startPaystack } from './functions/api/paystack.js';

import { onRequestPost as signup } from './functions/api/signup.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/paystack') {
      if (request.method === 'POST') return startPaystack({ request, env });
      if (request.method === 'GET') return verifyPaystack({ request, env });
      return new Response('Method Not Allowed', { status: 405 });
    }

    if (url.pathname === '/api/signup' && request.method === 'POST') {
      return signup({ request, env });
    }

    return env.ASSETS.fetch(request);
  }
};
