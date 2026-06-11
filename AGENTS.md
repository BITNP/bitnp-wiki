# AGENTS.md

## 设计准则

- 所有 px 尺寸必须是 4 的倍数，最好是 2^n。
- 不加特效、动画。
- 优先阅读体验，其次视觉效果。
- 必须优化宽度 < 400px 的设备。
- 不要忘记打印样式。

## Project

Custom Astro wiki for 网协. Not a standard Starlight site — uses fully custom layout, routing, and content pipeline. The `README.md` is leftover from the starter template; trust this file and the code instead.

## Package Manager

**pnpm** only.

## Dev Commands

| Command | Action |
| --- | --- |
| `pnpm install` | Install deps (needs `sass-embedded` for SCSS) |
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | Build to `dist/` + copy content assets |
| `pnpm preview` | Preview production build |

No `test`, `lint`, or `typecheck` scripts exist.

## Content Structure

- All pages live under `content/`, **not** `src/content/docs/`.
- Every page must be `index.mdx` inside its own directory.
  - Good: `content/clinic/readme/index.mdx`
  - Bad: `content/clinic/readme.md`
- Loader globs `**/index.mdx` from `./content` (`src/content.config.ts`).
- Assets go next to the page in `assets/` (e.g. `content/clinic/readme/assets/`).
- **Do not** put content assets in `public/` or `src/assets/`.
- Frontmatter: `title` (required), `path`, `description`, `contentType`, `mermaid: true` (optional).

## Asset Pipeline

- **Dev**: Custom Vite plugin (`astro.config.mjs`) serves `/assets/*` from `content/*/assets/`.
- **Production**: `pnpm build` runs `astro build` then `scripts/copy-content-assets.js` to copy all `content/*/assets/` trees into `dist/`.

## Styles

- Source is SCSS in `src/styles/`, imported by `src/layouts/Layout.astro`.
- Partial files: `_variables.scss`, `_base.scss`, `_layout.scss`, `_article.scss`, `_responsive.scss`, `_print.scss`.
- `sass-embedded` is a required devDependency.

## Scripts

- `src/scripts/mermaid.ts` handles client-side Mermaid rendering.
- Conditionally loaded in `Layout.astro` when frontmatter has `mermaid: true`.

## Routing

- `src/pages/[...slug].astro` generates static paths from the `docs` collection.
- Root page is `content/index/index.mdx` (slug empty → `/`).
- `Layout.astro` builds sidebar nav dynamically and sorts with `zh-CN` locale.

## TypeScript

- Extends `astro/tsconfigs/strict`.
- `.astro/types.d.ts` is auto-generated; do not edit manually.

## pnpm Patches

`patches/@astrojs__starlight@0.39.3.patch` exists but Starlight is not in `dependencies`. It may be residual; do not remove unless you verify it is unused.
