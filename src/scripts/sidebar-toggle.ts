document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector<HTMLButtonElement>('.toolbar-sidebar-toggle');
  const overlay = document.querySelector<HTMLDivElement>('.mobile-sidebar-overlay');
  if (!toggle) return;

  const mql = window.matchMedia('(max-width: 65rem)');

  function updatePressed() {
    if (mql.matches) {
      const open = document.body.classList.contains('mobile-sidebar-open');
      toggle.setAttribute('aria-pressed', String(open));
    } else {
      const collapsed = document.documentElement.classList.contains('sidebar-collapsed');
      toggle.setAttribute('aria-pressed', String(collapsed));
    }
  }

  toggle.addEventListener('click', () => {
    if (mql.matches) {
      const open = document.body.classList.toggle('mobile-sidebar-open');
      toggle.setAttribute('aria-pressed', String(open));
    } else {
      const collapsed = document.documentElement.classList.toggle('sidebar-collapsed');
      toggle.setAttribute('aria-pressed', String(collapsed));
      try {
        localStorage.setItem('bitnp-wiki-sidebar-collapsed', String(collapsed));
      } catch (e) {}
    }
  });

  overlay?.addEventListener('click', () => {
    document.body.classList.remove('mobile-sidebar-open');
    updatePressed();
  });

  mql.addEventListener('change', updatePressed);
  updatePressed();
});
