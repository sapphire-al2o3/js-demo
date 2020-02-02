(function () {
    'use strict';

    let gl = initContext('canvas');

    let program = [];

    // シェーダを初期化
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

    const img = document.getElementById('lut');
    const tex = initTexture(gl, img);

    program[0].uniform['lut'].value = 0;
    setupUniform(program[0]);

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    let light = [0.0, 0.7, 4.0],
        size = [1, 1, 2];

    let frame = 0,
        time = 0;

    function render(delta) {
        time += delta;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.flush();
    }

    let timer = setAnimationFrame(render, 1000 / 30);

    gl.canvas.addEventListener('click', () => {
        timer.toggle();
    });
}());
