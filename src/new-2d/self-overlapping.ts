import { mat4 } from "gl-matrix";
import REGL, { DrawCommand } from "regl";

import { interleavedStripCommand, interleavedStripTerminalCommand } from "./interleaved-strip";
import { miterJoinCommand } from "./miter-join";
import { bevelJoinCommand } from "./bevel-join";
import { roundJoinCommand } from "./round-join";
import { capCommand, roundCapGeometry, squareCapGeometry } from "./caps";

export function selfOverlapping() {
  const regl = REGL({ extensions: ["ANGLE_instanced_arrays"] });
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.classList.add("grid");

  const projection = mat4.ortho(mat4.create(), -canvas.width / 2, canvas.width / 2, -canvas.height / 2, canvas.height / 2, 0, -1);
  const viewport = { x: 0, y: 0, width: canvas.width, height: canvas.height };

  function generateSamplePointsInterleaved(width: number, height: number) {
    const points = [];
    for (let i = 0; i < 1000; i++) {
      const theta = i * 0.1;
      const offset = -width / 3 + (i * width) / 1.5 / 1000;
      points.push([offset + height * 0.25 * Math.cos(theta), height * 0.25 * Math.sin(theta)]);
    }
    return points;
  }

  const points = generateSamplePointsInterleaved(canvas.width, canvas.height);

  const hash = window.location.hash;
  const colorCoded = hash.includes("color-coded");
  const alpha = hash.includes("alpha") ? 0.75 : 1.0;

  let join: DrawCommand;
  if (hash.includes("bevel-join")) {
    join = bevelJoinCommand(regl);
  } else if (hash.includes("miter-join")) {
    join = miterJoinCommand(regl);
  } else if (hash.includes("round-join")) {
    join = roundJoinCommand(regl, 16);
  }

  let cap: DrawCommand;
  if (hash.includes("round-cap")) {
    const roundCap = roundCapGeometry(16);
    cap = capCommand(regl, roundCap);
  } else if (hash.includes("square-cap")) {
    const squareCap = squareCapGeometry();
    cap = capCommand(regl, squareCap);
  }

  const interleavedStrip = interleavedStripCommand(regl);
  const interleavedStripTerminal = interleavedStripTerminalCommand(regl);

  function loop() {
    regl.clear({ color: [0, 0, 0, 0] });
    const width = 32 * (0.5 * Math.sin(performance.now() * 0.002) + 0.5) + 4;
    interleavedStrip({
      points: points,
      segments: points.length - 3,
      width,
      color: colorCoded ? [1, 0, 0, alpha] : [0.25, 0.25, 0.25, alpha],
      projection,
      viewport,
    });
    if (hash.includes("terminal")) {
      interleavedStripTerminal({
        points: [points[0], points[1], points[2], points[points.length - 1], points[points.length - 2], points[points.length - 3]],
        segments: 2,
        width,
        color: colorCoded ? [0, 0.5, 0, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
    if (join !== undefined) {
      join({
        points: points,
        instances: points.length - 2,
        width,
        color: colorCoded ? [0, 0, 1, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
    if (cap !== undefined) {
      cap({
        points: [points[0], points[1], points[points.length - 1], points[points.length - 2]],
        instances: 2,
        width,
        color: colorCoded ? [1, 0, 1, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
    requestAnimationFrame(loop);
  }

  loop();
}
