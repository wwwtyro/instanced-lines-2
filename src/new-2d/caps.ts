import { Regl } from "regl";

interface Geometry {
  positions: number[][];
  cells: number[][];
}

export function roundCapGeometry(resolution: number) {
  const positions = [[0, 0]];
  for (let i = 0; i <= resolution; i++) {
    const theta = -0.5 * Math.PI + (Math.PI * i) / resolution;
    positions.push([0.5 * Math.cos(theta), 0.5 * Math.sin(theta)]);
  }
  const cells: number[][] = [];
  for (let i = 0; i < resolution; i++) {
    cells.push([0, i + 1, i + 2]);
  }
  return { positions, cells };
}

export function squareCapGeometry() {
  return {
    positions: [
      [0, 0.5],
      [0, -0.5],
      [0.5, -0.5],
      [0.5, 0.5],
    ],
    cells: [
      [0, 1, 2],
      [0, 2, 3],
    ],
  };
}

export function capCommand(regl: Regl, geometry: Geometry) {
  return regl({
    vert: `
        precision highp float;
        attribute vec2 position;
        attribute vec2 pA, pB;
        uniform float width;
        uniform mat4 projection;
  
        void main() {
          vec2 xBasis = normalize(pA - pB);
          vec2 yBasis = vec2(-xBasis.y, xBasis.x);
          vec2 point = pA + xBasis * width * position.x + yBasis * width * position.y;
          gl_Position = projection * vec4(point, 0, 1);
        }`,

    frag: `
        precision highp float;
        uniform vec4 color;
        void main() {
          gl_FragColor = color;
        }`,

    attributes: {
      position: {
        buffer: regl.buffer(geometry.positions),
        divisor: 0,
      },
      pA: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 0,
        stride: Float32Array.BYTES_PER_ELEMENT * 4,
      },
      pB: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 2,
        stride: Float32Array.BYTES_PER_ELEMENT * 4,
      },
    },

    uniforms: {
      width: regl.prop<any, any>("width"),
      color: regl.prop<any, any>("color"),
      projection: regl.prop<any, any>("projection"),
    },

    blend: {
      enable: true,
      func: {
        src: "src alpha",
        dst: "one minus src alpha",
      },
    },

    cull: {
      enable: true,
      face: "back",
    },

    depth: {
      enable: false,
    },

    elements: regl.elements(geometry.cells),
    instances: regl.prop<any, any>("instances"),
    viewport: regl.prop<any, any>("viewport"),
  });
}
