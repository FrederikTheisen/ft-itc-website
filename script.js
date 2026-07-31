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
