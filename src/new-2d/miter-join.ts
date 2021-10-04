import { Regl } from "regl";

const geometry = {
  positions: [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
  cells: [
    [0, 1, 2],
    [0, 2, 3],
  ],
};

export function miterJoinCommand(regl: Regl) {
  return regl({
    vert: `
      precision highp float;
      attribute vec2 pointA, pointB, pointC;
      attribute vec4 position;
      uniform float width;
      uniform mat4 projection;
  
      void main() {
        // Find the miter vector.
        vec2 tangent = normalize(normalize(pointC - pointB) + normalize(pointB - pointA));
        vec2 miter = vec2(-tangent.y, tangent.x);

        // Find the perpendicular vectors.
        vec2 ab = pointB - pointA;
        vec2 cb = pointB - pointC;
        vec2 abNorm = normalize(vec2(-ab.y, ab.x));
        vec2 cbNorm = -normalize(vec2(-cb.y, cb.x));

        // Determine the bend direction.
        float sigma = sign(dot(ab + cb, miter));

        // Calculate the basis vectors for the miter geometry.
        vec2 p0 = 0.5 * width * sigma * (sigma < 0.0 ? abNorm : cbNorm);
        vec2 p1 = 0.5 * miter * sigma * width / dot(miter, abNorm);
        vec2 p2 = 0.5 * width * sigma * (sigma < 0.0 ? cbNorm : abNorm);
        vec2 p3 = -0.5 * miter * sigma * width / dot(miter, abNorm);

        // Calculate the final point position.
        vec2 point = pointB + position.x * p0 + position.y * p1 + position.z * p2 + position.w * p3;
        gl_Position = projection * vec4(point, 0, 1);
      }`,

    frag: `
      precision highp float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,

    depth: {
      enable: false,
    },

    attributes: {
      position: {
        buffer: regl.buffer(geometry.positions),
        divisor: 0,
      },
      pointA: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 0,
      },
      pointB: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 2,
      },
      pointC: {
        buffer: regl.prop<any, any>("points"),
        divisor: 1,
        offset: Float32Array.BYTES_PER_ELEMENT * 4,
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

    elements: regl.elements(geometry.cells),
    instances: regl.prop<any, any>("instances"),
    viewport: regl.prop<any, any>("viewport"),
  });
}
