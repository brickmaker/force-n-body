export function forceNBody(
  nodes: { x: number; y: number }[],
  weightFunc?: (node?: { x: number; y: number }) => number
): { vx: number; vy: number }[];

export function forceNBodyBruteForce(
  nodes: { x: number; y: number }[],
  weightFunc?: (node?: { x: number; y: number }) => number
): { vx: number; vy: number }[];
