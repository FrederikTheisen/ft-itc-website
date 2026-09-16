const registrationService = 'https://app.ft-itc.org';

const proxyPaths = new Set([
  '/api/registration',
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

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (proxyPaths.has(url.pathname)) return proxyRegistrationRequest(request, url);
    return env.ASSETS.fetch(request);
  }
};
