(function () {
    'use strict';

    let gl = initContext('canvas', {'stencil':true});

    gl.viewport(0, 0, 300, 300);

    let outline = new Outline(gl);

    let program = [];

    // シェーダを初期化
    program.push(initShader(gl, 'shader-vs', 'shader-fs'));

    // トーラスを作る
    // let model = createTorus(32, 32);
    let model = [
        createSphere(64),
        createTorus(32, 32)
    ];

    // 頂点バッファを作成
    initBuffer(gl, model[0]);
    initBuffer(gl, model[1]);

    let camera = {},
        matrix = {};
    camera.position = new Vector3(0, 4.0, 8.0);
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

    function render(delta) {
        time += delta;
        light[0] = Math.cos(time * 0.001);
        light[2] = Math.sin(time * 0.001);
        // Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02, matrix.mMatrix);
        // Matrix4.scale(0.5, 0.5, 0.5, matrix.mMatrix);
        Matrix4.identity(matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();

        outline.setup();

        gl.clearColor(1.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        
        gl.cullFace(gl.BACK);
        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
        program[0].uniform['nMatrix'].value = matrix.nMatrix.data;
        // program[0].uniform['color'].value = color ? 1.0 : 0.3;
        program[0].uniform['light'].value = light;
        
        Matrix4.scale(2.5, 2.5, 2.5, matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;

        gl.stencilFunc(gl.ALWAYS, 128, ~0);
        gl.stencilOp(gl.KEEP, gl.REPLACE, gl.REPLACE);
        gl.colorMask(false, false, false, false);
        gl.depthMask(false);

        drawMesh(program[0], model[0].meshes[0]);

        Matrix4.scale(0.7, 0.7, 0.7, matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;

        gl.stencilFunc(gl.EQUAL, 128, ~0);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.colorMask(true, true, true, true);
        gl.depthMask(true);

        drawMesh(program[0], model[1].meshes[0]);
        
        outline.draw(1);

        gl.flush();
    }

    let timer = setAnimationFrame(render, 1000 / 30);

    gl.canvas.addEventListener('click', () => {
        timer.toggle();
    });
}());
