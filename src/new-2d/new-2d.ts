import { mat4 } from "gl-matrix";
import REGL, { DrawCommand } from "regl";

import { interleavedStripCommand, interleavedStripTerminalCommand } from "./interleaved-strip";
import { miterJoinCommand } from "./miter-join";
import { bevelJoinCommand } from "./bevel-join";
import { roundJoinCommand } from "./round-join";
import { capCommand, roundCapGeometry, squareCapGeometry } from "./caps";

export function new2d() {
  const regl = REGL({ extensions: ["ANGLE_instanced_arrays"] });
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.classList.add("grid");

  const projection = mat4.ortho(mat4.create(), -canvas.width / 2, canvas.width / 2, -canvas.height / 2, canvas.height / 2, 0, -1);
  const viewport = { x: 0, y: 0, width: canvas.width, height: canvas.height };

  function generateSamplePointsInterleaved(width: number, height: number) {
    const stepx = width / 9;
    const stepy = height / 10;
    const points = [];
    for (let x = 1; x < 9; x += 2) {
      points.push([(x + 0) * stepx - width / 2, 3 * stepy - height / 2]);
      points.push([(x + 1) * stepx - width / 2, 7 * stepy - height / 2]);
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
    const scaleX = 0.45 * Math.sin(performance.now() * 0.002) + 0.75;
    const scaleY = Math.sin(performance.now() * 0.0003);
    const scaledPoints = [];
    for (const point of points) {
      scaledPoints.push([point[0] * scaleX, point[1] * scaleY]);
    }
    regl.clear({ color: [0, 0, 0, 0] });
    interleavedStrip({
      points: scaledPoints,
      segments: points.length - 3,
      width: 32,
      color: colorCoded ? [1, 0, 0, alpha] : [0.25, 0.25, 0.25, alpha],
      projection,
      viewport,
    });
    if (hash.includes("terminal")) {
      interleavedStripTerminal({
        points: [
          scaledPoints[0],
          scaledPoints[1],
          scaledPoints[2],
          scaledPoints[points.length - 1],
          scaledPoints[points.length - 2],
          scaledPoints[points.length - 3],
        ],
        segments: 2,
        width: 32,
        color: colorCoded ? [0, 0.5, 0, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
    if (join !== undefined) {
      join({
        points: scaledPoints,
        instances: points.length - 2,
        width: 32,
        color: colorCoded ? [0, 0, 1, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
    if (cap !== undefined) {
      cap({
        points: [scaledPoints[0], scaledPoints[1], scaledPoints[points.length - 1], scaledPoints[points.length - 2]],
        instances: 2,
        width: 32,
        color: colorCoded ? [1, 0, 1, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
    requestAnimationFrame(loop);
  }

  loop();
}
