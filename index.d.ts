declare function forceNBody(
  nodes: { x: number; y: number }[],
  weightFunc?: (node?: { x: number; y: number }) => number
): { vx: number; vy: number }[];

declare function forceNBodyBruteForce(
  nodes: { x: number; y: number }[],
  weightFunc?: (node?: { x: number; y: number }) => number
): { vx: number; vy: number }[];

export = {
  forceNBody,
  forceNBodyBruteForce,
};
