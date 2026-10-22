const registrationService = 'https://app.ft-itc.org';

const proxyPaths = new Set([
  '/api/registration',
  '/api/registration/activate',
  '/api/registration/status',
  '/api/viewer/token'
]);

// Send one unambiguous address format for Caddy to validate independently.
const visitorAddress = (value) => {
  if (typeof value !== 'string' || value.length > 45) return null;
  if (!value.includes(':')) {
    const parts = value.split('.');
    return parts.length === 4 && parts.every(part => /^(0|[1-9][0-9]{0,2})$/.test(part) && Number(part) <= 255)
      ? value : null;
  }
  if (!/^[0-9a-f:.]+$/i.test(value)) return null;
  try {
    const canonical = new URL(`http://[${value}]/`).hostname.slice(1, -1);
    const halves = canonical.split('::');
    const left = halves[0] ? halves[0].split(':') : [];
    const right = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
    const groups = halves.length === 2
      ? [...left, ...Array(8 - left.length - right.length).fill('0'), ...right] : left;
    return groups.map(group => group.padStart(4, '0')).join(':');
  } catch { return null; }
};

const proxyRegistrationRequest = (request, url, env) => {
  const secret = env.FTITC_WEBSITE_PROXY_SECRET;
  // Deployment requires Pseudo IPv4 to leave this edge-generated address intact.
  const address = visitorAddress(request.headers.get('CF-Connecting-IP'));
  if (typeof secret !== 'string' || !/^[a-f0-9]{64}$/.test(secret) || !address) {
    return new Response(JSON.stringify({ code: 'website_proxy_unavailable', message: 'Registration is temporarily unavailable.' }), {
      status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
  const target = new URL(url.pathname + url.search, registrationService);
  const headers = new Headers(request.headers);
  headers.delete('Host');
  headers.delete('Content-Length');
  for (const name of ['Forwarded', 'X-Forwarded-For', 'X-Forwarded-Proto', 'X-Forwarded-Host', 'X-Real-IP', 'CF-Connecting-IP', 'CF-Connecting-IPv6']) headers.delete(name);
  // Proxy-Authorization is redacted by Caddy's normal request logging.
  headers.set('Proxy-Authorization', `Bearer ${secret}`);
  headers.set('X-FTITC-Visitor-IP', address);

  return fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'manual'
  });
};

const withActivationSecurityHeaders = (response) => {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (proxyPaths.has(url.pathname)) {
      const response = await proxyRegistrationRequest(request, url, env);
      return url.pathname === '/api/registration/activate'
        ? withActivationSecurityHeaders(response)
        : response;
    }
    const response = await env.ASSETS.fetch(request);
    if (url.pathname !== '/activate' && url.pathname !== '/activate.html') return response;
    return withActivationSecurityHeaders(response);
  }
};
