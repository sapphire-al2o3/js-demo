(function () {
    'use strict';

    var gl = initContext('canvas');

    var program = [];

    // シェーダを初期化
    program.push(initShader(gl, 'shader-vs', 'shader-fs'));

    // トーラスを作る
    var model = createSphere(64);

    // 頂点バッファを作成
    initBuffer(gl, model);

    var camera = {},
        matrix = {};
    camera.position = new Vector3(0, 4.0, 2.0);
    camera.target = new Vector3(0, 0.3, 0);
    camera.up = new Vector3(0, 1, 0);
    matrix.mMatrix = new Matrix4();
    matrix.nMatrix = new Matrix3();
    matrix.vMatrix = new Matrix4();
    matrix.mvMatrix = new Matrix4();
    matrix.pMatrix = new Matrix4();

    let light = [0.0, 0.7, 4.0];

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

    let timer = setAnimationFrame(function(delta) {
        frame++;
        time += delta;
        light[0] = Math.cos(frame * 0.02);
        light[2] = Math.sin(frame * 0.02);
        Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02, matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.cullFace(gl.BACK);
        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
        program[0].uniform['nMatrix'].value = matrix.nMatrix.data;
        // program[0].uniform['color'].value = color ? 1.0 : 0.3;
        program[0].uniform['light'].value = light;
        
        drawMesh(program[0], model.meshes[0]);
        
        gl.flush();
    }, 1000 / 30);

    gl.canvas.addEventListener('click', function() {
        timer.toggle();
    });
}());
