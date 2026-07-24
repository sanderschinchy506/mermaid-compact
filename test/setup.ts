// jsdom implements enough of the DOM for mermaid, but not the SVG layout
// methods it calls while measuring text. Stub them with fixed geometry so
// rendering completes deterministically.
const svgProto = globalThis.SVGElement?.prototype as
  | (SVGElement & { getBBox?: unknown; getComputedTextLength?: unknown })
  | undefined;

if (svgProto) {
  svgProto.getBBox = () => ({
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    top: 0,
    left: 0,
    right: 100,
    bottom: 20,
    toJSON: () => ({}),
  });
  svgProto.getComputedTextLength = () => 50;
}
