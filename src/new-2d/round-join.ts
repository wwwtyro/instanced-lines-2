import { Regl } from "regl";

function roundGeometry(resolution: number) {
  const ids: number[] = [];
  const cells: number[][] = [];

  for (let i = 0; i < resolution + 2; i++) {
    ids.push(i);
  }

  for (let i = 0; i < resolution; i++) {
    cells.push([0, i + 1, i + 2]);
  }

  return {
    ids,
    cells,
  };
}

export function roundJoinCommand(regl: Regl, resolution: number) {
  const geometry = roundGeometry(resolution);
  return regl({
    vert: `
    precision highp float;
    attribute vec2 pointA, pointB, pointC;
    attribute float id;
    uniform float width;
    uniform mat4 projection;

    const float resolution = ${resolution.toExponential()};

    void main() {
      // Calculate the x- and y- basis vectors.
      vec2 xBasis = normalize(normalize(pointC - pointB) + normalize(pointB - pointA));
      vec2 yBasis = vec2(-xBasis.y, xBasis.x);

      // Calculate the normal vectors for each neighboring segment.
      vec2 ab = pointB - pointA;
      vec2 cb = pointB - pointC;
      vec2 abn = normalize(vec2(-ab.y, ab.x));
      vec2 cbn = -normalize(vec2(-cb.y, cb.x));

      // Determine the direction of the bend.
      float sigma = sign(dot(ab + cb, yBasis));

      // If this is the zeroth id, it's the center of our circle. Stretch it to meet the segments' intersection.
      if (id == 0.0) {
        gl_Position = projection * vec4(pointB + -0.5 * yBasis * sigma * width / dot(yBasis, abn), 0, 1);
        return;
      }

      // Otherwise find the angle for this vertex.
      float theta = acos(dot(abn, cbn));
      theta = (sigma * 0.5 * ${Math.PI}) + -0.5 * theta + theta * (id - 1.0) / resolution;

      // Find the vertex position from the angle and multiply it by our basis vectors.
      vec2 pos = 0.5 * width * vec2(cos(theta), sin(theta));
      pos = pointB + xBasis * pos.x + yBasis * pos.y;

      gl_Position = projection * vec4(pos, 0, 1);
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
      id: {
        buffer: regl.buffer(geometry.ids),
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
