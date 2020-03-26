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

gl.activeTexture(gl.TEXTURE0);
const img = document.getElementById('tex');
const tex = initTexture(gl, img);

program.uniform['tex'].value = 0;

gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

gl.activeTexture(gl.TEXTURE1);
const img2 = document.getElementById('map');
const map = initTexture(gl, img2);
program.uniform['map'].value = 1;

gl.bindTexture(gl.TEXTURE_2D, map);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

setupUniform(program);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let frame = 0,
    time = 0;

const timer = setAnimationFrame(() => {
    time += delta;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.flush();
}, 1000 / 30);