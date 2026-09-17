const site = {
  download: '/app-desktop#platforms',
  webApp: 'https://app.ft-itc.org',
  repository: 'https://github.com/FrederikTheisen/FT-ITC-Analysis',
  issues: 'https://github.com/FrederikTheisen/FT-ITC-Analysis/issues',
  support: '/support',
  supportEmail: 'mailto:support@ft-itc.org'
};

document.querySelectorAll('[data-link]').forEach((link) => {
  const target = site[link.dataset.link];
  if (target) link.href = target;
});

const installPages = {
  macos: '/install-macos',
  windows: '/install-windows',
  linux: '/install-linux'
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

document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.getAttribute('aria-disabled') === 'true') event.preventDefault();
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
    minimumVersion: '1.4.2',
    assetPattern: /\.dmg$/i,
    downloadLabel: 'Download FT-ITC for macOS',
    releaseDescription: 'Signed and notarized universal application.'
  },
  windows: {
    enabled: true,
    minimumVersion: '1.4.2',
    assetPattern: /_win-x64-setup\.exe$/i,
    downloadLabel: 'Download Windows x64 (.exe)',
    releaseDescription: '64-bit Windows installer.'
  },
  linux: {
    enabled: true,
    minimumVersion: '1.4.2',
    assetPattern: /^ft-itc-analysis_[\d.]+_amd64\.deb$/i,
    downloadLabel: 'Download Linux AMD64 (.deb)',
    releaseDescription: 'AMD64 Debian package for Debian-based desktop Linux.'
  }
};

const releaseStatus = document.querySelector('[data-release-status]');
const releaseVersion = document.querySelector('[data-release-version]');
const releaseDate = document.querySelector('[data-release-date]');
const platformDownload = document.querySelector('[data-platform-download]');
const downloadSignature = document.querySelector('[data-download-signature]');
const downloadChecksum = document.querySelector('[data-download-checksum]');
const linuxChecksumDigestRow = document.querySelector('[data-linux-checksum-digest-row]');
const linuxChecksumDigest = document.querySelector('[data-linux-checksum-digest]');
const linuxVerification = document.querySelector('[data-linux-verification]');
const linuxChecksumVerification = document.querySelector('[data-linux-checksum-verification]');
const linuxInstallCommand = document.querySelector('[data-linux-install-command]');
const linuxChecksumCommand = document.querySelector('[data-linux-checksum-command]');
const currentPlatform = document.body.dataset.platform;
const releasePlatform = releasePlatforms[currentPlatform];

