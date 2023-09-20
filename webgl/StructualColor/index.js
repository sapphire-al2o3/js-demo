(function () {
    'use strict';

    let gl = initContext2('canvas');
    let scaling = new Scaling(gl, 4);
    let outline = new Outline(gl);

    let program = [];

    // シェーダを初期化
    program.push(initShader(gl, 'shader-vs', 'shader-fs'));

    let model = [
        createTorus(32, 32),
        createSphere(64),
        createCube(),
    ];

    let index = 0;

    model[0].meshes[0].vertexStream.position = model[0].meshes[0].vertexStream.position.map(x => x * 0.5);

    // 頂点バッファを作成
    initBuffer(gl, model[0]);
    initBuffer(gl, model[1]);
    initBuffer(gl, model[2]);

    let camera = {},
        matrix = {};
    camera.position = new Vector3(0, 4.0, 4.0);
    camera.target = new Vector3(0, 0.3, 0);
    camera.up = new Vector3(0, 1, 0);
    matrix.mMatrix = new Matrix4();
    matrix.nMatrix = new Matrix3();
    matrix.vMatrix = new Matrix4();
    matrix.mvMatrix = new Matrix4();
    matrix.pMatrix = new Matrix4();

    let light = [0.0, 0.7, 4.0],
        size = [1, 1, 2];

    // カメラの行列設定
    Matrix4.perspective(45.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
    Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);

    function drawMesh(program, mesh) {
        var gl = program.context;
        gl.useProgram(program);
        setupUniform(program);
        setupAttribute(program, mesh.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
        gl.drawElements(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
    }

    let frame = 0,
        time = 0;

    function render(delta) {
        time += delta;
        let rot = time * 0.001;
        light[0] = Math.cos(rot);
        light[2] = Math.sin(rot);
        Matrix4.rotateXYZ(rot, 0.0, rot, matrix.mMatrix);
        // Matrix4.scale(0.5, 0.5, 0.5, matrix.mMatrix);
        // Matrix4.identity(matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();

        let fb = scaling.setup();

        gl.clearColor(1.0, 1.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.cullFace(gl.BACK);
        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
        program[0].uniform['nMatrix'].value = matrix.nMatrix.data;
        // program[0].uniform['color'].value = color ? 1.0 : 0.3;
        program[0].uniform['light'].value = light;
        program[0].uniform['size'].value = size;
        
        drawMesh(program[0], model[index].meshes[0]);
        
        outline.draw(1, fb);
        scaling.draw();

        gl.flush();
    }

    let timer = setAnimationFrame(render, 1000 / 30);

    gl.canvas.addEventListener('click', () => {
        timer.toggle();
    });

    document.body.appendChild(createSlider('pattern-size', 0, v => {
        size[0] = size[1] = v * 8 + 1;
        render(0);
    }));
    document.body.appendChild(createSlider('pattern-mod', 0, v => {
        size[2] = (v * 4 ^ 0) + 1;
        render(0);
    }));
    document.body.appendChild(createRadio(['torus', 'sphere', 'cube'], (v, id, i) => {
        index = i;
        render(0);
    }));
}());
