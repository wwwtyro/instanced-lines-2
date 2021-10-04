import { Regl } from "regl";

const geometry = {
  positions: [
    [0, -0.5],
    [1, -0.5],
    [1, 0.5],
    [0, 0.5],
  ],
  cells: [
    [0, 1, 2],
    [0, 2, 3],
  ],
};

export function interleavedStripCommand(regl: Regl) {
  return regl({
    vert: `
        precision highp float;
        attribute vec2 position;
        attribute vec2 pA, pB, pC, pD;
        uniform float width;
        uniform mat4 projection;
  
        void main() {
          // Select the three points we'll use and adjust the vertex according to 
          // the side of the segment the vertex is on and the order of the points.
          vec2 p0 = pA;
          vec2 p1 = pB;
          vec2 p2 = pC;
          vec2 pos = position;
          if (position.x == 1.0) {
            p0 = pD;
            p1 = pC;
            p2 = pB;
            pos = vec2(1.0 - position.x, -position.y);
          }
  
          // Find the normal vector.
          vec2 tangent = normalize(normalize(p2 - p1) + normalize(p1 - p0));
          vec2 normal = vec2(-tangent.y, tangent.x);
  
          // Find the perpendicular vectors.
          vec2 p01 = p1 - p0;
          vec2 p21 = p1 - p2;
          vec2 p01Norm = normalize(vec2(-p01.y, p01.x));
  
          // Determine the bend direction.
          float sigma = sign(dot(p01 + p21, normal));
          
          // If this is the intersecting vertex, 
          if (sign(pos.y) == -sigma) {
            vec2 point = 0.5 * normal * -sigma * width / dot(normal, p01Norm);
            gl_Position = projection * vec4(p1 + point, 0, 1);
          } else {
            vec2 xBasis = p2 - p1;
            vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
            vec2 point = p1 + xBasis * pos.x + yBasis * width * pos.y;
            gl_Position = projection * vec4(point, 0, 1);
          }
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
      },
      pB: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 2,
      },
      pC: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 4,
      },
      pD: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 6,
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
    instances: regl.prop<any, any>("segments"),
    viewport: regl.prop<any, any>("viewport"),
  });
}

export function interleavedStripTerminalCommand(regl: Regl) {
  return regl({
    vert: `
        precision highp float;
        attribute vec2 position;
        attribute vec2 pA, pB, pC;
        uniform float width;
        uniform mat4 projection;
  
        void main() {
  
          if (position.x == 0.0) {
            vec2 xBasis = pB - pA;
            vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
            vec2 point = pA + xBasis * position.x + yBasis * width * position.y;
            gl_Position = projection * vec4(point, 0, 1);
            return;
          }

          // Find the normal vector.
          vec2 tangent = normalize(normalize(pC - pB) + normalize(pB - pA));
          vec2 normal = vec2(-tangent.y, tangent.x);
  
          // Find the perpendicular vectors.
          vec2 ab = pB - pA;
          vec2 cb = pB - pC;
          vec2 abNorm = normalize(vec2(-ab.y, ab.x));
  
          // Determine the bend direction.
          float sigma = sign(dot(ab + cb, normal));
          
          if (sign(position.y) == -sigma) {
            vec2 position = 0.5 * normal * -sigma * width / dot(normal, abNorm);
            gl_Position = projection * vec4(pB + position, 0, 1);
          } else {
            vec2 xBasis = pB - pA;
            vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
            vec2 point = pA + xBasis * position.x + yBasis * width * position.y;
            gl_Position = projection * vec4(point, 0, 1);
          }
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
        stride: Float32Array.BYTES_PER_ELEMENT * 6,
      },
      pB: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 2,
        stride: Float32Array.BYTES_PER_ELEMENT * 6,
      },
      pC: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 4,
        stride: Float32Array.BYTES_PER_ELEMENT * 6,
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
    instances: regl.prop<any, any>("segments"),
    viewport: regl.prop<any, any>("viewport"),
  });
}
