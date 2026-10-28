import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const base = 'https://github.com/FrederikTheisen/FT-ITC-Analysis/releases/download/v1.5.0/';
const filenames = {
  macos: 'ft-itc-analysis_1.5.0_macos-universal.dmg',
  windows: 'FT-ITC-Analysis-1.5.0-win-x64-setup.exe',
  linux: 'ft-itc-analysis_1.5.0_amd64.deb'
};
const linuxDigest = '340acfa11ffde2924d7e6f92e532beb53edea309555f9e0f854fe4e3ef78a597';
// Published v1.5.0 asset names and Linux digest, verified against GitHub on 28 Oct 2026.
const release = {
  tag_name: 'v1.5.0', published_at: '2026-10-28T11:06:53Z', draft: false, prerelease: false,
  assets: Object.values(filenames).map((name) => ({
    name, state: 'uploaded', browser_download_url: base + name,
    ...(name.endsWith('.deb') ? { digest: `sha256:${linuxDigest}` } : {})
  }))
};

function runReleasePage(platform, releases, failFetch = false) {
  const elements = new Map();
  for (const key of ['release-status', 'release-version', 'release-date', 'platform-download',
    'download-signature', 'download-checksum', 'linux-checksum-digest-row', 'linux-checksum-digest',
    'linux-verification', 'linux-checksum-verification', 'linux-install-command', 'linux-checksum-command',
    'release-number', 'installer-filename']) {
    elements.set(`[data-${key}]`, {
      textContent: 'static fallback', href: 'static download', hidden: false, dataset: {},
      removeAttribute() {}, classList: { remove() {} }
    });
  }
  const document = {
    body: { dataset: { platform, page: 'app' } },
    querySelector: (selector) => elements.get(selector) ?? null,
    querySelectorAll: (selector) => ['[data-release-number]', '[data-installer-filename]'].includes(selector)
      ? [elements.get(selector)] : []
  };
  runInNewContext(source, {
    document, URL, Date, Intl, AbortController,
    window: { setTimeout: () => 1, clearTimeout() {} },
    sessionStorage: { getItem: () => failFetch ? null : JSON.stringify({ savedAt: Date.now(), releases }) },
    fetch: async () => { throw new Error('Network unavailable'); }
  });
  return (name) => elements.get(`[data-${name}]`);
}

for (const platform of Object.keys(filenames)) {
  test(`${platform}: static installer and metadata match the published release`, () => {
    const html = readFileSync(new URL(`../install-${platform}.html`, import.meta.url), 'utf8');
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const software = schema['@graph'].find((entry) => entry['@type'] === 'SoftwareApplication');
    assert.equal(software.softwareVersion, '1.5.0');
    assert.equal(software.downloadUrl, base + filenames[platform]);
    assert.ok(html.includes(`data-platform-download href="${base + filenames[platform]}"`));
    assert.ok(html.includes('Released 28 Oct 2026'));
    assert.ok(!html.includes('1.4.2'));
    if (platform === 'linux') {
      assert.ok(html.includes(`data-download-signature href="#" hidden`));
      assert.ok(html.includes(`echo "${linuxDigest}  ${filenames.linux}" | sha256sum --check -`));
    }
  });

  test(`${platform}: cached public release selects the correct installer`, () => {
    const ignored = { ...release, tag_name: 'v9.0.0', published_at: '2026-10-29T11:00:00Z' };
    const get = runReleasePage(platform, [{ ...ignored, draft: true }, { ...ignored, prerelease: true }, release]);
    assert.equal(get('release-version').textContent, 'v1.5.0');
    assert.equal(get('release-number').textContent, '1.5.0');
    assert.equal(get('platform-download').href, base + filenames[platform]);
    assert.equal(get('installer-filename').textContent, filenames[platform]);
    assert.equal(get('release-status').dataset.releaseStatus, 'available');
    if (platform === 'linux') {
      assert.equal(get('download-signature').hidden, true);
      assert.equal(get('download-checksum').hidden, true);
      assert.equal(get('linux-checksum-digest').textContent, linuxDigest);
      assert.equal(get('linux-install-command').textContent, `sudo apt install ./${filenames.linux}`);
      assert.equal(get('linux-checksum-command').textContent, `echo "${linuxDigest}  ${filenames.linux}" | sha256sum --check -`);
    }
  });
}

test('a cached older release cannot downgrade the static 1.5.0 installer', () => {
  const get = runReleasePage('windows', [{ ...release, tag_name: 'v1.4.2' }]);
  assert.equal(get('platform-download').href, 'static download');
  assert.equal(get('release-version').textContent, 'static fallback');
});

test('a newer Windows release keeps introductory version and setup filename in sync', () => {
  const updated = JSON.parse(JSON.stringify(release).replaceAll('1.5.0', '1.5.1'));
  const get = runReleasePage('windows', [updated]);
  assert.equal(get('release-version').textContent, 'v1.5.1');
  assert.equal(get('release-number').textContent, '1.5.1');
  assert.equal(get('installer-filename').textContent, 'FT-ITC-Analysis-1.5.1-win-x64-setup.exe');
});

test('API failure preserves the static download fallback', async () => {
  const get = runReleasePage('windows', [], true);
  await new Promise(setImmediate);
  assert.equal(get('platform-download').href, 'static download');
  assert.equal(get('release-version').textContent, 'static fallback');
});
