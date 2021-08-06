const defaultWeightFunc = () => 30;

export function forceNBody(nodes, weightFunc) {}

export function forceNBodyBruteForce(nodes, weightFunc = defaultWeightFunc) {
  const distanceMin2 = 1;
  const epsilon = 1e-6;
  const weights = Array(nodes.length)
    .fill()
    .map((_, i) => weightFunc(nodes[i], i));

  return nodes.map((a, i) => {
    const v = { vx: 0, vy: 0 };

    nodes.forEach((b, j) => {
      if (i === j) return;
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let len2 = Math.max(distanceMin2, dx * dx + dy * dy);

      // random jiggle
      if (dx === 0) dx = (Math.random() - 0.5) * epsilon;
      if (dy === 0) dy = (Math.random() - 0.5) * epsilon;

      const force = weights[j] / len2;

      v.vx += dx * force;
      v.vy += dy * force;
    });

    return v;
  });
}
