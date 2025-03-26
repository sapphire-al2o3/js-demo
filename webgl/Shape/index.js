'use strict';

let gl = initContext2('canvas', {antialias: true}),
    width = gl.canvas.width,
    height = gl.canvas.height;

let program = initShader(gl, 'shader-fs', 'shader-vs');

let models = [
    createIco(1.5),
    createTorus(16, 16, 1.2, 0.4),
    createSphere(8, 1.5),
    createCube(),
    createPlane(1, 1),
    createCone(1, 2, 16)
];

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

const color = [0, 1, 0, 1];

program.uniform['mvMatrix'].value = mvm.data;
program.uniform['pMatrix'].value = pm.data;
program.uniform['color'].value = color;

gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

function createCone(r, h, n = 8) {
    let vertices = [],
        indices = [],
        normals = [];
    let b = -0.5;
    vertices.push(0, h + b, 0);
    vertices.push(0, b, 0);
    for (let i = 0; i <= n; i++) {
        let t = Math.PI * 2 * i / n,
            x = r * Math.cos(t),
            y = r * Math.sin(t);
        vertices.push(x, b, y);
        normals.push();
    }

    for (let i = 0; i <= n; i++) {
        indices.push(0, i + 1, i + 2);
    }
    for (let i = 0; i <= n; i++) {
        indices.push(1, i + 1, i + 2);
    }
    return {
        meshes: [
            {
                indexStream: indices,
                vertexStream: {
                    position: vertices
                }
            }
        ]
    };
}

document.body.appendChild(createRadio(['ico', 'torus', 'sphere', 'cube', 'plane', 'cone'], (v, id, i) => {
    if (index !== i) {
        index = i
        render();
    }
}));
