'use strict';

let gl = initContext2('canvas', {antialias: true}),
    width = gl.canvas.width,
    height = gl.canvas.height;

let program = initShader(gl, 'shader-fs', 'shader-vs');

let models = [
    createIco(),
    createTorus(16, 16),
    createSphere(8),
    createCube(),
];

models[1].meshes[0].vertexStream.position = models[1].meshes[0].vertexStream.position.map(x => x * 0.4);

function pushIndex(lines, pair, a, b) {
    if (a > b) {
        let t = a;
        a = b;
        b = t;
    }
    if (pair[(a << 16) + b] === undefined) {
        lines.push(a);
        lines.push(b);
        pair[(a << 16) + b] = 1;
    }
}

for (let i = 1; i < models.length; i++) {
    const t = models[i].meshes[0].indexStream;
    const lines = [];
    const pair = {};
    for (let j = 0; j < t.length; j += 3) {
        pushIndex(lines, pair, t[j], t[j + 1]);
        pushIndex(lines, pair, t[j + 1], t[j + 2]);
        pushIndex(lines, pair, t[j + 2], t[j]);
        // lines.push(t[j]);
        // lines.push(t[j + 1]);
        // lines.push(t[j + 1]);
        // lines.push(t[j + 2]);
        // lines.push(t[j + 2]);
        // lines.push(t[j]);
    }
    console.log(lines.length);
    models[i].meshes[0].indexStream = lines;
}

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

program.uniform['mvMatrix'].value = mvm.data;
program.uniform['pMatrix'].value = pm.data;
program.uniform['color'].value = [0, 0, 0, 1];

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
    gl.drawElements(gl.LINES, models[index].meshes[0].indexStream.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();
}
function createIco() {
    let m = {},
        a = 1 / Math.sqrt(5),
        b = (1 - a) * 0.5,
        c = (1 + a) * 0.5,
        d = Math.sqrt(b),
        e = Math.sqrt(c);
    m.meshes = [{}];
    m.meshes[0].vertexStream = {};
    m.meshes[0].vertexStream.position = [
        0, 1, 0,
        0, a, a * 2,
        e, a, b,
        d, a, -c,
        -d, a, -c,
        -e, a, b,
        d, -a, c,
        e, -a, -b,
        0, -a, -a * 2,
        -e, -a, -b,
        -d, -a, c,
        0, -1, 0
    ];
    m.meshes[0].indexStream = [
        0, 1, 1, 2,
        0, 2, 2, 3,
        0, 3, 3, 4,
        0, 4, 4, 5,
        0, 5, 5, 1,
        2, 6, 6, 1,
        3, 7, 7, 2,
        4, 8, 8, 3,
        5, 9, 9, 4,
        1, 10, 10, 5,
        11, 6, 6, 7,
        11, 7, 7, 8,
        11, 8, 8, 9,
        11, 9, 9, 10,
        11, 10, 10, 6
    ];
    return m;
}

document.body.appendChild(createRadio(['ico', 'torus', 'sphere', 'cube'], (v, id, i) => {
    index = i;
}));
