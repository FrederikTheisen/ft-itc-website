const site = {
  download: 'app-desktop.html#platforms',
  webApp: 'https://app.ft-itc.org',
  repository: 'https://github.com/FrederikTheisen/FT-ITC-Analysis',
  issues: 'https://github.com/FrederikTheisen/FT-ITC-Analysis/issues',
  support: 'mailto:support@ft-itc.org'
};

document.querySelectorAll('[data-link]').forEach((link) => {
  const target = site[link.dataset.link];
  if (target) link.href = target;
});

const installPages = {
  macos: 'install-macos.html',
  windows: 'install-windows.html',
  linux: 'install-linux.html'
};

const detectDesktopPlatform = () => {
  const userAgent = navigator.userAgent || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const identity = `${platform} ${userAgent}`;

  if (/Android|iPhone|iPad|iPod|Mobile|CrOS|Chrome OS/i.test(identity)) return null;
  if (/Mac|macOS/i.test(identity)) return 'macos';
  if (/Win|Windows/i.test(identity)) return 'windows';
  if (/Linux|X11/i.test(identity)) return 'linux';
  return null;
};

document.querySelectorAll('[data-link="download"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const platform = detectDesktopPlatform();
    const target = platform ? installPages[platform] : null;
    if (!target) return;
    event.preventDefault();
    window.location.assign(target);
  });
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const active = document.body.dataset.page;
document.querySelector(`[data-nav="${active}"]`)?.setAttribute('aria-current', 'page');
document.querySelectorAll('[data-year]').forEach((year) => { year.textContent = new Date().getFullYear(); });

const releasePlatforms = {
  macos: {
    enabled: true,
    assetPattern: /\.dmg$/i
  },
  windows: {
    enabled: false,
    assetPattern: /\.(msi|exe)$/i
  },
  linux: {
    enabled: false,
    assetPattern: null
  }
};

const releaseStatus = document.querySelector('[data-release-status]');
const releaseVersion = document.querySelector('[data-release-version]');
const releaseDate = document.querySelector('[data-release-date]');
const platformDownload = document.querySelector('[data-platform-download]');
const currentPlatform = document.body.dataset.platform;
const releasePlatform = releasePlatforms[currentPlatform];

if (releaseStatus && releaseVersion && releaseDate && platformDownload && releasePlatform?.enabled) {
  const releasesApi = 'https://api.github.com/repos/FrederikTheisen/FT-ITC-Analysis/releases?per_page=20';
  const cacheKey = 'ft-itc-release-cache-v1';
  const cacheLifetime = 30 * 60 * 1000;

  const isValidDownloadUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'github.com';
    } catch {
      return false;
    }
  };

  const normalizeReleases = (payload) => {
    if (!Array.isArray(payload)) return [];
    return payload
      .filter((release) => !release?.draft && !release?.prerelease && typeof release?.tag_name === 'string')
      .map((release) => ({
        tag: release.tag_name,
        publishedAt: release.published_at,
        assets: Array.isArray(release.assets)
          ? release.assets
            .filter((asset) => asset?.state === 'uploaded' && typeof asset?.name === 'string' && isValidDownloadUrl(asset?.browser_download_url))
            .map((asset) => ({ name: asset.name, url: asset.browser_download_url }))
          : []
      }))
      .filter((release) => release.publishedAt && !Number.isNaN(Date.parse(release.publishedAt)))
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  };

  const readCachedReleases = () => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey));
      if (!cached || Date.now() - cached.savedAt > cacheLifetime) return null;
      return normalizeReleases(cached.releases);
    } catch {
      return null;
    }
  };

  const cacheReleases = (releases) => {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), releases }));
    } catch {
      // The release panel keeps its direct-download fallback when storage is unavailable.
    }
  };

  const fetchReleases = async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(releasesApi, {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Release lookup failed');
      const payload = await response.json();
      const releases = normalizeReleases(payload);
      cacheReleases(payload);
      return releases;
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const showRelease = (releases) => {
    const release = releases.find((candidate) => candidate.assets.some((asset) => releasePlatform.assetPattern.test(asset.name)));
    const asset = release?.assets.find((candidate) => releasePlatform.assetPattern.test(candidate.name));
    if (!release || !asset) return;

    releaseVersion.textContent = release.tag;
    releaseDate.textContent = `Released ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(release.publishedAt))} · Signed and notarized universal application.`;
    platformDownload.href = asset.url;
    releaseStatus.dataset.releaseStatus = 'available';
  };

  const cachedReleases = readCachedReleases();
  if (cachedReleases) {
    showRelease(cachedReleases);
  } else {
    fetchReleases().then(showRelease).catch(() => {
      // Static content and the stable direct-download URL remain available.
    });
  }
}

const viewerStatusCard = document.querySelector('[data-viewer-status]');
const viewerStatusText = document.querySelector('[data-viewer-status-text]');
const viewerStatusDescription = document.querySelector('[data-viewer-status-description]');

if (viewerStatusCard && viewerStatusText && viewerStatusDescription) {
  const setViewerStatus = (state) => {
    viewerStatusCard.dataset.viewerStatus = state;

    if (state === 'online') {
      viewerStatusText.textContent = 'Online.';
      viewerStatusDescription.textContent = 'Open a project in the browser for easy sharing and review.';
      return;
    }

    if (state === 'unavailable') {
      viewerStatusText.textContent = 'Temporarily unavailable.';
      viewerStatusDescription.textContent = 'Please try again shortly.';
      return;
    }

    viewerStatusText.textContent = 'Checking availability…';
    viewerStatusDescription.textContent = 'Open a project in the browser for easy sharing and review.';
  };

  const checkViewerStatus = () => {
    setViewerStatus('checking');

    const probe = new Image();
    let settled = false;
    const finish = (state) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      setViewerStatus(state);
    };
    const timeout = window.setTimeout(() => {
      probe.src = '';
      finish('unavailable');
    }, 8000);

    probe.onload = () => {
      finish('online');
    };
    probe.onerror = () => {
      finish('unavailable');
    };
    probe.src = `${site.webApp}/assets/ft-itc-icon-32.png?status=${Date.now()}`;
  };

  checkViewerStatus();
  window.setInterval(checkViewerStatus, 60000);
}
