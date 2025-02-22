'use strict';

let gl = initContext2('canvas', {antialias: true}),
    width = gl.canvas.width,
    height = gl.canvas.height;

let program = initShader(gl, 'shader-fs', 'shader-vs');

const div = 16;
const tdiv0 = 32;
const tdiv1 = 32;
let models = [
    createPlane(1.0, 1.0),
    createCube(),
    createSphere(div),
    createTorus(tdiv0, tdiv1, 1.0, 0.3)
];

// Plane
models[0].meshes[0].vertexStream.uv = [0, 0, 1, 0, 1, 1, 0, 1];
models[0].meshes[0].vertexStream.tangent = [
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0
];

// Cube
models[1].meshes[0].vertexStream.uv = [
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
];

models[1].meshes[0].vertexStream.tangent = [
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
];

// Sphere
const uv = [];

for (let i = 0; i <= div; i++) {
    let ph = i / div;
    for (let j = 0; j <= div; j++) {
        let th = j / div;
        uv.push(th);
        uv.push(1 - ph);
    }
}
models[2].meshes[0].vertexStream.uv = uv;

// Torus
const tuv = [];
for (let i = 0; i <= tdiv0; i++) {
    let ph = i / tdiv0;
    for (let j = 0; j <= tdiv1; j++) {
        let th = j / tdiv1;
        tuv.push(th);
        tuv.push(1 - ph);
    }
}
models[3].meshes[0].vertexStream.uv = tuv;

let index = 0;

for (let model of models) {
    initBuffer(gl, model);
}

let camera = {},
    matrix = {};

// camera.position = new Vector3(0, 2.0, 4.0);
camera.position = new Vector3(0, 2.5, 3.0);
camera.target = new Vector3(0, 0.0, 0);
camera.up = new Vector3(0, 1, 0);

let light = [0.0, 0.7, 4.0];

let frame = 0;
let showUV = false;

let pm = Matrix4.perspective(45.0 * Math.PI / 180.0, width / height, 0.1, 1000.0),
    vm = Matrix4.lookAt(camera.position, camera.target, camera.up),
    mm = Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02),
    mvm = mm.mul(vm);

let tvm = Matrix4.lookAt(new Vector3(0, 10, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0)),
    tm = Matrix4.identity();

let nm = mvm.toMatrix3().transpose().inverse();

program.uniform['mvMatrix'].value = mvm.data;
// program.uniform['mMatrix'].value = mm.data;
program.uniform['pMatrix'].value = pm.data;
// program.uniform['tMatrix'].value = tm.data;
program.uniform['nMatrix'].value = nm.data;
program.uniform['color'].value = [1, 1, 1, 1];//[0.2, 0.2, 0.7, 1];
program.uniform['light'].value = light;

const img = document.getElementById('tex');
gl.activeTexture(gl.TEXTURE0);
const tex = initTexture(gl, img);
program.uniform['tex'].value = 0;
gl.bindTexture(gl.TEXTURE_2D, tex);

const normal = document.getElementById('normal');
gl.activeTexture(gl.TEXTURE1);
const normalTex = initTexture(gl, normal);
program.uniform['normalTex'].value = 1;
gl.bindTexture(gl.TEXTURE_2D, normalTex);

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
    Matrix4.rotateXYZ(0, frame * 0.02, frame * 0.0, mm);
    mm.mul(vm, mvm);
    
    mvm.toMatrix3().transpose().inverse(nm);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(program);
    setupUniform(program);
    setupAttribute(program, models[index].meshes[0].vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, models[index].meshes[0].ibo);
    gl.drawElements(gl.TRIANGLES, models[index].meshes[0].indexStream.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();
}

document.body.appendChild(createRadio(['plane', 'cube', 'sphere', 'torus'], (v, id, i) => {
    index = i;
    render();
}));
