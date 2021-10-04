import { mat4 } from "gl-matrix";
import { Regl } from "regl";

import { interleavedStripCommand, interleavedStripTerminalCommand } from "./interleaved-strip";
import { miterJoinCommand } from "./miter-join";
import { bevelJoinCommand } from "./bevel-join";
import { roundJoinCommand } from "./round-join";
import { capCommand, roundCapGeometry, squareCapGeometry } from "./caps";

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

export function new2d(regl: Regl) {
  const bevelJoin = bevelJoinCommand(regl);
  const miterJoin = miterJoinCommand(regl);
  const roundJoin = roundJoinCommand(regl, 16);

  const roundCap = capCommand(regl, roundCapGeometry(16));
  const squareCap = capCommand(regl, squareCapGeometry());

  const interleavedStrip = interleavedStripCommand(regl);
  const interleavedStripTerminal = interleavedStripTerminalCommand(regl);

  const pointsBuffer = regl.buffer(0);

  function render(
    canvas: HTMLCanvasElement,
    color: boolean,
    join: "miter" | "bevel" | "round" | "none",
    cap: "round" | "square" | "none",
    terminal: boolean,
    alpha: number
  ) {
    const points = generateSamplePointsInterleaved(canvas.width, canvas.height);
    const projection = mat4.ortho(mat4.create(), -canvas.width / 2, canvas.width / 2, -canvas.height / 2, canvas.height / 2, 0, -1);
    const viewport = { x: 0, y: 0, width: canvas.width, height: canvas.height };

    const scaleX = 0.45 * Math.sin(performance.now() * 0.002) + 0.75;
    const scaleY = Math.sin(performance.now() * 0.0003);
    const scaledPoints = [];
    for (const point of points) {
      scaledPoints.push([point[0] * scaleX, point[1] * scaleY]);
    }
    regl.clear({ color: [0, 0, 0, 0] });
    interleavedStrip({
      points: pointsBuffer(scaledPoints),
      segments: points.length - 3,
      width: canvas.width * 0.05,
      color: color ? [1, 0, 0, alpha] : [0.25, 0.25, 0.25, alpha],
      projection,
      viewport,
    });
    if (terminal) {
      interleavedStripTerminal({
        points: pointsBuffer([
          scaledPoints[0],
          scaledPoints[1],
          scaledPoints[2],
          scaledPoints[points.length - 1],
          scaledPoints[points.length - 2],
          scaledPoints[points.length - 3],
        ]),
        segments: 2,
        width: canvas.width * 0.05,
        color: color ? [0, 0.5, 0, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
    const joinCommand = {
      miter: miterJoin,
      bevel: bevelJoin,
      round: roundJoin,
      none: undefined,
    }[join];
    if (joinCommand) {
      joinCommand({
        points: pointsBuffer(scaledPoints),
        instances: points.length - 2,
        width: canvas.width * 0.05,
        color: color ? [0, 0, 1, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
    const capCommand = {
      round: roundCap,
      square: squareCap,
      none: undefined,
    }[cap];
    if (capCommand) {
      capCommand({
        points: pointsBuffer([scaledPoints[0], scaledPoints[1], scaledPoints[points.length - 1], scaledPoints[points.length - 2]]),
        instances: 2,
        width: canvas.width * 0.05,
        color: color ? [1, 0, 1, alpha] : [0.25, 0.25, 0.25, alpha],
        projection,
        viewport,
      });
    }
  }

  return render;
}
