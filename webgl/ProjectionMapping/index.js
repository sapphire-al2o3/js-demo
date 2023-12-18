'use strict';

let gl = initContext2('canvas', {antialias: true}),
    width = gl.canvas.width,
    height = gl.canvas.height;

let program = initShader(gl, 'shader-fs', 'shader-vs');

let models = [
    createPlane(1.0, 1.0),
    createCube(),
    createSphere(8, 1.5),
];

let index = 0;

for (let model of models) {
    initBuffer(gl, model);
}

let camera = {},
    matrix = {};

camera.position = new Vector3(0, 2.0, 4.0);
camera.target = new Vector3(0, 0.0, 0);
camera.up = new Vector3(0, 1, 0);

let frame = 0;

let pm = Matrix4.perspective(45.0 * Math.PI / 180.0, width / height, 0.1, 1000.0),
    vm = Matrix4.lookAt(camera.position, camera.target, camera.up),
    mm = Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02),
    mvm = mm.mul(vm);

let tvm = Matrix4.lookAt(new Vector3(0, 10, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0)),
    tm = Matrix4.identity();

program.uniform['mvMatrix'].value = mvm.data;
program.uniform['mMatrix'].value = mm.data;
program.uniform['pMatrix'].value = pm.data;
program.uniform['tMatrix'].value = tm.data;
program.uniform['color'].value = [1, 1, 1, 1];//[0.2, 0.2, 0.7, 1];

const img = document.getElementById('tex');
const tex = initTexture(gl, img);

gl.bindTexture(gl.TEXTURE_2D, tex);

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.viewport(0, 0, width, height);

let timer = setAnimationFrame(() => {
    frame++;
    render();
}, 1000 / 30);

gl.canvas.addEventListener('click', (e) => {
    timer.toggle();
});

function render() {
    Matrix4.rotateXYZ(0, frame * 0.02, 0, mm);
    mm.mul(vm, mvm);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(program);
    setupUniform(program);
    setupAttribute(program, models[index].meshes[0].vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, models[index].meshes[0].ibo);
    gl.drawElements(gl.TRIANGLES, models[index].meshes[0].indexStream.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();
}

document.body.appendChild(createRadio(['plane', 'cube', 'sphere'], (v, id, i) => {
    index = i;
}));
