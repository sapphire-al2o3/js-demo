'use strict';

let gl = initContext2('canvas', { preserveDrawingBuffer : true });

let program = [];
program.push(initShader(gl, 'shader-vs', 'shader-fs'));

var vbo = gl.createBuffer();
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
program[0].uniform['t'].value = [0, 0, 0, 0];
setupUniform(program[0]);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let time = 0;
function render(delta) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program[0].uniform['t'].value = [time * 0.01, 0, 0, 0];
    setupUniform(program[0]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();

    time += delta;
}

let timer = setAnimationFrame(render, 1000 / 30);

gl.canvas.addEventListener('click', () => {
    timer.toggle();
});

document.body.appendChild(createRecorder(gl.canvas, 1000));
