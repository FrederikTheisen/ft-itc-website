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

const releasesApi = 'https://api.github.com/repos/FrederikTheisen/FT-ITC-Analysis/releases?per_page=20';
const releaseCacheKey = 'ft-itc-release-cache-v2';
function overviewRelease(version, platforms = Object.keys(filenames), publishedAt = '2026-11-03T10:19:27Z') {
  return {
    tag_name: `v${version}`, published_at: publishedAt, draft: false, prerelease: false,
    assets: platforms.map((platform) => {
      const name = filenames[platform].replaceAll('1.5.0', version);
      return { name, state: 'uploaded', browser_download_url: `${base.replace('1.5.0', version)}${name}` };
    })
  };
}

function runOverviewPage(page, { releases = [], storage, cached = true, fetchFails = false } = {}) {
  const html = readFileSync(new URL(`../${page}.html`, import.meta.url), 'utf8');
  const labels = [...html.matchAll(/<span data-platform-release="([^"]+)">([^<]+)<\/span>/g)]
    .map(([, platform, text]) => ({ dataset: { platformRelease: platform }, textContent: text }));
  assert.equal(labels.length, 3);
  const schemaElement = { textContent: html.match(/<script type="application\/ld\+json" data-release-schema>([\s\S]*?)<\/script>/)[1] };
  const originalSchema = JSON.parse(schemaElement.textContent);
  const fetchCalls = [];
  const cache = storage ?? new Map(cached
    ? [[releaseCacheKey, JSON.stringify({ savedAt: Date.now(), releases })]] : []);
  runInNewContext(source, {
    document: {
      body: { dataset: { page: page === 'index' ? 'home' : 'app' } },
      querySelector: () => null,
      querySelectorAll: (selector) => selector === '[data-platform-release]' ? labels
        : selector === '[data-release-schema]' ? [schemaElement] : []
    },
    URL, Date, Intl, AbortController,
    window: { setTimeout: () => 1, clearTimeout() {} },
    sessionStorage: { getItem: (key) => cache.get(key) ?? null, setItem: (key, value) => cache.set(key, value) },
    fetch: async (url) => {
      fetchCalls.push(url);
      // A strict metadata-only stub: never perform network requests, including installer probes.
      assert.equal(url, releasesApi);
      if (fetchFails) throw new Error('Network unavailable');
      return { ok: true, json: async () => releases };
    }
  });
  return {
    html, originalSchema, storage: cache, fetchCalls,
    versions: () => Object.fromEntries(labels.map((label) => [label.dataset.platformRelease, label.textContent])),
    schema: () => JSON.parse(schemaElement.textContent)
  };
}
const allVersions = (version) => ({ macos: version, windows: version, linux: version });
const softwareEntry = (schema) => schema['@graph'].find((entry) => entry['@type'] === 'SoftwareApplication');

for (const page of ['index', 'app-desktop']) {
  test(`${page}: static platform labels and metadata fall back to 1.5.1`, () => {
    const view = runOverviewPage(page);
    assert.deepEqual(view.versions(), allVersions('v1.5.1'));
    assert.equal(softwareEntry(view.schema()).softwareVersion, '1.5.1');
    for (const platform of Object.keys(filenames)) assert.ok(view.html.includes(`href="/install-${platform}"`));
    if (page === 'index') {
      assert.ok(view.html.includes('FT-ITC Analysis <strong>1.5</strong> is now publicly available.'));
      const banner = view.html.match(/<div class="announcement announcement-release">([\s\S]*?)<\/div>/)[1];
      assert.ok(!banner.includes('data-platform-release'));
    }
  });

  test(`${page}: newer cached stable releases update all cards and only the software version metadata`, () => {
    const current = overviewRelease('1.5.2');
    const ignored = overviewRelease('9.0.0');
    const view = runOverviewPage(page, { releases: [{ ...ignored, draft: true }, { ...ignored, prerelease: true }, current] });
    assert.deepEqual(view.versions(), allVersions('v1.5.2'));
    const expectedSchema = structuredClone(view.originalSchema);
    softwareEntry(expectedSchema).softwareVersion = '1.5.2';
    assert.deepEqual(view.schema(), expectedSchema);
    assert.deepEqual(view.fetchCalls, []);
  });

  test(`${page}: each card follows its own platform's latest available installer`, () => {
    const view = runOverviewPage(page, { releases: [
      overviewRelease('1.5.2', ['windows'], '2026-11-04T10:00:00Z'),
      overviewRelease('1.5.1')
    ] });
    assert.deepEqual(view.versions(), { macos: 'v1.5.1', windows: 'v1.5.2', linux: 'v1.5.1' });
    assert.equal(softwareEntry(view.schema()).softwareVersion, '1.5.2');
  });

  test(`${page}: older cached metadata cannot downgrade 1.5.1 fallbacks`, () => {
    const view = runOverviewPage(page, { releases: [overviewRelease('1.5.0')] });
    assert.deepEqual(view.versions(), allVersions('v1.5.1'));
    assert.deepEqual(view.schema(), view.originalSchema);
    assert.deepEqual(view.fetchCalls, []);
  });

  test(`${page}: fresh lookup requests metadata once and shares its cache with the other overview`, async () => {
    const view = runOverviewPage(page, { releases: [overviewRelease('1.5.2')], cached: false });
    await new Promise(setImmediate);
    assert.deepEqual(view.versions(), allVersions('v1.5.2'));
    assert.deepEqual(view.fetchCalls, [releasesApi]);
    const other = runOverviewPage(page === 'index' ? 'app-desktop' : 'index', { storage: view.storage });
    assert.deepEqual(other.versions(), allVersions('v1.5.2'));
    assert.deepEqual(other.fetchCalls, []);
  });

  test(`${page}: API failure preserves all static versions and schema`, async () => {
    const view = runOverviewPage(page, { cached: false, fetchFails: true });
    await new Promise(setImmediate);
    assert.deepEqual(view.versions(), allVersions('v1.5.1'));
    assert.deepEqual(view.schema(), view.originalSchema);
    assert.deepEqual(view.fetchCalls, [releasesApi]);
  });
}

test('expired overview cache refreshes from metadata without requesting installer URLs', async () => {
  const storage = new Map([[releaseCacheKey, JSON.stringify({ savedAt: Date.now() - 31 * 60 * 1000, releases: [release] })]]);
  const view = runOverviewPage('index', { storage, releases: [overviewRelease('1.5.2')] });
  await new Promise(setImmediate);
  assert.deepEqual(view.versions(), allVersions('v1.5.2'));
  assert.deepEqual(view.fetchCalls, [releasesApi]);
});

test('overview metadata compares numeric versions when platforms have different releases', () => {
  const view = runOverviewPage('index', { releases: [
    overviewRelease('1.5.2', ['windows'], '2026-11-05T10:00:00Z'),
    overviewRelease('1.5.10', ['macos'], '2026-11-04T10:00:00Z'),
    overviewRelease('1.5.1', ['linux'])
  ] });
  assert.deepEqual(view.versions(), { macos: 'v1.5.10', windows: 'v1.5.2', linux: 'v1.5.1' });
  assert.equal(softwareEntry(view.schema()).softwareVersion, '1.5.10');
});
