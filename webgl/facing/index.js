(function () {
    'use strict';

    let gl = initContext('canvas');

    let program = [];

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

    Matrix4.perspective(45.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
    Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);

    program.push(initShader(gl, 'shader-vs', 'shader-fs'));

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    
    const s = 1;
    const buffer = new Float32Array([
        s, s,
        -s, s,
        s, -s,
        -s, -s
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

    var loc = gl.getAttribLocation(program[0], 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program[0]);

    gl.disable(gl.CULL_FACE);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    let time = 0;

    function render(delta) {
        time += delta;

        Matrix4.rotateXYZ(time * 0.002, 0.0, time * 0.002, matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);

        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
        setupUniform(program[0]);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.flush();
    }

    let timer = setAnimationFrame(render, 1000 / 30);

    gl.canvas.addEventListener('click', () => {
        timer.toggle();
    });
}());
