import { defineBuildConfig } from "obuild/config";
import type { Plugin } from "rolldown";

/**
 * Heavy dependencies stubbed out of the prebundle to keep it compact:
 *
 * - The cytoscape family (`cytoscape` + `cytoscape-cose-bilkent` +
 *   `cytoscape-fcose`, ~640KB) — used only by architecture diagrams.
 * - `katex` (~240KB) — used only for `$$…$$` math labels.
 *
 * Everything else mermaid can render still works. To ship a different scope,
 * edit these lists and rebuild.
 */
const EXCLUDED_PACKAGES = new Set([
  "cytoscape",
  "cytoscape-cose-bilkent",
  "cytoscape-fcose",
  "katex",
]);

// Substring match against resolved module ids of lazy-loaded diagram
// definitions (e.g. `.../chunks/mermaid.core/architectureDiagram-XXXX.mjs`).
const EXCLUDED_DIAGRAM_DEFS = ["architectureDiagram"];

const STUB_PREFIX = "\0mermaid-compact-stub:";

const excludeDiagrams: Plugin = {
  name: "mermaid-compact:exclude-diagrams",
  resolveId(id) {
    if (EXCLUDED_PACKAGES.has(id)) {
      return { id: STUB_PREFIX + id, moduleSideEffects: false };
    }
  },
  load(id) {
    if (id.startsWith(STUB_PREFIX)) {
      const name = id.slice(STUB_PREFIX.length);
      // A callable Proxy whose every property is also the throwing function, so
      // both function-shaped (`cytoscape()`, `cytoscape.use()`) and object-shaped
      // (`katex.renderToString()`) usage fails loudly. Only reached if an excluded
      // feature is actually used, and callers already wrap `render()` in try/catch.
      return [
        `const e = () => { throw new Error("[mermaid-compact] '${name}' is excluded from this build"); };`,
        `const stub = new Proxy(e, { get: () => e });`,
        `export default stub;`,
        `export const use = e;`,
      ].join("\n");
    }
    if (EXCLUDED_DIAGRAM_DEFS.some((n) => id.includes(n))) {
      return "export default {};";
    }
  },
};

export default defineBuildConfig({
  entries: [
    {
      type: "bundle",
      input: ["./src/index.ts"],
      minify: true,
      rolldown: {
        platform: "browser",
        plugins: [excludeDiagrams],
      },
    },
  ],
  hooks: {
    // Collapse the ~200 lazy diagram chunks into one self-contained file so
    // consumers never see the dependency-graph waterfall.
    rolldownOutput(cfg) {
      cfg.codeSplitting = false;
    },
  },
});
