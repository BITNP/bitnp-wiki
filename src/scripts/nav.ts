document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll<HTMLButtonElement>('.nav-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const navItem = toggle.closest('.nav-item');
      if (!navItem) return;

      const children = navItem.querySelector('.nav-children') as HTMLElement | null;
      if (!children) return;

      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        children.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        navItem.classList.remove('expanded');
      } else {
        children.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        navItem.classList.add('expanded');
      }
    });
  });
});
