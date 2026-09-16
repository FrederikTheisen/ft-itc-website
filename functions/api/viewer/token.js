export async function onRequestGet(context) {
  return fetch('https://app.ft-itc.org/api/viewer/token', {
    method: 'GET',
    headers: { Accept: context.request.headers.get('Accept') || 'application/json' }
  });
}
