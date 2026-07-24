import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const distPath = resolve(process.cwd(), "dist/index.mjs");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mermaid: any;

beforeAll(async () => {
  if (!existsSync(distPath)) {
    execSync("pnpm build", { stdio: "inherit" });
  }
  mermaid = (await import(pathToFileURL(distPath).href)).default;
  mermaid.initialize({ startOnLoad: false, theme: "base" });
}, 120_000);

describe("mermaid-compact", () => {
  const diagrams = {
    flowchart: "flowchart TD\n  A[Start] --> B{Go?}\n  B -->|yes| C[Done]",
    sequence: "sequenceDiagram\n  Alice->>Bob: Hi\n  Bob-->>Alice: Hey",
    class: "classDiagram\n  Animal <|-- Dog",
    state: "stateDiagram-v2\n  [*] --> S1\n  S1 --> [*]",
    er: "erDiagram\n  CUSTOMER ||--o{ ORDER : places",
    pie: 'pie\n  "A": 40\n  "B": 60',
    gitgraph: "gitGraph\n  commit\n  branch dev\n  commit",
  };

  it.each(Object.entries(diagrams))("renders a %s diagram", async (name, code) => {
    const { svg } = await mermaid.render(`test-${name}`, code);
    expect(svg).toContain("<svg");
    expect(svg.length).toBeGreaterThan(100);
  });

  it("exposes the core API", () => {
    for (const fn of ["initialize", "render", "parse", "run"]) {
      expect(typeof mermaid[fn]).toBe("function");
    }
  });

  it("excludes architecture diagrams from this build", async () => {
    await expect(
      mermaid.render(
        "test-architecture",
        "architecture-beta\n  group api\n  service db(database)[DB] in api",
      ),
    ).rejects.toThrow();
  });
});