if (releaseStatus && releaseVersion && releaseDate && platformDownload && releasePlatform?.enabled) {
  const releasesApi = 'https://api.github.com/repos/FrederikTheisen/FT-ITC-Analysis/releases?per_page=20';
  const cacheKey = 'ft-itc-release-cache-v2';
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
            .map((asset) => ({ name: asset.name, url: asset.browser_download_url, digest: asset.digest }))
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
    const versionParts = (value) => {
      const match = value.match(/^v?(\d+)\.(\d+)\.(\d+)$/i);
      return match ? match.slice(1).map(Number) : null;
    };
    const isAtLeastMinimumVersion = (value) => {
      const candidate = versionParts(value);
      const minimum = versionParts(releasePlatform.minimumVersion);
      if (!candidate || !minimum) return false;
      for (let index = 0; index < candidate.length; index += 1) {
        if (candidate[index] > minimum[index]) return true;
        if (candidate[index] < minimum[index]) return false;
      }
      return true;
    };
    const release = releases.find((candidate) => isAtLeastMinimumVersion(candidate.tag)
      && candidate.assets.some((asset) => releasePlatform.assetPattern.test(asset.name)));
    const asset = release?.assets.find((candidate) => releasePlatform.assetPattern.test(candidate.name));
    if (!release || !asset) return;

    const signature = release.assets.find((candidate) => candidate.name === `${asset.name}.asc`);
    const checksum = release.assets.find((candidate) => candidate.name === `${asset.name}.sha256`);
    const checksumDigest = typeof asset.digest === 'string' && /^sha256:[a-f\d]{64}$/i.test(asset.digest)
      ? asset.digest.slice('sha256:'.length)
      : null;

    releaseVersion.textContent = release.tag;
    releaseDate.textContent = `Released ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(release.publishedAt))} · ${releasePlatform.releaseDescription}`;
    platformDownload.href = asset.url;
    platformDownload.removeAttribute('aria-disabled');
    platformDownload.classList.remove('is-disabled');
    platformDownload.textContent = releasePlatform.downloadLabel;

    if (currentPlatform === 'linux') {
      if (downloadSignature) {
        downloadSignature.hidden = !signature;
        if (signature) downloadSignature.href = signature.url;
      }
      if (downloadChecksum) {
        downloadChecksum.hidden = !checksum;
        if (checksum) downloadChecksum.href = checksum.url;
      }
      if (linuxChecksumDigestRow) linuxChecksumDigestRow.hidden = !checksumDigest;
      if (linuxChecksumDigest && checksumDigest) linuxChecksumDigest.textContent = checksumDigest;
      if (linuxVerification) linuxVerification.hidden = !(signature || checksum || checksumDigest);
      if (linuxChecksumVerification) linuxChecksumVerification.hidden = !(checksum || checksumDigest);
      if (linuxInstallCommand) linuxInstallCommand.textContent = `sudo apt install ./${asset.name}`;
      if (linuxChecksumCommand) {
        if (checksum) linuxChecksumCommand.textContent = `sha256sum --check ${checksum.name}`;
        if (!checksum && checksumDigest) linuxChecksumCommand.textContent = `echo "${checksumDigest}  ${asset.name}" | sha256sum --check -`;
      }
    }

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

document.querySelectorAll('[data-print-manual]').forEach((button) => {
  button.addEventListener('click', () => window.print());
});

const registrationPage = document.querySelector('[data-registration-page]');
if (registrationPage) {
  const form = registrationPage.querySelector('[data-registration-form]');
  const submit = registrationPage.querySelector('[data-registration-submit]');
  const statusText = registrationPage.querySelector('[data-registration-status]');
  const notice = registrationPage.querySelector('[data-registration-notice]');
  const turnstileBox = registrationPage.querySelector('[data-turnstile-container]');
  const formView = registrationPage.querySelector('[data-registration-form-view]');
  const successView = registrationPage.querySelector('[data-registration-success]');
  const registerAgain = registrationPage.querySelector('[data-registration-again]');
  // The website Worker proxies these calls to the MIST service, keeping API and
  // antiforgery-cookie requests same-origin for visitors on ft-itc.org.
  const registrationApi = '';
  const state = { available: false, termsVersion: 'ft-itc-terms-1.0', privacyVersion: 'ft-itc-privacy-1.0', siteKey: '', csrfToken: '', turnstileToken: '', widgetId: null };

  const noticeMessage = (message, kind = 'error') => { notice.textContent = message; notice.dataset.state = kind; notice.hidden = !message; };
  const fieldError = (field, message) => {
    const input = field === 'terms' ? form.elements.acceptedTerms : field === 'privacy' ? form.elements.acknowledgedPrivacy : form.elements[field];
    const error = registrationPage.querySelector(`[data-error-for="${field}"]`);
    if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
  };
  const enableForm = (enabled) => { state.available = enabled; form.querySelectorAll('input,button').forEach((element) => { element.disabled = !enabled; }); submit.disabled = !enabled; };
  const resetTurnstile = () => { state.turnstileToken = ''; if (window.turnstile && state.widgetId !== null) window.turnstile.reset(state.widgetId); };
  const renderTurnstile = () => {
    if (!window.turnstile || !state.siteKey || !turnstileBox) return;
    state.widgetId = window.turnstile.render(turnstileBox, { sitekey: state.siteKey, callback: (token) => { state.turnstileToken = token; fieldError('turnstile', ''); }, 'expired-callback': () => { state.turnstileToken = ''; fieldError('turnstile', 'The security check expired. Complete it again.'); }, 'error-callback': () => { state.turnstileToken = ''; fieldError('turnstile', 'The security check could not be completed. Try again.'); } });
  };
  const loadTurnstile = () => { const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.defer = true; script.dataset.turnstileApi = 'true'; script.onload = renderTurnstile; document.head.appendChild(script); };
  const validate = () => {
    let valid = true; const name = form.elements.name.value.trim(); const email = form.elements.email.value.trim(); const organisation = form.elements.organisation.value.trim();
    if (!name) { fieldError('name', 'Enter your name.'); valid = false; } else if (name.length > 120) { fieldError('name', 'Use 120 characters or fewer.'); valid = false; } else fieldError('name', '');
    if (!email) { fieldError('email', 'Enter your email address.'); valid = false; } else if (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)) { fieldError('email', 'Enter a valid email address.'); valid = false; } else fieldError('email', '');
    if (organisation.length > 200) { fieldError('organisation', 'Use 200 characters or fewer.'); valid = false; } else fieldError('organisation', '');
    if (!form.elements.acceptedTerms.checked) { fieldError('terms', 'Accept the Terms to continue.'); valid = false; } else fieldError('terms', '');
    if (!form.elements.acknowledgedPrivacy.checked) { fieldError('privacy', 'Acknowledge the Privacy Notice to continue.'); valid = false; } else fieldError('privacy', '');
    if (!state.turnstileToken) { fieldError('turnstile', 'Complete the security check to continue.'); valid = false; } else fieldError('turnstile', ''); return valid;
  };
  const safeMessage = (code) => ({ 403: 'The security check could not be verified. Refresh the page and try again.', 413: 'That request is too large. Shorten the fields and try again.', 429: 'Registration is temporarily rate-limited. Please wait and try again later.', 503: 'Registration is temporarily unavailable. Please try again later.' }[code] || 'We could not submit the request. Please try again later.');
  const loadStatus = async () => {
    try {
      const response = await fetch(`${registrationApi}/api/registration/status`, { credentials: 'include', headers: { Accept: 'application/json' } }); const data = await response.json(); if (!response.ok || !data || typeof data !== 'object') throw new Error();
      state.available = data.available === true || data.enabled === true || data.status === 'available'; state.siteKey = data.siteKey || data.siteKeyPublic || data.turnstileSiteKey || '0x4AAAAAAE43wMfgWhdF6K8P'; state.termsVersion = String(data.termsVersion || data.terms?.version || ''); state.privacyVersion = String(data.privacyVersion || data.privacy?.version || '');
      registrationPage.querySelector('[data-terms-version]')?.replaceChildren(); registrationPage.querySelector('[data-privacy-version]')?.replaceChildren();
      statusText.textContent = state.available ? 'Registration is currently available.' : (data.message || 'Registration is currently paused.'); enableForm(state.available); if (state.available) loadTurnstile(); else noticeMessage(data.message || 'Registration is currently unavailable. Please try again later.');
    } catch { enableForm(false); statusText.textContent = 'Registration availability could not be checked.'; noticeMessage('Registration is temporarily unavailable. Please try again later.'); }
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); noticeMessage(''); if (!validate()) return; submit.disabled = true; submit.textContent = 'Sending…';
    try {
      if (!state.csrfToken) { const tokenResponse = await fetch(`${registrationApi}/api/viewer/token`, { credentials: 'include', headers: { Accept: 'application/json' } }); const tokenData = await tokenResponse.json().catch(() => null); state.csrfToken = tokenData?.requestToken || ''; }
      const response = await fetch(`${registrationApi}/api/registration`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': state.csrfToken }, body: JSON.stringify({ name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), organisation: form.elements.organisation.value.trim(), termsVersion: state.termsVersion, privacyVersion: state.privacyVersion, acceptedTerms: true, acknowledgedPrivacy: true, turnstileToken: state.turnstileToken }) });
      if (response.status === 202) {
        form.reset(); resetTurnstile(); formView.hidden = true; successView.hidden = false;
        successView.focus?.(); statusText.textContent = 'Registration submitted.'; return;
      }
      if (response.status === 400) { const data = await response.json().catch(() => null); if (data?.errors) Object.keys(data.errors).forEach((key) => fieldError(key, 'Check this field.')); } throw new Error(safeMessage(response.status));
    } catch (error) { resetTurnstile(); noticeMessage(error.message || safeMessage(0)); statusText.textContent = 'Registration not submitted.'; } finally { submit.disabled = !state.available; submit.textContent = 'Submit registration'; }
  });
  registerAgain?.addEventListener('click', () => {
    formView.hidden = false; successView.hidden = true; noticeMessage(''); statusText.textContent = state.available ? 'Registration is currently available.' : 'Registration is currently paused.';
    form.elements.name.focus();
  });
  loadStatus();
}
