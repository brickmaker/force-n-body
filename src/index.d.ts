export declare function forceNBody(
  nodes: { x: number; y: number }[],
  weightFunc?: (node?: { x: number; y: number }) => number
): { vx: number; vy: number }[];

export declare function forceNBodyBruteForce(
  nodes: { x: number; y: number }[],
  weightFunc?: (node?: { x: number; y: number }) => number
): { vx: number; vy: number }[];

export declare function forceNBody2BruteForce(
  nodes: { x: number; y: number }[],
  weightFunc?: (node?: { x: number; y: number }) => number
): { vx: number; vy: number }[];
