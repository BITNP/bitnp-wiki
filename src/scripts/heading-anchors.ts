document.addEventListener('DOMContentLoaded', () => {
  const headings = document.querySelectorAll('article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]');

  headings.forEach(heading => {
    const anchor = document.createElement('a');
    anchor.href = `#${heading.id}`;
    anchor.className = 'heading-anchor';
    const level = parseInt(heading.tagName[1], 10);
    anchor.textContent = '#'.repeat(level);
    anchor.setAttribute('aria-hidden', 'true');

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const url = new URL(window.location.href);
      url.hash = heading.id;
      const link = url.toString();

      navigator.clipboard.writeText(link).catch(() => {
        // Fallback for browsers without clipboard API
      });

      window.history.replaceState(null, '', link);
      heading.scrollIntoView({ behavior: 'smooth' });
    });

    heading.insertBefore(anchor, heading.firstChild);
  });
});
