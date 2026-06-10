async function initMermaid(): Promise<void> {
  const mermaid = (await import('mermaid')).default;
  const blocks = document.querySelectorAll<HTMLElement>(
    'pre[data-language="mermaid"] code, pre code.language-mermaid'
  );

  if (blocks.length === 0) return;

  mermaid.initialize({ startOnLoad: false });

  for (let i = 0; i < blocks.length; i++) {
    const code = blocks[i];
    const pre = code.parentElement;
    if (!pre) continue;

    let chart = code.textContent?.trim() || '';

    let width = '';
    let height = '';
    let align = '';
    let border = false;

    if (chart.startsWith('%%')) {
      const [styleLine, ...rest] = chart.split('\n');
      chart = rest.join('\n');
      width = styleLine.match(/width=(\w+)/)?.[1] || '';
      height = styleLine.match(/height=(\w+)/)?.[1] || '';
      align = styleLine.includes('center') ? 'center' : '';
      border = styleLine.includes('border');
    }

    const container = document.createElement('div');
    container.className = 'mermaid-container';
    container.style.margin = '1em 0';

    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-diagram';

    if (border) {
      wrapper.style.border = '1px solid #ddd';
      wrapper.style.padding = '12px';
      wrapper.style.background = '#fff';
    }

    if (width) {
      container.style.width = width.includes('px') ? width : width + 'px';
      container.style.maxWidth = container.style.width;
    }

    if (height) {
      wrapper.style.height = height.includes('px') ? height : height + 'px';
    }

    if (align === 'center' && width) {
      container.style.margin = '1em auto';
    }

    try {
      const { svg } = await mermaid.render(
        'mermaid-' + i + '-' + Date.now(),
        chart
      );
      wrapper.innerHTML = svg;

      const svgEl = wrapper.querySelector('svg');
      if (svgEl) {
        if (!height) svgEl.style.height = 'auto';
        if (!width) svgEl.style.maxWidth = '100%';
      }

      container.appendChild(wrapper);
      pre.parentNode?.replaceChild(container, pre);
    } catch (err) {
      console.warn('Mermaid diagram ' + (i + 1) + ' failed, keeping as code block');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMermaid);
} else {
  initMermaid();
}
