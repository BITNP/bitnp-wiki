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

      tocLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${target.target.id}`);
      });
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    }
  );

  headings.forEach(h => observer.observe(h));
});
