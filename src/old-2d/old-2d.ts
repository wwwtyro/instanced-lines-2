import { mat4 } from "gl-matrix";
import { Regl } from "regl";
import { interleavedStripCommand } from "./interleaved-strip";
import { interleavedStripRoundCapJoin } from "./round-cap-join";

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

export function old2d(regl: Regl) {
  const interleavedStrip = interleavedStripCommand(regl);
  const roundRound = interleavedStripRoundCapJoin(regl, 16);

  const pointsBuffer = regl.buffer(0);

  function render(canvas: HTMLCanvasElement, segments: boolean, alpha: number) {
    const points = generateSamplePointsInterleaved(canvas.width, canvas.height);
    const projection = mat4.ortho(mat4.create(), -canvas.width / 2, canvas.width / 2, -canvas.height / 2, canvas.height / 2, 0, -1);
    const viewport = { x: 0, y: 0, width: canvas.width, height: canvas.height };
    const scaleX = 0.45 * Math.sin(performance.now() * 0.002) + 0.75;
    const scaleY = Math.sin(performance.now() * 0.0003);
    const scaledData = [];
    for (const point of points) {
      scaledData.push([point[0] * scaleX, point[1] * scaleY]);
    }
    regl.clear({ color: [0, 0, 0, 0] });
    const command = segments ? interleavedStrip : roundRound;
    command({
      points: pointsBuffer(scaledData),
      segments: points.length - 1,
      width: canvas.width * 0.05,
      color: [0.25, 0.25, 0.25, alpha],
      projection,
      viewport,
    });
  }
  return render;
}
