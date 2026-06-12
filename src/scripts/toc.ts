document.addEventListener('DOMContentLoaded', () => {
  const tocLinks = document.querySelectorAll('.toc-link');
  const headings = document.querySelectorAll('article h2[id], article h3[id]');
  if (!tocLinks.length || !headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      const target = visible[0];
      if (!target) return;

      let activeLink: Element | null = null;
      tocLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${target.target.id}`;
        link.classList.toggle('active', isActive);
        if (isActive) activeLink = link;
      });

      activeLink!.scrollIntoView({ behavior: 'smooth', block: 'nearest', container: 'nearest' });
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    }
  );

  headings.forEach(h => observer.observe(h));
});
