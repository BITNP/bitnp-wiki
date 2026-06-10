import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mimeTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

const contentAssetsPlugin = {
  name: 'content-assets',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url || !req.url.includes('/assets/')) {
        return next();
      }

      const urlPath = req.url.split('?')[0];
      const relativePath = urlPath.replace(/^\/+/, '');
      const filePath = path.join(__dirname, 'content', relativePath);
      const resolvedFilePath = path.resolve(filePath);
      const contentDir = path.resolve(__dirname, 'content');

      if (!resolvedFilePath.startsWith(contentDir)) {
        return next();
      }

      if (fs.existsSync(resolvedFilePath) && fs.statSync(resolvedFilePath).isFile()) {
        res.setHeader('Content-Type', getContentType(resolvedFilePath));
        fs.createReadStream(resolvedFilePath).pipe(res);
      } else {
        next();
      }
    });
  }
};

export default defineConfig({
  integrations: [mdx()],
  vite: {
    plugins: [contentAssetsPlugin],
  },
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid', 'math'],
    },
  },
});
