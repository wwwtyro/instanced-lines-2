import { Regl } from "regl";

const geometry = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

export function bevelJoinCommand(regl: Regl) {
  return regl({
    vert: `
    precision highp float;
    attribute vec2 pointA, pointB, pointC;
    attribute vec3 position;
    uniform float width;
    uniform mat4 projection;

    void main() {
      vec2 tangent = normalize(normalize(pointC - pointB) + normalize(pointB - pointA));
      vec2 normal = vec2(-tangent.y, tangent.x);
      vec2 ab = pointB - pointA;
      vec2 cb = pointB - pointC;
      float sigma = sign(dot(ab + cb, normal));
      vec2 abn = normalize(vec2(-ab.y, ab.x));
      vec2 cbn = -normalize(vec2(-cb.y, cb.x));
      vec2 p0 = 0.5 * sigma * width * (sigma < 0.0 ? abn : cbn);
      vec2 p1 = 0.5 * sigma * width * (sigma < 0.0 ? cbn : abn);
      vec2 p2 = -0.5 * normal * sigma * width / dot(normal, abn);
      vec2 point = pointB + position.x * p0 + position.y * p1 + position.z * p2;
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
        buffer: regl.buffer(geometry),
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

    count: geometry.length,
    instances: regl.prop<any, any>("instances"),
    viewport: regl.prop<any, any>("viewport"),
  });
}
