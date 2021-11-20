(function () {
    'use strict';

    var gl = initContext('canvas');

    gl.viewport(0, 0, 300, 300);
    gl.enable(gl.SCISSOR_TEST);
    var program = [];

    // シェーダを初期化
    program.push(initShader(gl, 'shader-vs', 'shader-fs'));

    // トーラスを作る
    // let model = createTorus(32, 32);
    let model = createSphere(64);

    // 頂点バッファを作成
    initBuffer(gl, model);

    let camera = {},
        matrix = {};
    camera.position = new Vector3(0, 3.0, 1.0);
    camera.target = new Vector3(0, 0.3, 0);
    camera.up = new Vector3(0, 1, 0);
    matrix.mMatrix = new Matrix4();
    matrix.nMatrix = new Matrix3();
    matrix.vMatrix = new Matrix4();
    matrix.mvMatrix = new Matrix4();
    matrix.pMatrix = new Matrix4();

    let light = [0.0, 0.7, 4.0],
        size = [1, 1, 2],
        thr = [0.2, 0.9];

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

    let rect1 = [150, 50, 100, 100];

    function render(delta) {
        time += delta;
        // light[0] = Math.cos(time * 0.001);
        // light[2] = Math.sin(time * 0.001);
        // Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02, matrix.mMatrix);
        // Matrix4.scale(0.5, 0.5, 0.5, matrix.mMatrix);
        Matrix4.identity(matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();

        rect1[0] = 150 + 100 * Math.sin(time * 0.003);
        rect1[1] = 50 + 100 * Math.cos(time * 0.004);
        rect1[2] = 100 + 100 * Math.cos(time * 0.005);
        rect1[3] = 100 + 100 * Math.cos(time * 0.006);

        gl.scissor(0, 0, 300, 300);
        gl.clearColor(0.5, 1.0, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.scissor(rect1[1], 0, rect1[3], 300);
        // gl.clearColor(1.0, 1.0, 0.0, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.cullFace(gl.BACK);
        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
        program[0].uniform['nMatrix'].value = matrix.nMatrix.data;
        program[0].uniform['color'].value = [1, 0.2, 0];
        program[0].uniform['light'].value = light;
        // program[0].uniform['size'].value = size;
        // program[0].uniform['thr'].value = thr;
        
        

        drawMesh(program[0], model.meshes[0]);
        
        gl.scissor(0, rect1[0], 300, rect1[2]);
        // gl.clearColor(1.0, 0.0, 1.0, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        program[0].uniform['color'].value = [0.2, 0.2, 1];
        drawMesh(program[0], model.meshes[0]);

        gl.flush();
    }

    let timer = setAnimationFrame(render, 1000 / 30);

    gl.canvas.addEventListener('click', () => {
        timer.toggle();
    });
}());
