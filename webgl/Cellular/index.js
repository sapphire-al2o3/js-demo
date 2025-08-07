'use strict';
const stripe = document.getElementById('stripe');
const ctx = stripe.getContext('2d');
ctx.fillStyle = '#E00';
ctx.fillRect(0, 0, 128, 8);
ctx.fillStyle = '#000';
for (let i = 0; i < 12; i++) {
    let x = Math.random() * 128 ^ 0;
    let w = Math.random() * 16 ^ 0;
    ctx.fillRect(x, 0, w, 8);
}


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

let strength = 0.0;
let p0 = [0.83,0.75];
let p1 = [0.60,0.07];
let p2 = [0.28,0.64];

gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

const loc = gl.getAttribLocation(program[0], 'position');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

let tex = initTexture(gl, stripe);
program[0].uniform['tex'].value = 0;
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

gl.useProgram(program[0]);
program[0].uniform['strength'].value = strength;
program[0].uniform['p0'].value = p0;
program[0].uniform['p1'].value = p1;
program[0].uniform['p2'].value = p2;
setupUniform(program[0]);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let time = 0;
function render(delta) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program[0].uniform['strength'].value = strength;
    program[0].uniform['p0'].value = p0;
    program[0].uniform['p1'].value = p1;
    program[0].uniform['p2'].value = p2;

    setupUniform(program[0]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();

    time += delta;
}

let timer = setAnimationFrame(render, 1000 / 30);

document.body.appendChild(createSlider('strength', 0, v => {
    strength = v * 8;
}));

document.body.appendChild(createSlider('p0.x', p0[0], v => {
    p0[0] = v;
}));

document.body.appendChild(createSlider('p0.y', p0[1], v => {
    p0[1] = v;
}));

document.body.appendChild(createSlider('p1.x', p1[0], v => {
    p1[0] = v;
}));

document.body.appendChild(createSlider('p1.y', p1[1], v => {
    p1[1] = v;
}));

document.body.appendChild(createSlider('p2.x', p2[0], v => {
    p2[0] = v;
}));

document.body.appendChild(createSlider('p2.y', p2[1], v => {
    p2[1] = v;
}));

