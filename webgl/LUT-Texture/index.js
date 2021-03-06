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

    let offset = [0, 0, 0];

    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

    var loc = gl.getAttribLocation(program[0], 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program[0]);

    
    gl.activeTexture(gl.TEXTURE0);
    const img = document.getElementById('lut');
    const lut = initTexture(gl, img);

    program[0].uniform['lut'].value = 0;

    gl.bindTexture(gl.TEXTURE_2D, lut);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    gl.activeTexture(gl.TEXTURE1);
    const img2 = document.getElementById('dist');
    const dist = initTexture(gl, img2);
    program[0].uniform['dist'].value = 1;

    gl.bindTexture(gl.TEXTURE_2D, dist);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    program[0].uniform['offset'].value = offset;

    setupUniform(program[0]);
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

    document.body.appendChild(createSlider('offset', 0.5, v => {
        offset[0] = v * 2.0 - 1.0;
        setupUniform(program[0]);
    }));
    document.body.appendChild(createSlider('offset 2', 0.5, v => {
        offset[1] = v * 2.0 - 1.0;
        setupUniform(program[0]);
    }));
}());
