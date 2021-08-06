const width = 800;
const height = 800;
const padding = 50;
const vectorSizeScale = 5;

const div = d3.select("body");
const svg = div.append("svg").attr("width", width).attr("height", height);
const title = div.append("h1").text("Force-N-Body Demo");
const inputDiv = div.append("div");
const timeShowDiv = div.append("div");
const tips = div.append("div").append("p");
tips.append("span").text("Tips: ");
tips.append("span").text("Red arrow ").style("color", "red");
tips.append("span").text("indicate forceNBody's result; ");
tips.append("span").text("Blue arrow ").style("color", "blue");
tips.append("span").text("indicate forceNBodyBruteForce's result.");

inputDiv.append("span").text("Node Num: ");
inputDiv
  .append("input")
  .attr("placeholder", "100")
  .on("keypress", function (e) {
    if (e.keyCode == 13) {
      main(parseInt(e.target.value));
    }
  });

main(100);

function main(nodeNum) {
  svg.selectAll("*").remove();
  timeShowDiv.selectAll("*").remove();

  const nodes = generateRandomData(nodeNum, width, height, padding);
  drawNodes(nodes);

  // const forces = mockForce(nodes);
  const t0 = performance.now();
  const forces = forceNBody.forceNBody(nodes);
  const t1 = performance.now();
  showTime(`forceNBody`, nodeNum, t1 - t0);
  drawArrow(nodes, forces, "#ff0000", "force");

  const t2 = performance.now();
  const forcesBruteForce = forceNBody.forceNBodyBruteForce(nodes);
  const t3 = performance.now();
  showTime(`forceNBodyBruteForce`, nodeNum, t3 - t2);
  drawArrow(nodes, forcesBruteForce, "#0000ff", "bruteForce");
}

function showTime(action, nodeNum, time) {
  timeShowDiv
    .append("p")
    .text(`${action} spends ${parseInt(time)}ms computing ${nodeNum} nodes.`);
}

function drawNodes(nodes) {
  const node = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("fill", "#67a9ef")
    .attr("r", 5);
}

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
