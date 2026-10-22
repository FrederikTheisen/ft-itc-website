import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../_worker.js', import.meta.url), 'utf8');
const worker = (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).default;
const secret = 'a'.repeat(64); // Test fixture only; never a deployment credential.
const routes = ['/api/registration', '/api/registration/activate', '/api/registration/status', '/api/viewer/token'];

async function invoke(path, options = {}) {
  const { address = '198.51.100.7', method = 'GET', extra = {} } = options;
  const configured = Object.hasOwn(options, 'configured') ? options.configured : secret;
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (target, options) => {
    calls.push({ target: target.toString(), ...options, body: options.body ? await new Response(options.body).text() : null });
    return new Response('upstream', { headers: { 'Set-Cookie': 'csrf=test; Secure; HttpOnly', 'X-Upstream': 'preserved' } });
  };
  try {
    const headers = {
      'CF-Connecting-IP': address, 'CF-Connecting-IPv6': '2001:db8:bad::1',
      'Proxy-Authorization': 'Bearer supplied-by-client', 'X-FTITC-Visitor-IP': '203.0.113.99',
      'X-Forwarded-For': '203.0.113.99', 'X-Forwarded-Proto': 'http', 'X-Forwarded-Host': 'evil.invalid',
      Forwarded: 'for=203.0.113.99', 'X-Real-IP': '203.0.113.99',
      Cookie: 'csrf=test', 'X-CSRF-TOKEN': 'csrf-token', Authorization: 'Bearer application-code', ...extra
    };
    if (address === null) delete headers['CF-Connecting-IP'];
    const request = new Request(`https://ft-itc.org${path}`, {
      method, headers, ...(method === 'POST' ? { body: '{"token":"test"}', duplex: 'half' } : {})
    });
    const response = await worker.fetch(request, {
      FTITC_WEBSITE_PROXY_SECRET: configured,
      ASSETS: { fetch: async () => new Response('static asset') }
    });
    return { response, calls };
  } finally { globalThis.fetch = previous; }
}

for (const route of routes) {
  for (const [address, expected] of [
    ['198.51.100.7', '198.51.100.7'],
    ['2001:DB8:1::7', '2001:0db8:0001:0000:0000:0000:0000:0007'],
    ['::ffff:192.0.2.7', '0000:0000:0000:0000:0000:ffff:c000:0207']
  ]) {
    test(`authenticated ${route} preserves the request for ${address}`, async () => {
      const method = route === '/api/registration' || route.endsWith('/activate') ? 'POST' : 'GET';
      const { response, calls } = await invoke(`${route}?verification=1`, { address, method });
      assert.equal(response.status, 200);
      assert.equal(calls.length, 1);
      const sent = calls[0];
      assert.equal(sent.target, `https://app.ft-itc.org${route}?verification=1`);
      assert.equal(sent.method, method);
      assert.equal(sent.redirect, 'manual');
      assert.equal(sent.body, method === 'POST' ? '{"token":"test"}' : null);
      assert.equal(sent.headers.get('Proxy-Authorization'), `Bearer ${secret}`);
      assert.equal(sent.headers.get('X-FTITC-Visitor-IP'), expected);
      for (const name of ['Forwarded', 'X-Forwarded-For', 'X-Forwarded-Proto', 'X-Forwarded-Host', 'X-Real-IP', 'CF-Connecting-IP', 'CF-Connecting-IPv6', 'Host', 'Content-Length'])
        assert.equal(sent.headers.has(name), false, name);
      assert.equal(sent.headers.get('Cookie'), 'csrf=test');
      assert.equal(sent.headers.get('X-CSRF-TOKEN'), 'csrf-token');
      assert.equal(sent.headers.get('Authorization'), 'Bearer application-code');
      assert.equal(response.headers.get('Set-Cookie'), 'csrf=test; Secure; HttpOnly');
      assert.equal(response.headers.get('X-Upstream'), 'preserved');
      if (route.endsWith('/activate')) {
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
        assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
      }
      assert.equal((await response.text()).includes(secret), false);
    });
  }
}

for (const address of [null, '', ' ', '198.51. 100.7', '0198.51.100.7', '256.1.1.1', '1.2.3', 'example.org', '1.2.3.4:80', '2001:db8::g', '2001:::1', '1:2:3:4:5:6:7:8:9', '[::1]', 'fe80::1%eth0', '::1,::2', '1.2.3.4,5.6.7.8']) {
  test(`fails closed for invalid edge address ${JSON.stringify(address)}`, async () => {
    const { response, calls } = await invoke('/api/registration', { address });
    assert.equal(response.status, 503);
    assert.equal(calls.length, 0);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal((await response.text()).includes(secret), false);
  });
}
for (const configured of [undefined, '', 'short', 'A'.repeat(64), `${secret},${secret}`]) {
  test(`fails closed for secret configuration ${configured?.length ?? 'missing'}`, async () => {
    const { response, calls } = await invoke('/api/registration/activate', { configured });
    assert.equal(response.status, 503);
    assert.equal(calls.length, 0);
    assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
    assert.equal((await response.text()).includes(secret), false);
  });
}
for (const path of ['/', '/activate', '/app.js', '/api/internal/health', '/api/registration/extra']) {
  test(`does not send proxy credentials to an unproxied path ${path}`, async () => {
    const { response, calls } = await invoke(path, { configured: null });
    assert.equal(await response.text(), 'static asset');
    assert.equal(calls.length, 0);
    if (path === '/activate') assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
  });
}
