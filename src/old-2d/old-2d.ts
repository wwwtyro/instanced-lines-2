import { mat4 } from "gl-matrix";
import REGL from "regl";
import { interleavedStripCommand } from "./interleaved-strip";
import { interleavedStripRoundCapJoin } from "./round-cap-join";

export function old2d() {
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

  const command = hash.includes("segments") ? interleavedStripCommand(regl) : interleavedStripRoundCapJoin(regl, 16);

  const useAlpha = window.location.hash.includes("alpha");

  function loop() {
    const scaleX = 0.45 * Math.sin(performance.now() * 0.002) + 0.75;
    const scaleY = Math.sin(performance.now() * 0.0003);
    const scaledData = [];
    for (const point of points) {
      scaledData.push([point[0] * scaleX, point[1] * scaleY]);
    }
    regl.clear({ color: [0, 0, 0, 0] });
    command({
      points: scaledData,
      segments: points.length - 1,
      width: 32,
      color: [0.25, 0.25, 0.25, useAlpha ? 0.75 : 1.0],
      projection,
      viewport,
    });
    requestAnimationFrame(loop);
  }

  loop();
}
