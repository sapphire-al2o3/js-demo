const gl = initContext('canvas');
const program = initShader(gl, 'shader-vs', 'shader-fs');

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

const s = 1;
const buffer = new Float32Array([
    s, s,
    -s, s,
    s, -s,
    -s, -s
]);

gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

const loc = gl.getAttribLocation(program[0], 'position');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

gl.useProgram(program[0]);