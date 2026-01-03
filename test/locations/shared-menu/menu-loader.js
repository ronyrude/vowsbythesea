(async () => {
  const container = document.getElementById('site-nav');
  if (!container || !container.dataset.include) return;

  try {
    const response = await fetch(container.dataset.include);
    if (!response.ok) throw new Error('Navigation include failed');
    const markup = await response.text();
    container.innerHTML = markup;

    const nav = container.querySelector('.site-nav');
    const toggle = container.querySelector('.site-nav__toggle');
    const links = container.querySelector('.site-nav__links');
    const dropdown = container.querySelector('.site-nav__dropdown');
    const dropdownToggle = container.querySelector('.site-nav__dropdown-toggle');

    const closeNav = () => {
      nav?.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    };

    toggle?.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav?.classList.toggle('is-open');
    });

    dropdownToggle?.addEventListener('click', () => {
      const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      dropdownToggle.setAttribute('aria-expanded', String(!expanded));
      dropdown?.classList.toggle('is-open');
    });

    links?.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (event.target.matches('a')) {
        closeNav();
        dropdown?.classList.remove('is-open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (event) => {
      if (!dropdown?.contains(event.target)) {
        dropdown?.classList.remove('is-open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeNav();
        dropdown?.classList.remove('is-open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
})();