
const vertices = [];
const normals = [];

const TO_RAD = Math.PI / 180;
const ROT_60 = TO_RAD * 60;
const S_60 = Math.sin(ROT_60);

function fractal(n, p1, p2, p3) {
    vertices.push(...p1);
    vertices.push(...p2);
    vertices.push(...p3);

    const ax = p2[0] - p1[0];
    const ay = p2[1] - p1[1];
    const az = p2[2] - p1[2];
    const bx = p3[0] - p1[0];
    const by = p3[1] - p1[1];
    const bz = p3[2] - p1[2];

    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const nn = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
    nx *= nn;
    ny *= nn;
    nz *= nn;

    normals.push(nx, ny, nz);
    normals.push(nx, ny, nz);
    normals.push(nx, ny, nz);

    if (n === 0) {
        return;
    }

    const gx = (p1[0] + p2[0] + p3[0]) / 3;
    const gy = (p1[1] + p2[1] + p3[1]) / 3;
    const gz = (p1[2] + p2[2] + p3[2]) / 3;

    const sx = (p1[0] + p2[0]) / 2;
    const sy = (p1[1] + p2[1]) / 2;
    const sz = (p1[2] + p2[2]) / 2;

    const tx = (p2[0] + p3[0]) / 2;
    const ty = (p2[1] + p3[1]) / 2;
    const tz = (p2[2] + p3[2]) / 2;

    const ux = (p1[0] + p3[0]) / 2;
    const uy = (p1[1] + p3[1]) / 2;
    const uz = (p1[2] + p3[2]) / 2;

    const r = Math.sqrt((sx - tx) * (sx - tx) + (sy - ty) * (sy - ty) + (sz - tz) * (sz - tz)) * Math.sqrt(6) / 3

    nx = nx * r + gx;
    ny = ny * r + gy;
    nz = nz * r + gz;

    fractal(n - 1, [nx, ny, nz], [sx, sy, sz], [tx, ty, tz]);
    fractal(n - 1, [nx, ny, nz], [tx, ty, tz], [ux, uy, uz]);
    fractal(n - 1, [nx, ny, nz], [ux, uy, uz], [sx, sy, sz]);
}

let n = 0;

function setup(n) {
    const r = 3;
    const p1 = [0, 0, -r / 2 / S_60];
    const p2 = [-r / 2, 0, r / 4 / S_60];
    const p3 = [r / 2, 0, r / 4 / S_60];
    const p4 = [0, p1[2] - p2[2], 0];
    fractal(n, p1, p2, p3);
    fractal(n, p4, p2, p1);
    fractal(n, p4, p3, p2);
    fractal(n, p4, p1, p3);
}

setup(n);

const gl = initContext('canvas');

const program = [];
const camera = {};
const matrix = {};

camera.position = new Vector3(1, 2.0, 4.0);
camera.target = new Vector3(0, 0, 0);
camera.up = new Vector3(0, 1, 0);
matrix.mMatrix = new Matrix4();
matrix.nMatrix = new Matrix3();
matrix.vMatrix = new Matrix4();
matrix.mvMatrix = new Matrix4();
matrix.pMatrix = new Matrix4();

Matrix4.perspective(45.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);

program.push(initShader(gl, 'shader-vs', 'shader-fs'));

function setupAttribute(name, arr) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    
    const buffer = new Float32Array(arr);
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    
    const loc = gl.getAttribLocation(program[0], name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
}

setupAttribute('position', vertices);
setupAttribute('normal', normals);

gl.useProgram(program[0]);

// gl.disable(gl.CULL_FACE);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let time = 0;

function render(delta) {
    time += delta;

    Matrix4.rotateXYZ(0, time * 0.002, 0, matrix.mMatrix);
    matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
    matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();

    program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
    program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
    program[0].uniform['nMatrix'].value = matrix.nMatrix.data;
    
    setupUniform(program[0]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
    gl.flush();
}

let timer = setAnimationFrame(render, 1000 / 30);

gl.canvas.addEventListener('click', () => {
    timer.toggle();
});

const slider = createSlider('n', 1, v => {
    let nn = v * 5 ^ 0;
    if (nn === n) {
        return;
    }
    n = nn;
    
    vertices.length = 0;
    normals.length = 0;

    setup(n);

    setupAttribute('position', vertices);
    setupAttribute('normal', normals);
});

document.body.appendChild(slider);

