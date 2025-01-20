'use strict';

let gl = initContext2('canvas', {antialias: true}),
    width = gl.canvas.width,
    height = gl.canvas.height;

let program = initShader(gl, 'shader-fs', 'shader-vs');

const div = 16;
let models = [
    createPlane(1.0, 1.0),
    createCube(),
    createSphere(div),
    createTorus(16, 16, 1.0, 0.3)
];

// Plane
models[0].meshes[0].vertexStream.uv = [0, 0, 1, 0, 1, 1, 0, 1];
// Cube
models[1].meshes[0].vertexStream.uv = [
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
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
// for (let i = 0; i <= n; i++) {
//     let ph = i / n,
//         r = Math.cos(ph) * t,
//         y = Math.sin(ph) * t;
//     for (let j = 0; j <= m; j++) {
//         let th = 2.0 * Math.PI * j / m,
//             x = Math.cos(th) * (s + r),
//             z = Math.sin(th) * (s + r);
//         vertices.push(x, y, z);
//         normals.push(r * Math.cos(th), y, r * Math.sin(th));
//     }
// }
models[3].meshes[0].vertexStream.uv = uv;

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

let frame = 0;
let showUV = false;

let pm = Matrix4.perspective(45.0 * Math.PI / 180.0, width / height, 0.1, 1000.0),
    vm = Matrix4.lookAt(camera.position, camera.target, camera.up),
    mm = Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02),
    mvm = mm.mul(vm);

let tvm = Matrix4.lookAt(new Vector3(0, 10, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0)),
    tm = Matrix4.identity();

program.uniform['mvMatrix'].value = mvm.data;
// program.uniform['mMatrix'].value = mm.data;
program.uniform['pMatrix'].value = pm.data;
// program.uniform['tMatrix'].value = tm.data;
program.uniform['color'].value = [1, 1, 1, 1];//[0.2, 0.2, 0.7, 1];
program.uniform['showUV'].value = 0.0;

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
    Matrix4.rotateXYZ(0, frame * 0.02, frame * 0.0, mm);
    mm.mul(vm, mvm);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(program);
    setupUniform(program);
    setupAttribute(program, models[index].meshes[0].vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, models[index].meshes[0].ibo);
    gl.drawElements(gl.TRIANGLES, models[index].meshes[0].indexStream.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();
}

document.body.appendChild(createCheckbox('uv', v => {
    showUV = v;
    program.uniform['showUV'].value = showUV ? 1.0 : 0.0;
    render();
}));

document.body.appendChild(createRadio(['plane', 'cube', 'sphere', 'torus'], (v, id, i) => {
    index = i;
    render();
}));
