import{R as w,o as _,c as x}from"./vendor.8444f24e.js";const z=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&e(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerpolicy&&(i.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?i.credentials="include":s.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}};z();const y={positions:[[0,-.5],[1,-.5],[1,.5],[0,.5]],cells:[[0,1,2],[0,2,3]]};function A(o){return o({vert:`
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
        }`,frag:`
        precision highp float;
        uniform vec4 color;
        void main() {
          gl_FragColor = color;
        }`,attributes:{position:{buffer:y.positions,divisor:0},pA:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*0},pB:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*2},pC:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*4},pD:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*6}},uniforms:{width:o.prop("width"),color:o.prop("color"),projection:o.prop("projection")},blend:{enable:!0,func:{src:"src alpha",dst:"one minus src alpha"}},cull:{enable:!0,face:"back"},depth:{enable:!1},elements:y.cells,instances:o.prop("segments"),viewport:o.prop("viewport")})}function T(o){return o({vert:`
        precision highp float;
        attribute vec2 position;
        attribute vec3 color;
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
        }`,frag:`
        precision highp float;
        uniform vec4 color;
        void main() {
          gl_FragColor = color;
        }`,attributes:{position:{buffer:y.positions,divisor:0},pA:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*0,stride:Float32Array.BYTES_PER_ELEMENT*6},pB:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*2,stride:Float32Array.BYTES_PER_ELEMENT*6},pC:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*4,stride:Float32Array.BYTES_PER_ELEMENT*6}},uniforms:{width:o.prop("width"),color:o.prop("color"),projection:o.prop("projection")},blend:{enable:!0,func:{src:"src alpha",dst:"one minus src alpha"}},cull:{enable:!0,face:"back"},depth:{enable:!1},elements:y.cells,instances:o.prop("segments"),viewport:o.prop("viewport")})}const M={positions:[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]],cells:[[0,1,2],[0,2,3]]};function P(o){return o({vert:`
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
      }`,frag:`
      precision highp float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,depth:{enable:!1},attributes:{position:{buffer:M.positions,divisor:0},pointA:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*0},pointB:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*2},pointC:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*4}},uniforms:{width:o.prop("width"),color:o.prop("color"),projection:o.prop("projection")},blend:{enable:!0,func:{src:"src alpha",dst:"one minus src alpha"}},cull:{enable:!0,face:"back"},elements:M.cells,instances:o.prop("instances"),viewport:o.prop("viewport")})}const C=[[1,0,0],[0,1,0],[0,0,1]];function j(o){return o({vert:`
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
    }`,frag:`
    precision highp float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,depth:{enable:!1},attributes:{position:{buffer:o.buffer(C),divisor:0},pointA:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*0},pointB:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*2},pointC:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*4}},uniforms:{width:o.prop("width"),color:o.prop("color"),projection:o.prop("projection")},blend:{enable:!0,func:{src:"src alpha",dst:"one minus src alpha"}},cull:{enable:!0,face:"back"},count:C.length,instances:o.prop("instances"),viewport:o.prop("viewport")})}function R(o){const t=[],n=[];for(let e=0;e<o+2;e++)t.push(e);for(let e=0;e<o;e++)n.push([0,e+1,e+2]);return{ids:t,cells:n}}function N(o,t){const n=R(t);return o({vert:`
    precision highp float;
    attribute vec2 pointA, pointB, pointC;
    attribute float id;
    uniform float width;
    uniform mat4 projection;

    const float resolution = ${t.toExponential()};

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
    }`,frag:`
    precision highp float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,depth:{enable:!1},attributes:{id:{buffer:n.ids,divisor:0},pointA:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*0},pointB:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*2},pointC:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*4}},uniforms:{width:o.prop("width"),color:o.prop("color"),projection:o.prop("projection")},blend:{enable:!0,func:{src:"src alpha",dst:"one minus src alpha"}},cull:{enable:!0,face:"back"},elements:n.cells,instances:o.prop("instances"),viewport:o.prop("viewport")})}function F(o){const t=[[0,0]];for(let e=0;e<=o;e++){const s=-.5*Math.PI+Math.PI*e/o;t.push([.5*Math.cos(s),.5*Math.sin(s)])}const n=[];for(let e=0;e<o;e++)n.push([0,e+1,e+2]);return{positions:t,cells:n}}function S(){return{positions:[[0,.5],[0,-.5],[.5,-.5],[.5,.5]],cells:[[0,1,2],[0,2,3]]}}function g(o,t){return o({vert:`
        precision highp float;
        attribute vec2 position;
        attribute vec3 color;
        attribute vec2 pA, pB;
        uniform float width;
        uniform mat4 projection;
  
        void main() {
          vec2 xBasis = normalize(pA - pB);
          vec2 yBasis = vec2(-xBasis.y, xBasis.x);
          vec2 point = pA + xBasis * width * position.x + yBasis * width * position.y;
          gl_Position = projection * vec4(point, 0, 1);
        }`,frag:`
        precision highp float;
        uniform vec4 color;
        void main() {
          gl_FragColor = color;
        }`,attributes:{position:{buffer:t.positions,divisor:0},pA:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*0,stride:Float32Array.BYTES_PER_ELEMENT*4},pB:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*2,stride:Float32Array.BYTES_PER_ELEMENT*4}},uniforms:{width:o.prop("width"),color:o.prop("color"),projection:o.prop("projection")},blend:{enable:!0,func:{src:"src alpha",dst:"one minus src alpha"}},cull:{enable:!0,face:"back"},depth:{enable:!1},elements:t.cells,instances:o.prop("instances"),viewport:o.prop("viewport")})}function Y(){const o=w({extensions:["ANGLE_instanced_arrays"]}),t=document.getElementsByTagName("canvas")[0];t.classList.add("grid");const n=_(x(),-t.width/2,t.width/2,-t.height/2,t.height/2,0,-1),e={x:0,y:0,width:t.width,height:t.height};function s(r,d){const c=r/9,m=d/10,E=[];for(let B=1;B<9;B+=2)E.push([(B+0)*c-r/2,3*m-d/2]),E.push([(B+1)*c-r/2,7*m-d/2]);return E}const i=s(t.width,t.height),a=window.location.hash,h=a.includes("color-coded"),p=a.includes("alpha")?.75:1;let f;a.includes("bevel-join")?f=j(o):a.includes("miter-join")?f=P(o):a.includes("round-join")&&(f=N(o,16));let l;if(a.includes("round-cap")){const r=F(16);l=g(o,r)}else if(a.includes("square-cap")){const r=S();l=g(o,r)}const v=A(o),b=T(o);function u(){const r=.45*Math.sin(performance.now()*.002)+.75,d=Math.sin(performance.now()*3e-4),c=[];for(const m of i)c.push([m[0]*r,m[1]*d]);o.clear({color:[0,0,0,0]}),v({points:c,segments:i.length-3,width:32,color:h?[1,0,0,p]:[.25,.25,.25,p],projection:n,viewport:e}),a.includes("terminal")&&b({points:[c[0],c[1],c[2],c[i.length-1],c[i.length-2],c[i.length-3]],segments:2,width:32,color:h?[0,.5,0,p]:[.25,.25,.25,p],projection:n,viewport:e}),f!==void 0&&f({points:c,instances:i.length-2,width:32,color:h?[0,0,1,p]:[.25,.25,.25,p],projection:n,viewport:e}),l!==void 0&&l({points:[c[0],c[1],c[i.length-1],c[i.length-2]],instances:2,width:32,color:h?[1,0,1,p]:[.25,.25,.25,p],projection:n,viewport:e}),requestAnimationFrame(u)}u()}function I(){const o=w({extensions:["ANGLE_instanced_arrays"]}),t=document.getElementsByTagName("canvas")[0];t.classList.add("grid");const n=_(x(),-t.width/2,t.width/2,-t.height/2,t.height/2,0,-1),e={x:0,y:0,width:t.width,height:t.height};function s(r,d){const c=[];for(let m=0;m<1e3;m++){const E=m*.1,B=-r/3+m*r/1.5/1e3;c.push([B+d*.25*Math.cos(E),d*.25*Math.sin(E)])}return c}const i=s(t.width,t.height),a=window.location.hash,h=a.includes("color-coded"),p=a.includes("alpha")?.75:1;let f;a.includes("bevel-join")?f=j(o):a.includes("miter-join")?f=P(o):a.includes("round-join")&&(f=N(o,16));let l;if(a.includes("round-cap")){const r=F(16);l=g(o,r)}else if(a.includes("square-cap")){const r=S();l=g(o,r)}const v=A(o),b=T(o);function u(){o.clear({color:[0,0,0,0]});const r=32*(.5*Math.sin(performance.now()*.002)+.5)+4;v({points:i,segments:i.length-3,width:r,color:h?[1,0,0,p]:[.25,.25,.25,p],projection:n,viewport:e}),a.includes("terminal")&&b({points:[i[0],i[1],i[2],i[i.length-1],i[i.length-2],i[i.length-3]],segments:2,width:r,color:h?[0,.5,0,p]:[.25,.25,.25,p],projection:n,viewport:e}),f!==void 0&&f({points:i,instances:i.length-2,width:r,color:h?[0,0,1,p]:[.25,.25,.25,p],projection:n,viewport:e}),l!==void 0&&l({points:[i[0],i[1],i[i.length-1],i[i.length-2]],instances:2,width:r,color:h?[1,0,1,p]:[.25,.25,.25,p],projection:n,viewport:e}),requestAnimationFrame(u)}u()}const L=[[0,-.5],[1,-.5],[1,.5],[0,-.5],[1,.5],[0,.5]];function q(o){return o({vert:`
      precision highp float;
      attribute vec2 position;
      attribute vec2 pointA, pointB;
      uniform float width;
      uniform mat4 projection;
  
      void main() {
        vec2 xBasis = pointB - pointA;
        vec2 yBasis = normalize(vec2(-xBasis.y, xBasis.x));
        vec2 point = pointA + xBasis * position.x + yBasis * width * position.y;
        gl_Position = projection * vec4(point, 0, 1);
      }`,frag:`
      precision highp float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,attributes:{position:{buffer:o.buffer(L),divisor:0},pointA:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*0},pointB:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*2}},uniforms:{width:o.prop("width"),color:o.prop("color"),projection:o.prop("projection")},cull:{enable:!0,face:"back"},depth:{enable:!1},blend:{enable:!0,func:{src:"src alpha",dst:"one minus src alpha"}},count:L.length,instances:o.prop("segments"),viewport:o.prop("viewport")})}function k(o,t){const n=[[0,-.5,0],[0,-.5,1],[0,.5,1],[0,-.5,0],[0,.5,1],[0,.5,0]];for(let e=0;e<t;e++){const s=Math.PI/2+(e+0)*Math.PI/t,i=Math.PI/2+(e+1)*Math.PI/t;n.push([0,0,0]),n.push([.5*Math.cos(s),.5*Math.sin(s),0]),n.push([.5*Math.cos(i),.5*Math.sin(i),0])}for(let e=0;e<t;e++){const s=3*Math.PI/2+(e+0)*Math.PI/t,i=3*Math.PI/2+(e+1)*Math.PI/t;n.push([0,0,1]),n.push([.5*Math.cos(s),.5*Math.sin(s),1]),n.push([.5*Math.cos(i),.5*Math.sin(i),1])}return{buffer:o.buffer(n),count:n.length}}function D(o,t){const n=k(o,t);return o({vert:`
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
      }`,frag:`
      precision highp float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,attributes:{position:{buffer:n.buffer,divisor:0},pointA:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*0},pointB:{buffer:o.prop("points"),divisor:1,offset:Float32Array.BYTES_PER_ELEMENT*2}},uniforms:{width:o.prop("width"),color:o.prop("color"),projection:o.prop("projection")},depth:{enable:!1},blend:{enable:!0,func:{src:"src alpha",dst:"one minus src alpha"}},cull:{enable:!0,face:"back"},count:n.count,instances:o.prop("segments"),viewport:o.prop("viewport")})}function G(){const o=w({extensions:["ANGLE_instanced_arrays"]}),t=document.getElementsByTagName("canvas")[0];t.classList.add("grid");const n=_(x(),-t.width/2,t.width/2,-t.height/2,t.height/2,0,-1),e={x:0,y:0,width:t.width,height:t.height};function s(l,v){const b=l/9,u=v/10,r=[];for(let d=1;d<9;d+=2)r.push([(d+0)*b-l/2,3*u-v/2]),r.push([(d+1)*b-l/2,7*u-v/2]);return r}const i=s(t.width,t.height),h=window.location.hash.includes("segments")?q(o):D(o,16),p=window.location.hash.includes("alpha");function f(){const l=.45*Math.sin(performance.now()*.002)+.75,v=Math.sin(performance.now()*3e-4),b=[];for(const u of i)b.push([u[0]*l,u[1]*v]);o.clear({color:[0,0,0,0]}),h({points:b,segments:i.length-1,width:32,color:[.25,.25,.25,p?.75:1],projection:n,viewport:e}),requestAnimationFrame(f)}f()}window.location.hash.includes("old-2d")?G():window.location.hash.includes("new-2d")?Y():window.location.hash.includes("self-overlapping")&&I();
