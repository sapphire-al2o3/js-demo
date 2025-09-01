'use strict';
const canvas = document.getElementById('stripeTex');
const ctx = canvas.getContext('2d');
const width = canvas.width;
ctx.fillStyle = '#E00';
ctx.fillRect(0, 0, width, 8);
ctx.fillStyle = '#000';
for (let i = 0; i < 12; i++) {
    let x = Math.random() * width ^ 0;
    let w = Math.random() * 32 ^ 0;
    ctx.fillRect(x, 0, w, 8);
}


let gl = initContext2('canvas', { preserveDrawingBuffer : true });

let program = initShader(gl, 'shader-vs', 'shader-fs');

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
let p0 = [0.83, 0.75, 1.5];
let p1 = [0.60, 0.07, -1.5];
let p2 = [0.28, 0.24, 1.5];
let p3 = [0.51, 0.86, -1.5];
let stripe = true;
let timeScale = 1;

gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

const loc = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

let tex = initTexture(gl, canvas);
program.uniform['tex'].value = 0;
gl.bindTexture(gl.TEXTURE_2D, tex);
// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

gl.useProgram(program);
program.uniform['strength'].value = strength;
program.uniform['p0'].value = p0;
program.uniform['p1'].value = p1;
program.uniform['p2'].value = p2;
program.uniform['p3'].value = p3;
program.uniform['stripe'].value = stripe ? 1.0 : 0.0;
program.uniform['time'].value = 0;
setupUniform(program);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let time = 0;
function render(delta) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program.uniform['strength'].value = strength;
    program.uniform['p0'].value = p0;
    program.uniform['p1'].value = p1;
    program.uniform['p2'].value = p2;
    program.uniform['p3'].value = p3;
    program.uniform['stripe'].value = stripe ? 1.0 : 0.0;
    program.uniform['time'].value = time * timeScale * 0.0001;

    setupUniform(program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();

    time += delta;
}

let timer = setAnimationFrame(render, 1000 / 30);

document.body.appendChild(createCheckbox('stripe', v => {
    stripe = v;
}, stripe));

document.body.appendChild(createCheckbox('time', v => {
    timeScale = v ? 1 : 0;
}, stripe));

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

document.body.appendChild(createSlider('p3.x', p3[0], v => {
    p3[0] = v;
}));

document.body.appendChild(createSlider('p3.y', p3[1], v => {
    p3[1] = v;
}));

