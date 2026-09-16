export async function onRequestGet(context) {
  const target = new URL('https://app.ft-itc.org/api/registration/status');
  target.search = new URL(context.request.url).search;
  return fetch(target, {
    method: 'GET',
    headers: { Accept: context.request.headers.get('Accept') || 'application/json' }
  });
}
