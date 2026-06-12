type SearchModule = typeof import('./search');

let searchModulePromise: Promise<SearchModule> | null = null;

function ensureSearchLoaded(): Promise<SearchModule> {
  if (!searchModulePromise) {
    searchModulePromise = import('./search');
  }
  return searchModulePromise;
}

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.sidebar-tab');
  const panels = document.querySelectorAll('.sidebar-panel');
  const searchInput = document.querySelector('.search-input') as HTMLInputElement | null;
  const searchResults = document.querySelector('.search-results');

  function switchTab(tabName: string) {
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });
    panels.forEach(panel => {
      panel.classList.toggle('active', panel.getAttribute('data-panel') === tabName);
    });
    if (tabName === 'search' && searchInput) {
      searchInput.focus();
      ensureSearchLoaded();
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      if (tabName) switchTab(tabName);
    });
  });

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function renderSearchResults(query: string) {
    if (!searchResults) return;
    searchResults.innerHTML = '';

    if (!query.trim()) {
      searchResults.innerHTML = '<li class="search-hint">输入关键词搜索页面内容...</li>';
      return;
    }

    searchResults.innerHTML = '<li class="search-hint">搜索中...</li>';

    const { search, getDocSnippets } = await ensureSearchLoaded();
    const docResults = await search(query);

    searchResults.innerHTML = '';

    if (docResults.length === 0) {
      searchResults.innerHTML = '<li class="search-no-results">无结果</li>';
      return;
    }

    // Show total results count
    const totalMatches = docResults.reduce((sum, r) => {
      return sum + r.matches.reduce((mSum, m) => mSum + m.indices.length, 0);
    }, 0);

    const countDiv = document.createElement('div');
    countDiv.className = 'search-result-count';
    countDiv.textContent = `找到 ${docResults.length} 个文档，共 ${totalMatches} 处匹配`;
    searchResults.appendChild(countDiv);

    // Render each document group
    docResults.forEach(docResult => {
      const docGroup = document.createElement('li');
      docGroup.className = 'search-doc-group';

      // Document header with title and match count
      const header = document.createElement('a');
      header.className = 'search-doc-header';
      header.href = docResult.doc.slug;

      const titleLink = document.createElement('div');
      titleLink.className = 'search-doc-title';
      titleLink.textContent = docResult.doc.title;

      const matchCount = document.createElement('span');
      matchCount.className = 'search-doc-match-count';
      const matchNum = docResult.matches.reduce((sum, m) => sum + m.indices.length, 0);
      matchCount.textContent = `${matchNum} 处匹配`;

      header.appendChild(titleLink);
      header.appendChild(matchCount);
      docGroup.appendChild(header);

      // Snippets list
      const snippets = getDocSnippets(docResult, docResult.doc.slug);
      if (snippets.length > 0) {
        const snippetList = document.createElement('ul');
        snippetList.className = 'search-snippet-list';

        snippets.forEach(snippet => {
          const snippetItem = document.createElement('li');
          snippetItem.className = 'search-snippet-item';

          const snippetLink = document.createElement('a');
          snippetLink.href = snippet.url;
          snippetLink.className = 'search-snippet-link';

          const snippetText = document.createElement('div');
          snippetText.className = snippet.isTitle ? 'search-snippet-title' : 'search-snippet-text';
          snippetText.innerHTML = snippet.text;

          snippetLink.appendChild(snippetText);
          snippetItem.appendChild(snippetLink);
          snippetList.appendChild(snippetItem);
        });

        docGroup.appendChild(snippetList);
      }

      searchResults.appendChild(docGroup);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderSearchResults(value);
      }, 150);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        renderSearchResults('');
        switchTab('nav');
      }
    });

    // Show hint on initial focus
    if (searchResults && searchResults.children.length === 0) {
      searchResults.innerHTML = '<li class="search-hint">输入关键词搜索页面内容...</li>';
    }
  }
});
