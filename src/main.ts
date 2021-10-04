import REGL from "regl";
import { new2d } from "./new-2d/new-2d";
import { old2d } from "./old-2d/old-2d";

function visible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.bottom >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
}

const canvas = document.createElement("canvas");
const regl = REGL({ canvas, extensions: ["ANGLE_instanced_arrays"] });

const renderNew = new2d(regl);

(window as any).newStrip = function (
  canvasid: string,
  color: boolean,
  join: "miter" | "bevel" | "round" | "none",
  cap: "round" | "square" | "none",
  terminal: boolean,
  alpha: number
) {
  function loop() {
    requestAnimationFrame(loop);
    const targetcanvas = document.getElementById(canvasid)! as HTMLCanvasElement;
    if (!visible(targetcanvas)) return;
    if (targetcanvas.width !== targetcanvas.clientWidth || targetcanvas.height !== targetcanvas.clientHeight) {
      targetcanvas.width = targetcanvas.clientWidth;
      targetcanvas.height = targetcanvas.clientHeight;
    }
    if (canvas.width !== targetcanvas.clientWidth || canvas.height !== targetcanvas.clientHeight) {
      canvas.width = targetcanvas.clientWidth;
      canvas.height = targetcanvas.clientHeight;
    }
    renderNew(targetcanvas, color, join, cap, terminal, alpha);
    const ctx = targetcanvas.getContext("2d");
    ctx?.clearRect(0, 0, targetcanvas.width, targetcanvas.height);
    ctx?.drawImage(canvas, 0, 0);
  }
  requestAnimationFrame(loop);
};

const renderOld = old2d(regl);

(window as any).oldStrip = function (canvasid: string, segments: boolean, alpha: number) {
  function loop() {
    requestAnimationFrame(loop);
    const targetcanvas = document.getElementById(canvasid)! as HTMLCanvasElement;
    if (!visible(targetcanvas)) return;
    if (targetcanvas.width !== targetcanvas.clientWidth || targetcanvas.height !== targetcanvas.clientHeight) {
      targetcanvas.width = targetcanvas.clientWidth;
      targetcanvas.height = targetcanvas.clientHeight;
    }
    if (canvas.width !== targetcanvas.clientWidth || canvas.height !== targetcanvas.clientHeight) {
      canvas.width = targetcanvas.clientWidth;
      canvas.height = targetcanvas.clientHeight;
    }
    renderOld(targetcanvas, segments, alpha);
    const ctx = targetcanvas.getContext("2d");
    ctx?.clearRect(0, 0, targetcanvas.width, targetcanvas.height);
    ctx?.drawImage(canvas, 0, 0);
  }
  requestAnimationFrame(loop);
};
