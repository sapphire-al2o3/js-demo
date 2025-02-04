'use strict';

window.onload = () => {

    const gl = initContext2('canvas');

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const program = [];
    const count = 1;
    let layer = 16;

    // シェーダを初期化
    program.push(initShader(gl, 'shader-vs', 'shader-fs'));

    gl.activeTexture(gl.TEXTURE0);
    const fur_img = document.getElementById('fur_tex');
    const fur_tex = initTexture(gl, fur_img);
    program[0].uniform['tex'].value = 0;
    gl.bindTexture(gl.TEXTURE_2D, fur_tex);

    gl.activeTexture(gl.TEXTURE1);
    const img = document.getElementById('tex');
    const tex = initTexture(gl, img);
    program[0].uniform['tex'].value = 1;
    gl.bindTexture(gl.TEXTURE_2D, tex);

    const div = 32;
    let model = createSphere(div);

    const uv = [];
    for (let i = 0; i <= div; i++) {
        let ph = i / div;
        for (let j = 0; j <= div; j++) {
            let th = j / div;
            uv.push(th);
            uv.push(1 - ph);
        }
    }
    model.meshes[0].vertexStream.uv = uv;

    const trans = [];

    for (let i = 0; i < count; i++) {
        let t = i * Math.PI * 32 / count;
        trans.push(Math.sin(t) * i * 0.002);
        trans.push(0);
        trans.push(Math.cos(t) * i * 0.002);
    }

    model.meshes[0].vertexStream.trans = trans;

    // 頂点バッファを作成
    initBuffer(gl, model);

    gl.vertexAttribDivisor(0, 0);
    gl.vertexAttribDivisor(1, 0);
    gl.vertexAttribDivisor(2, 1);

    let camera = {},
        matrix = {};
    camera.position = new Vector3(0, 3.0, 3.0);
    camera.target = new Vector3(0, 0.3, 0);
    camera.up = new Vector3(0, 1, 0);
    matrix.mMatrix = new Matrix4();
    matrix.nMatrix = new Matrix3();
    matrix.vMatrix = new Matrix4();
    matrix.mvMatrix = new Matrix4();
    matrix.pMatrix = new Matrix4();

    let light = [0.4, 0.7, 1.0];

    // カメラの行列設定
    Matrix4.perspective(45.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
    Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);

    function drawMesh(program, mesh) {
        var gl = program.context;
        gl.useProgram(program);
        setupUniform(program);
        setupAttribute(program, mesh.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
        gl.drawElementsInstanced(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0, count);
    }

    function clamp(x, min, max) {
        return x < min ? min : x > max ? max : x;
    }

    let frame = 0,
        time = 0;

    let furDir = -0.2;
    let furLength = 0.2;
    let furThr = 0.6;
    let furShade = 0.6;
    let alpha = 1;

    function render(delta) {
        time += delta;
        // light[0] = Math.cos(time * 0.001);
        // light[2] = Math.sin(time * 0.001);
        Matrix4.rotateXYZ(frame * 0.0, frame * 0.01, frame * 0.0, matrix.mMatrix);
        // Matrix4.identity(matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();

        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.cullFace(gl.BACK);
        program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
        program[0].uniform['nMatrix'].value = matrix.nMatrix.data;
        program[0].uniform['light'].value = light;
        
        program[0].uniform['furFactor'].value = [0, furThr, furShade, 1];
        program[0].uniform['texTR'].value = [2, 2];
        program[0].uniform['furDir'].value = [0, furDir, 0];

        gl.disable(gl.BLEND);
        drawMesh(program[0], model.meshes[0]);

        if (alpha < 1) {
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }

        for (let i = 1; i <= layer; i++) {
            let t = i / layer;
            let a = 1;
            if (t > alpha) {
                a = 1 - (i / (layer + 1) - alpha) / (1 - alpha);
            }
            program[0].uniform['furFactor'].value = [t * furLength, furThr, furShade, a];
            
            drawMesh(program[0], model.meshes[0]);
        }

        gl.flush();

        frame++;
    }

    let timer = setAnimationFrame(render, 1000 / 30);

    gl.canvas.addEventListener('click', () => {
        timer.toggle();
    });

    document.body.appendChild(createSlider('layer count', layer / 32, v => {
        layer = v * 32 ^ 0;
    }), false);

    document.body.appendChild(createSlider('fur length', 0.2, v => {
        furLength = v;
    }), false);

    document.body.appendChild(createSlider('fur direction', 0.2, v => {
        furDir = v * -1.0;
    }), false);

    document.body.appendChild(createSlider('fur shade', 0.6, v => {
        furShade = v;
    }), false);

    document.body.appendChild(createSlider('fur thr', 0.6, v => {
        furThr = v;
    }), false);

    document.body.appendChild(createSlider('fur alpha', 1, v => {
        alpha = v;
    }), false);
};