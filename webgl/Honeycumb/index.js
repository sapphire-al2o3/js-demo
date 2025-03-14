(() => {
    'use strict';

    const gl = initContext2('canvas');

    gl.viewport(0, 0, 300, 300);

    const program = [];

    // シェーダを初期化
    program.push(initShader(gl, 'shader-vs', 'shader-fs'));
    program.push(initShader(gl, 'post-vs', 'post-fs'));

    const width = gl.canvas.width;
    const height = gl.canvas.height;
    let fbo = createFBO(width, height);

    // トーラスを作る
    let model = createTorus(32, 32);

    model.meshes[0].vertexStream.position = model.meshes[0].vertexStream.position.map(x => x * 0.4);

    // 頂点バッファを作成
    initBuffer(gl, model);

    let screen = createScreen();
    initBuffer(gl, screen);

    program[1].uniform['tex'].value = 0;
    program[1].uniform['size'].value = [32, 28];

    let camera = {},
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
        time = 0,
        effect = true;

    function render(delta) {
        time += delta;
        light[0] = Math.cos(time * 0.001);
        light[2] = Math.sin(time * 0.001);
        // Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02, matrix.mMatrix);
        // Matrix4.scale(0.5, 0.5, 0.5, matrix.mMatrix);
        Matrix4.identity(matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();

        if (effect) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
        }

        gl.clearColor(1.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.cullFace(gl.BACK);
        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
        program[0].uniform['nMatrix'].value = matrix.nMatrix.data;
        program[0].uniform['light'].value = light;
        
        drawMesh(program[0], model.meshes[0]);
        
        if (effect) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.disable(gl.DEPTH_TEST);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
            gl.enable(gl.DEPTH_TEST);
            drawMesh(program[1], screen.meshes[0]);
        }

        gl.flush();
    }

    function createScreen() {
        return {
            meshes: [
                {
                    vertexStream: {
                        position: [1, 1, -1, 1, 1, -1, -1, -1]
                    },
                    indexStream: [0, 1, 2, 1, 3, 2]
                }
            ]
        };
    }

    function createTexture(width, height) {
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        return tex;
    }

    function createFBO(width, height) {
        const frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        
        const tex = createTexture(width, height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        return {
            fbo: frameBuffer,
            tex: tex,
            width: width,
            height: height
        };
    }

    let timer = setAnimationFrame(render, 1000 / 30);

    gl.canvas.addEventListener('click', () => {
        timer.toggle();
    });

    document.body.appendChild(createCheckbox('effect', v => {
        effect = v;
        render(0);
    }, true), false);
})();
