import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { pinyin } from 'pinyin-pro';

function stripMarkdown(md) {
  return md
    .replace(/```(?:\w*\n)?([\s\S]*?)```/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^\s*[-*+]\s+/gm, ' ')
    .replace(/^\s*\d+\.\s+/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const files = globSync('content/**/index.{md,mdx}');

const docs = files.map((file) => {
  const raw = readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  const text = stripMarkdown(content);
  const title = data.title || '';
  const description = data.description || '';
  const id = file.replace(/^content\//, '').replace(/\/index\.md$/, '');

  const fullText = `${title} ${description} ${text}`;
  const pinyinText = pinyin(fullText, { toneType: 'none', type: 'string' }).toLowerCase().replace(/\s+/g, '');

  return {
    id,
    title,
    slug: id === 'index' ? '/' : `/${id.replace(/\/$/, '')}/`,
    description,
    text: text.slice(0, 2000),
    pinyin: pinyinText,
  };
});

writeFileSync('public/search-index.json', JSON.stringify(docs, null, 2));
console.log(`Generated search index with ${docs.length} documents.`);
