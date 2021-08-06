const width = 800;
const height = 800;
const padding = 50;
const N = 100;
const vectorSizeScale = 5;

const div = d3.select("body");
const svg = div.append("svg").attr("width", width).attr("height", height);

const nodes = generateRandomData(N, width, height, padding);

// const forces = mockForce(nodes);
const forcesBruteForce = forceNBody.forceNBodyBruteForce(nodes);
const forces = forceNBody.forceNBody(nodes);
console.log(forcesBruteForce);
console.log(forces);

const node = svg
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("fill", "#67a9ef")
  .attr("r", 5);

drawArrow(nodes, forcesBruteForce, "#0000ff", "bruteForce");
drawArrow(nodes, forces, "#ff0000", "force");

function drawArrow(nodes, forces, color, className) {
  const combined = nodes.map((n, i) => ({
    x: n.x,
    y: n.y,
    vx: forces[i].vx,
    vy: forces[i].vy,
  }));

  // See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
  svg
    .append("defs")
    .append("marker")
    .attr("id", `arrow-${className}`)
    .attr("viewBox", [0, 0, 8, 4])
    .attr("refX", 4)
    .attr("refY", 2)
    .attr("markerWidth", 8)
    .attr("markerHeight", 4)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr(
      "d",
      d3.line()([
        [0, 0],
        [0, 4],
        [8, 2],
      ])
    )
    .attr("fill", color);

  const arrow = svg
    .selectAll(`.${className}`)
    .data(combined)
    .enter()
    .append("line")
    .attr("class", className)
    .attr("x1", (d) => d.x)
    .attr("y1", (d) => d.y)
    .attr("x2", (d) => d.x + vectorSizeScale * d.vx)
    .attr("y2", (d) => d.y + vectorSizeScale * d.vy)
    .attr("marker-end", `url(#arrow-${className})`)
    .attr("stroke-width", "2")
    .attr("stroke", color);
}

function generateRandomData(num, width, height, padding) {
  return Array(num)
    .fill()
    .map(() => ({
      x: Math.random() * (width - 2 * padding) + padding,
      y: Math.random() * (height - 2 * padding) + padding,
    }));
}

function mockForce(nodes) {
  return Array(nodes.length).fill({
    vx: 1,
    vy: 2,
  });
}
