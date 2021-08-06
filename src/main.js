import { quadtree } from "d3-quadtree";

const defaultWeightFunc = () => 30;
const theta2 = 0.81;
const distanceMin2 = 1;
const epsilon = 1e-6;

function accumulate(quad) {
  let accWeight = 0;
  let accX = 0;
  let accY = 0;

  if (quad.length) {
    // internal node, accumulate 4 child quads
    for (let i = 0; i < 4; i++) {
      const q = quad[i];
      if (q && q.weight) {
        accWeight += q.weight;
        accX += q.x * q.weight;
        accY += q.y * q.weight;
      }
    }
    quad.x = accX / accWeight;
    quad.y = accY / accWeight;
    quad.weight = accWeight;
  } else {
    // leaf node
    let q = quad;
    quad.x = q.data.x;
    quad.y = q.data.y;
    quad.weight = q.data.weight;
  }
}

function computeForce(node, tree) {
  const apply = (quad, x1, y1, x2, y2) => {
    let dx = node.x - quad.x;
    let dy = node.y - quad.y;
    const width = x2 - x1;
    let len2 = Math.max(distanceMin2, dx * dx + dy * dy);

    // far node, apply Barnes-Hut approximation
    if ((width * width) / theta2 < len2) {
      // if (false) {
      // random jiggle
      if (dx === 0) dx = (Math.random() - 0.5) * epsilon;
      if (dy === 0) dy = (Math.random() - 0.5) * epsilon;

      node.vx += (dx * quad.weight) / len2;
      node.vy += (dy * quad.weight) / len2;

      return true;
    } else {
      // near quad, compute force directly
      if (quad.length) return false; // internal node, visit children

      // leaf node

      if (quad.data !== node) {
        // random jiggle
        if (dx === 0) dx = (Math.random() - 0.5) * epsilon;
        if (dy === 0) dy = (Math.random() - 0.5) * epsilon;

        node.vx += (dx * quad.data.weight) / len2;
        node.vy += (dy * quad.data.weight) / len2;
      }
    }
  };

  tree.visit(apply);
}

export function forceNBody(nodes, weightFunc = defaultWeightFunc) {
  const data = nodes.map((n, i) => ({
    index: i,
    ...n,
    vx: 0,
    vy: 0,
    weight: weightFunc(n),
  }));

  const tree = quadtree(
    data,
    (d) => d.x,
    (d) => d.y
  ).visitAfter(accumulate); // init internal node

  data.forEach((n) => {
    computeForce(n, tree);
  });

  return data.map((n) => ({
    vx: n.vx,
    vy: n.vy,
  }));
}

export function forceNBodyBruteForce(nodes, weightFunc = defaultWeightFunc) {
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

export function forceNBody2BruteForce(nodes, weightFunc = defaultWeightFunc) {
  const weights = Array(nodes.length)
    .fill()
    .map((_, i) => weightFunc(nodes[i], i));

  return nodes.map((a, i) => {
    const v = { vx: 0, vy: 0 };

    nodes.forEach((b, j) => {
      if (i === j) return;
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let len = Math.sqrt(Math.max(distanceMin2, dx * dx + dy * dy));

      // random jiggle
      if (dx === 0) dx = (Math.random() - 0.5) * epsilon;
      if (dy === 0) dy = (Math.random() - 0.5) * epsilon;

      const force = weights[j] / (len * len * len);

      v.vx += dx * force;
      v.vy += dy * force;
    });

    return v;
  });
}
