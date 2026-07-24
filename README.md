# mermaid-compact

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/mermaid-compact?color=yellow)](https://npmjs.com/package/mermaid-compact)
[![npm downloads](https://img.shields.io/npm/dm/mermaid-compact?color=yellow)](https://npm.chart.dev/mermaid-compact)

<!-- /automd -->

[mermaid](https://mermaid.js.org), prebundled into a **single self-contained ESM file** — same API, zero runtime dependencies.

Upstream `mermaid` ships a small core plus ~200 lazily-loaded chunks (diagram types and their transitive deps). A trivial Vite app that just does `import mermaid` emits **95 JS chunks**; `mermaid-compact` emits **1**. It inlines the whole thing at build time and exposes the same API — `initialize`, `render`, `parse`, `run`, …

The trade-off is up-front size: instead of streaming each diagram on demand, you download **one ~2.7 MB min / ~700 kB gzip file** with no lazy chunks and no runtime deps. To keep that small it drops **architecture diagrams** (cytoscape, ~640 kB) and **KaTeX math labels** (~240 kB) — rendering either throws a clear error, and every other diagram type works as usual.

## Usage

```sh
npx nypm install mermaid-compact
```

```ts
import mermaid from "mermaid-compact";

mermaid.initialize({ startOnLoad: false, theme: "base" });
const { svg } = await mermaid.render("id", "flowchart TD\n  A --> B");
```

> [!NOTE]
> mermaid renders in the browser (it needs a DOM). Load it client-side only.

## Rebuilding with a different diagram scope

Excluded diagrams are defined in [`build.config.ts`](./build.config.ts): edit `EXCLUDED_PACKAGES` / `EXCLUDED_DIAGRAM_DEFS` and run `pnpm build`. To see what dominates the bundle, use the [rolldown bundle analyzer](https://rolldown.rs/builtin-plugins/bundle-analyzer).

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

Published under the [MIT](https://github.com/unjs/mermaid-compact/blob/main/LICENSE) license 💛.
