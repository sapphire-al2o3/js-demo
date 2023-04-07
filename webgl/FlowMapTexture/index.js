(function () {
    'use strict';

    let gl = initContext('canvas', { preserveDrawingBuffer : true });

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
    let scale = 2;

    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(program[0], 'position');
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

    function render(delta) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.flush();
    }

    let timer = setAnimationFrame(render, 1000 / 30);

    gl.canvas.addEventListener('click', () => {
        timer.toggle();
    });

    const sliderX = createSlider('offset x', 1 / 4, v => {
        offset[0] = v * 4 / img.width;
        setupUniform(program[0]);
        labelX.textContent = `offset x [${(v * 4).toFixed(2)}]`;
    });
    const labelX = sliderX.querySelector('label');
    document.body.appendChild(sliderX);

    const sliderY = createSlider('offset y', 1 / 4, (v, id) => {
        offset[1] = v * 4 / img.height;
        setupUniform(program[0]);
        labelY.textContent = `offset y [${(v * 4).toFixed(2)}]`;
    });
    const labelY = sliderY.querySelector('label');
    document.body.appendChild(sliderY);

    document.body.appendChild(createSlider('scale', scale / 8, v => {
        scale = v * 8.0;
        program[0].uniform['scale'].value = scale;
        setupUniform(program[0]);
    }));
    img.addEventListener('drop', e => {
        e.preventDefault();
        loadFile(e);
    }, false);
      
    img.addEventListener('dragover', e => {
        e.preventDefault();
    }, false);
      
    function loadFile(e) {
        let file = e.dataTransfer.files[0],
            reader = new FileReader();
        reader.onload = e => {
            img.src = reader.result;
            img.onload = () => {
                if (img.width != canvas.width || img.height != canvas.height) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    gl.viewportWidth = canvas.width;
                    gl.viewportHeight = canvas.height;
                    gl.viewport(0, 0, canvas.width, canvas.height);
                }
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            };
        };
        reader.readAsDataURL(file);
    }
}());
