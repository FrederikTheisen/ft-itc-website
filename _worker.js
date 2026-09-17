const registrationService = 'https://app.ft-itc.org';

const proxyPaths = new Set([
  '/api/registration',
  '/api/registration/activate',
  '/api/registration/status',
  '/api/viewer/token'
]);

const proxyRegistrationRequest = (request, url) => {
  const target = new URL(url.pathname + url.search, registrationService);
  const headers = new Headers(request.headers);
  headers.delete('Host');
  headers.delete('Content-Length');

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
      const response = await proxyRegistrationRequest(request, url);
      return url.pathname === '/api/registration/activate'
        ? withActivationSecurityHeaders(response)
        : response;
    }
    const response = await env.ASSETS.fetch(request);
    if (url.pathname !== '/activate' && url.pathname !== '/activate.html') return response;
    return withActivationSecurityHeaders(response);
  }
};
