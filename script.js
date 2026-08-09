const site = {
  releases: 'https://github.com/FrederikTheisen/FT-ITC-Analysis/releases',
  webApp: 'https://app.ft-itc.org',
  repository: 'https://github.com/FrederikTheisen/FT-ITC-Analysis',
  issues: 'https://github.com/FrederikTheisen/FT-ITC-Analysis/issues',
  support: 'mailto:support@ft-itc.org'
};

document.querySelectorAll('[data-link]').forEach((link) => {
  const target = site[link.dataset.link];
  if (target) link.href = target;
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
