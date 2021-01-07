'use strict';
document.querySelector('#canvasWebgl').width = window.innerWidth
document.querySelector('#canvasWebgl').height = window.innerHeight
const gl = document.querySelector('#canvasWebgl').getContext('webgl');

const vs = `
attribute float vertexId;
uniform float numVerts;
uniform float time;

// hash function from https://www.shadertoy.com/view/4djSRW
// given a value between 0 and 1
// returns a value between 0 and 1 that *appears* kind of random
float hash(float p) {
  vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
  p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
  return fract(p2.x * p2.y * 95.4337);
}

void main() {
  float u = vertexId / numVerts;          // goes from 0 to 1
  float off = floor(time + u)+10.0 / 1000.0;   // changes once per second per vertex
  float x = hash(u + off) * 2.0 - 1.0;    // random position
  float y = (fract(time + u)) * -2.0 + 1.0; // 1.0 ->  -1.0

  gl_Position = vec4(x, y, 0, 1);
  gl_PointSize = 3.0;
}
`;

const fs = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1, 1, 1, 1);
}
`;

// setup GLSL program
const program = webglUtils.createProgramFromSources(gl, [vs, fs]);
const vertexIdLoc = gl.getAttribLocation(program, 'vertexId');
const numVertsLoc = gl.getUniformLocation(program, 'numVerts');
const timeLoc = gl.getUniformLocation(program, 'time');

// Make a buffer with just a count in it.

const numVerts = 10000;
const vertexIds = new Float32Array(numVerts);
vertexIds.forEach((v, i) => {
  vertexIds[i] = i;
});

const idBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexIds, gl.STATIC_DRAW);

// draw
function render(time) {
  time *= 0.0001;  // convert to seconds

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(program);

  {
    // Turn on the attribute
    gl.enableVertexAttribArray(vertexIdLoc);

    // Bind the id buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);

    // Tell the attribute how to get data out of idBuffer (ARRAY_BUFFER)
    const size = 1;          // 1 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        vertexIdLoc, size, type, normalize, stride, offset);
  }

  // tell the shader the number of verts
  gl.uniform1f(numVertsLoc, numVerts);
  // tell the shader the time
  gl.uniform1f(timeLoc, time);

  const offset = 0;
  gl.drawArrays(gl.POINTS, offset, numVerts);


  requestAnimationFrame(render);
}
requestAnimationFrame(render);
