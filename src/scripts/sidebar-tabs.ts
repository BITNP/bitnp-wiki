document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.sidebar-tab');
  const panels = document.querySelectorAll('.sidebar-panel');
  const searchInput = document.querySelector('.search-input') as HTMLInputElement | null;
  const searchResults = document.querySelector('.search-results');
  const docs: Array<{ id: string; title: string; slug: string }> = (window as any).__SEARCH_DOCS__ || [];

  function switchTab(tabName: string) {
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });
    panels.forEach(panel => {
      panel.classList.toggle('active', panel.getAttribute('data-panel') === tabName);
    });
    if (tabName === 'search' && searchInput) {
      searchInput.focus();
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) switchTab(tabName);
    });
  });

  function renderSearchResults(query: string) {
    if (!searchResults) return;
    searchResults.innerHTML = '';
    if (!query.trim()) return;

    const q = query.toLowerCase();
    const matched = docs.filter(d =>
      d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)
    );

    if (matched.length === 0) {
      searchResults.innerHTML = '<li class="search-no-results">无结果</li>';
      return;
    }

    matched.forEach(doc => {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      const a = document.createElement('a');
      a.href = doc.slug;
      a.className = 'search-result-link';
      a.textContent = doc.title;
      li.appendChild(a);
      searchResults.appendChild(li);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults((e.target as HTMLInputElement).value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        renderSearchResults('');
        switchTab('nav');
      }
    });
  }
});
