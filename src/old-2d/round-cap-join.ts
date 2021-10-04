import { Regl } from "regl";

function roundCapJoinGeometry(regl: Regl, resolution: number) {
  const instanceRoundRound = [
    [0, -0.5, 0],
    [0, -0.5, 1],
    [0, 0.5, 1],
    [0, -0.5, 0],
    [0, 0.5, 1],
    [0, 0.5, 0],
  ];
  // Add the left cap.
  for (let step = 0; step < resolution; step++) {
    const theta0 = Math.PI / 2 + ((step + 0) * Math.PI) / resolution;
    const theta1 = Math.PI / 2 + ((step + 1) * Math.PI) / resolution;
    instanceRoundRound.push([0, 0, 0]);
    instanceRoundRound.push([0.5 * Math.cos(theta0), 0.5 * Math.sin(theta0), 0]);
    instanceRoundRound.push([0.5 * Math.cos(theta1), 0.5 * Math.sin(theta1), 0]);
  }
  // Add the right cap.
  for (let step = 0; step < resolution; step++) {
    const theta0 = (3 * Math.PI) / 2 + ((step + 0) * Math.PI) / resolution;
    const theta1 = (3 * Math.PI) / 2 + ((step + 1) * Math.PI) / resolution;
    instanceRoundRound.push([0, 0, 1]);
    instanceRoundRound.push([0.5 * Math.cos(theta0), 0.5 * Math.sin(theta0), 1]);
    instanceRoundRound.push([0.5 * Math.cos(theta1), 0.5 * Math.sin(theta1), 1]);
  }
  return {
    buffer: regl.buffer(instanceRoundRound),
    count: instanceRoundRound.length,
  };
}

export function interleavedStripRoundCapJoin(regl: Regl, resolution: number) {
  const roundCapJoin = roundCapJoinGeometry(regl, resolution);
  return regl({
    vert: `
      precision highp float;
      attribute vec3 position;
      attribute vec2 pointA, pointB;
      uniform float width;
      uniform mat4 projection;
  
      void main() {
        vec2 xBasis = normalize(pointB - pointA);
        vec2 yBasis = vec2(-xBasis.y, xBasis.x);
        vec2 offsetA = pointA + width * (position.x * xBasis + position.y * yBasis);
        vec2 offsetB = pointB + width * (position.x * xBasis + position.y * yBasis);
        vec2 point = mix(offsetA, offsetB, position.z);
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
        buffer: roundCapJoin.buffer,
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
    },

    uniforms: {
      width: regl.prop<any, any>("width"),
      color: regl.prop<any, any>("color"),
      projection: regl.prop<any, any>("projection"),
    },

    depth: {
      enable: false,
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

    count: roundCapJoin.count,
    instances: regl.prop<any, any>("segments"),
    viewport: regl.prop<any, any>("viewport"),
  });
}
