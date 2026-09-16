export async function onRequest(context) {
  const headers = new Headers(context.request.headers);
  headers.delete('Host');
  headers.delete('Content-Length');
  return fetch('https://app.ft-itc.org/api/registration', {
    method: context.request.method,
    headers,
    body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : context.request.body,
    redirect: 'manual'
  });
}
