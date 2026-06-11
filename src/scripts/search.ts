import Fuse from 'fuse.js';

interface SearchDoc {
  id: string;
  title: string;
  slug: string;
  description: string;
  text: string;
  pinyin: string;
}

interface SearchMatch {
  text: string;
  indices: readonly number[][];
  key: string;
}

interface DocResult {
  doc: SearchDoc;
  score: number;
  matches: SearchMatch[];
}

let fuse: Fuse<SearchDoc> | null = null;
let docs: SearchDoc[] = [];
let isLoading = false;
let loadError = false;

async function loadIndex(): Promise<void> {
  if (fuse || isLoading) return;
  isLoading = true;

  try {
    const res = await fetch('/search-index.json');
    if (!res.ok) throw new Error('Failed to load search index');
    docs = await res.json();

    fuse = new Fuse(docs, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'text', weight: 0.3 },
        { name: 'description', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      minMatchCharLength: 1,
    });
  } catch {
    loadError = true;
  } finally {
    isLoading = false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function looksLikePinyin(query: string): boolean {
  return /^[a-zA-Z0-9\s]+$/.test(query) && query.trim().length >= 2;
}

function findPinyinMatches(query: string): DocResult[] {
  const q = query.toLowerCase().trim();
  const results: DocResult[] = [];

  for (const doc of docs) {
    const matches: SearchMatch[] = [];
    let idx = doc.pinyin.indexOf(q);

    if (idx !== -1) {
      // Find all occurrences in pinyin
      const indices: number[][] = [];
      while (idx !== -1) {
        indices.push([idx, idx + q.length - 1]);
        idx = doc.pinyin.indexOf(q, idx + 1);
      }

      // Map pinyin indices back to text indices
      // We need to find the corresponding positions in the original text
      // This is approximate since pinyin removes spaces
      const textIndices = mapPinyinIndicesToText(doc.text, doc.pinyin, indices);

      matches.push({
        text: doc.text,
        indices: textIndices,
        key: 'text',
      });

      const score = indices[0][0] / doc.pinyin.length;

      results.push({
        doc,
        score,
        matches,
      });
    }
  }

  return results.sort((a, b) => a.score - b.score);
}

function mapPinyinIndicesToText(text: string, pinyin: string, pinyinIndices: number[][]): number[][] {
  // Create a mapping from pinyin position to text position
  // This is approximate but good enough for highlighting
  const textWithoutSpaces = text.replace(/\s/g, '');
  const ratio = textWithoutSpaces.length / pinyin.length;

  return pinyinIndices.map(([start, end]) => {
    const textStart = Math.floor(start * ratio);
    const textEnd = Math.min(Math.floor((end + 1) * ratio) - 1, textWithoutSpaces.length - 1);
    return [textStart, Math.max(textEnd, textStart)];
  });
}

function getAllMatches(
  doc: SearchDoc,
  fuseMatches: readonly Fuse.FuseResultMatch[] | undefined,
  query: string
): SearchMatch[] {
  const matches: SearchMatch[] = [];

  // Add fuse matches if available
  if (fuseMatches) {
    for (const match of fuseMatches) {
      if (match.indices && match.indices.length > 0) {
        matches.push({
          text: match.value || '',
          indices: match.indices,
          key: match.key || 'text',
        });
      }
    }
  }

  // If no fuse matches on text, do a direct search on text
  const hasTextMatch = matches.some(m => m.key === 'text' || m.key === 'description');

  if (!hasTextMatch && (doc.text || doc.description)) {
    const textToSearch = doc.text || doc.description || '';
    const lowerQuery = query.toLowerCase();
    const lowerText = textToSearch.toLowerCase();
    const indices: number[][] = [];
    let idx = lowerText.indexOf(lowerQuery);

    while (idx !== -1) {
      indices.push([idx, idx + query.length - 1]);
      idx = lowerText.indexOf(lowerQuery, idx + 1);
    }

    if (indices.length > 0) {
      matches.push({
        text: textToSearch,
        indices,
        key: 'text',
      });
    }
  }

  // If no title match, do direct search on title
  const hasTitleMatch = matches.some(m => m.key === 'title');

  if (!hasTitleMatch && doc.title) {
    const lowerQuery = query.toLowerCase();
    const lowerTitle = doc.title.toLowerCase();
    const indices: number[][] = [];
    let idx = lowerTitle.indexOf(lowerQuery);

    while (idx !== -1) {
      indices.push([idx, idx + query.length - 1]);
      idx = lowerTitle.indexOf(lowerQuery, idx + 1);
    }

    if (indices.length > 0) {
      matches.push({
        text: doc.title,
        indices,
        key: 'title',
      });
    }
  }

  return matches;
}

function extractSnippets(text: string, indices: readonly number[][], contextChars: number = 40): Array<{ snippet: string; highlightStart: number; highlightEnd: number }> {
  if (!indices || indices.length === 0) return [];

  const snippets: Array<{ snippet: string; highlightStart: number; highlightEnd: number }> = [];
  const usedRanges: Array<[number, number]> = [];

  for (const [matchStart, matchEnd] of indices) {
    // Calculate snippet boundaries with context
    let snippetStart = Math.max(0, matchStart - contextChars);
    let snippetEnd = Math.min(text.length, matchEnd + contextChars + 1);

    // Expand to word boundaries
    while (snippetStart > 0 && text[snippetStart - 1] !== ' ' && text[snippetStart - 1] !== '\n' && text[snippetStart - 1] !== '。' && text[snippetStart - 1] !== '，') {
      snippetStart--;
    }
    while (snippetEnd < text.length && text[snippetEnd] !== ' ' && text[snippetEnd] !== '\n' && text[snippetEnd] !== '。' && text[snippetEnd] !== '，') {
      snippetEnd++;
    }

    // Check if this overlaps with an existing snippet
    let overlaps = false;
    for (const [usedStart, usedEnd] of usedRanges) {
      if (snippetStart < usedEnd && snippetEnd > usedStart) {
        overlaps = true;
        break;
      }
    }

    if (overlaps) continue;

    usedRanges.push([snippetStart, snippetEnd]);

    const snippet = text.slice(snippetStart, snippetEnd);
    const highlightStart = matchStart - snippetStart;
    const highlightEnd = matchEnd - snippetStart;

    snippets.push({
      snippet,
      highlightStart,
      highlightEnd,
    });
  }

  return snippets;
}

function highlightSnippet(snippet: string, highlightStart: number, highlightEnd: number): string {
  const before = escapeHtml(snippet.slice(0, highlightStart));
  const match = escapeHtml(snippet.slice(highlightStart, highlightEnd + 1));
  const after = escapeHtml(snippet.slice(highlightEnd + 1));

  const prefix = before.length > 0 || highlightStart > 0 ? '…' : '';
  const suffix = after.length > 0 || highlightEnd < snippet.length - 1 ? '…' : '';

  return prefix + before + `<mark>${match}</mark>` + after + suffix;
}

function highlightText(text: string, indices: readonly number[][]): string {
  if (!indices || indices.length === 0) return escapeHtml(text.slice(0, 120));

  // Use the first match for a single preview
  const [start, end] = indices[0];
  let snippetStart = Math.max(0, start - 40);
  let snippetEnd = Math.min(text.length, end + 41);

  // Expand to word boundaries
  while (snippetStart > 0 && text[snippetStart - 1] !== ' ' && text[snippetStart - 1] !== '\n') {
    snippetStart--;
  }
  while (snippetEnd < text.length && text[snippetEnd] !== ' ' && text[snippetEnd] !== '\n') {
    snippetEnd++;
  }

  let result = '';
  let lastIndex = snippetStart;
  const relevantIndices = indices
    .filter(([s, e]) => s >= snippetStart && e <= snippetEnd)
    .sort((a, b) => a[0] - b[0]);

  for (const [s, e] of relevantIndices) {
    if (s > lastIndex) result += escapeHtml(text.slice(lastIndex, s));
    result += `<mark>${escapeHtml(text.slice(s, e + 1))}</mark>`;
    lastIndex = e + 1;
  }
  if (lastIndex < snippetEnd) result += escapeHtml(text.slice(lastIndex, snippetEnd));

  const prefix = snippetStart > 0 ? '…' : '';
  const suffix = snippetEnd < text.length ? '…' : '';
  return prefix + result + suffix;
}

export async function search(query: string): Promise<DocResult[]> {
  await loadIndex();

  if (loadError) return [];
  if (!query.trim()) return [];

  const q = query.trim();
  const results: DocResult[] = [];
  const seenDocs = new Set<string>();

  // Pinyin search first if applicable
  if (looksLikePinyin(q)) {
    const pinyinResults = findPinyinMatches(q);
    for (const r of pinyinResults) {
      results.push(r);
      seenDocs.add(r.doc.id);
    }
  }

  // Fuse.js search
  if (fuse) {
    const fuseResults = fuse.search(q);
    for (const r of fuseResults) {
      if (!seenDocs.has(r.item.id)) {
        const matches = getAllMatches(r.item, r.matches, q);
        results.push({
          doc: r.item,
          score: r.score ?? 1,
          matches,
        });
        seenDocs.add(r.item.id);
      } else {
        // Merge matches with existing result
        const existing = results.find(res => res.doc.id === r.item.id);
        if (existing) {
          const newMatches = getAllMatches(r.item, r.matches, q);
          for (const newMatch of newMatches) {
            const existingMatch = existing.matches.find(m => m.key === newMatch.key);
            if (existingMatch) {
              // Merge indices
              const allIndices = [...existingMatch.indices, ...newMatch.indices];
              existingMatch.indices = allIndices;
            } else {
              existing.matches.push(newMatch);
            }
          }
          existing.score = Math.min(existing.score, r.score ?? 1);
        }
      }
    }
  }

  // Sort by score
  results.sort((a, b) => a.score - b.score);

  return results;
}

function encodeTextFragment(text: string): string {
  return encodeURIComponent(text);
}

export function getDocSnippets(docResult: DocResult, slug: string): Array<{ text: string; isTitle: boolean; url: string }> {
  const snippets: Array<{ text: string; isTitle: boolean; url: string }> = [];

  for (const match of docResult.matches) {
    if (match.key === 'title') {
      const titleSnippet = highlightText(match.text, match.indices);
      snippets.push({ text: titleSnippet, isTitle: true, url: slug });
    } else {
      // Extract multiple snippets for text matches
      const textSnippets = extractSnippets(match.text, match.indices);
      for (const { snippet, highlightStart, highlightEnd } of textSnippets) {
        const highlighted = highlightSnippet(snippet, highlightStart, highlightEnd);
        const matchedText = snippet.slice(highlightStart, highlightEnd + 1);
        const url = matchedText ? `${slug}#:~:text=${encodeTextFragment(matchedText)}` : slug;
        snippets.push({ text: highlighted, isTitle: false, url });
      }
    }
  }

  return snippets;
}

export { escapeHtml };
