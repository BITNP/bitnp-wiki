document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector<HTMLButtonElement>('.toolbar-sidebar-toggle');
  if (!toggle) return;

  toggle.setAttribute(
    'aria-pressed',
    String(document.documentElement.classList.contains('sidebar-collapsed'))
  );

  toggle.addEventListener('click', () => {
    const collapsed = document.documentElement.classList.toggle('sidebar-collapsed');
    toggle.setAttribute('aria-pressed', String(collapsed));
    try {
      localStorage.setItem('bitnp-wiki-sidebar-collapsed', String(collapsed));
    } catch (e) {}
  });
});
