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

    let offset = [0, 0];
    let scale = 1;

    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

    var loc = gl.getAttribLocation(program[0], 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program[0]);

    
    gl.activeTexture(gl.TEXTURE0);
    const img = document.getElementById('tex');
    const tex = initTexture(gl, img);

    program[0].uniform['tex'].value = 0;

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    offset[0] = 1.0 / img.width;
    offset[1] = 1.0 / img.height;

    program[0].uniform['offset'].value = offset;
    program[0].uniform['scale'].value = scale;

    setupUniform(program[0]);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

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

    document.body.appendChild(createSlider('offset x', 1 / 4, v => {
        offset[0] = v * 4 / img.width;
        setupUniform(program[0]);
    }));
    document.body.appendChild(createSlider('offset y', 1 / 4, v => {
        offset[1] = v * 4 / img.height;
        setupUniform(program[0]);
    }));
    document.body.appendChild(createSlider('scale', 1 / 8, v => {
        scale = v * 8.0;
        program[0].uniform['scale'].value = scale;
        setupUniform(program[0]);
    }));
}());
