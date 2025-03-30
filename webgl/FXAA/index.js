(function() {
    'use strict';

    let gl = initContext('canvas', {antialias: true}),
        width = gl.canvas.width,
        height = gl.canvas.height;

    let program = initShader(gl, 'shader-fs', 'shader-vs'),
        fxaa = initShader(gl, 'fxaa-fs', 'fxaa-vs'),
        noaa = initShader(gl, 'noaa-fs', 'fxaa-vs');

    let quad = createScreen();
    initBuffer(gl, quad);

    let model = createIco();
    initBuffer(gl, model);

    let fbo = createFBO(width, height);

    let camera = {},
        matrix = {};

    camera.position = new Vector3(0, 1.0, 3.0);
    camera.target = new Vector3(0, 0.0, 0);
    camera.up = new Vector3(0, 1, 0);

    let frame = 0;

    let pm = Matrix4.perspective(45.0 * Math.PI / 180.0, width / height, 0.1, 1000.0),
        vm = Matrix4.lookAt(camera.position, camera.target, camera.up),
        mm = Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02),
        mvm = mm.mul(vm);

    program.uniform['mvMatrix'].value = mvm.data;
    program.uniform['pMatrix'].value = pm.data;
    program.uniform['color'].value = [0, 0, 0, 1];

    gl.useProgram(fxaa);
    fxaa.uniform['tex'].value = 0;
    fxaa.uniform['offset'].value = [1 / width, 1 / height];
    setupUniform(fxaa);

    gl.useProgram(noaa);
    noaa.uniform['tex'].value = 0;
    setupUniform(noaa);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.viewport(0, 0, width, height);

    let timer = setAnimationFrame(() => {
        frame++;
        render();
    }, 1000 / 30);

    gl.canvas.addEventListener('click', (e) => {
        timer.toggle();
    });

    let isFXAA = false;
    //	document.body.appendChild(createCheckbox('fxaa', (v, id) => {
    //		isFXAA = !isFXAA;
    //		render();
    //	}));

    let isFB = false;

    document.body.appendChild(createRadio(['default', 'fxaa', 'noaa'], (v, id, i) => {
        if(id === 'default') {
            isFB = false;
        }
        if(id === 'fxaa') {
            isFB = true;
            isFXAA = true;
        }
        if(id === 'noaa') {
            isFB = true;
            isFXAA = false;
        }
        render();
    }));

    function render() {
        Matrix4.rotateXYZ(0, frame * 0.02, 0, mm);
        mm.mul(vm, mvm);
        
        if(isFB) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
        }
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.useProgram(program);
        setupUniform(program);
        setupAttribute(program, model.meshes[0].vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.meshes[0].ibo);
        gl.drawElements(gl.LINES, model.meshes[0].indexStream.length, gl.UNSIGNED_SHORT, 0);
        
        if(isFB) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.disable(gl.DEPTH_TEST);
            gl.useProgram(isFXAA ? fxaa : noaa);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
            setupAttribute(isFXAA ? fxaa : noaa, quad.meshes[0].vbo);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quad.meshes[0].ibo);
            gl.drawElements(gl.TRIANGLES, quad.meshes[0].indexStream.length, gl.UNSIGNED_SHORT, 0);
            gl.enable(gl.DEPTH_TEST);
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
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        return texture;
    }

    function createFBO(width, height) {
        const frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        
        // color
        const texture = createTexture(width, height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        // depth
        const depthRenderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
       

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        return {
            fbo: frameBuffer,
            tex: texture,
            width: width,
            height: height
        };
    }

    function createIco(s = 1.0) {
        let m = {},
            a = 1 / Math.sqrt(5),
            b = (1 - a) * 0.5,
            c = (1 + a) * 0.5,
            d = Math.sqrt(b),
            e = Math.sqrt(c);
        a *= s;
        b *= s;
        c *= s;
        d *= s;
        e *= s;
        m.meshes = [{}];
        m.meshes[0].vertexStream = {};
        m.meshes[0].vertexStream.position = [
            0, s, 0,
            0, a, a * 2,
            e, a, b,
            d, a, -c,
            -d, a, -c,
            -e, a, b,
            d, -a, c,
            e, -a, -b,
            0, -a, -a * 2,
            -e, -a, -b,
            -d, -a, c,
            0, -s, 0
        ];
        m.meshes[0].indexStream = [
            0, 1, 1, 2,
            0, 2, 2, 3,
            0, 3, 3, 4,
            0, 4, 4, 5,
            0, 5, 5, 1,
            2, 6, 6, 1,
            3, 7, 7, 2,
            4, 8, 8, 3,
            5, 9, 9, 4,
            1, 10, 10, 5,
            11, 6, 6, 7,
            11, 7, 7, 8,
            11, 8, 8, 9,
            11, 9, 9, 10,
            11, 10, 10, 6
        ];
        return m;
    }
})();
