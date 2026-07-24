// Re-export mermaid's public API. The whole library (and its dependency graph)
// is inlined into a single self-contained bundle at build time — see
// `build.config.ts`. Consumers get `initialize`, `render`, `parse`, … without
// pulling mermaid or any of its ~20 transitive dependencies into their own
// module graph.
export * from "mermaid";
export { default } from "mermaid";
