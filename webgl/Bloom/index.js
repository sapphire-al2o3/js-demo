(function(global) {
    'use strict';

    var fullScreenVS =
        "attribute vec2 position;" +
        "varying vec2 uv;" +
        "void main(){" +
        "uv=position.xy*0.5+0.5;" +
        "gl_Position=vec4(position.xy,0.0,1.0);}";

    var downFilterFS =
        "precision mediump float;" +
        "varying vec2 uv;" +
        "uniform sampler2D tex;" +
        "uniform vec2 offset;" +
        "void main(){" +
        "vec4 color=texture2D(tex,uv+vec2(offset));" +
        "color+=texture2D(tex,uv+vec2(offset.x,-offset.y));" +
        "color+=texture2D(tex,uv+vec2(-offset.x,offset.y));" +
        "color+=texture2D(tex,uv+vec2(-offset));" +
        "color*=0.25;" +
        "float l=dot(color.rgb,vec3(0.2126,0.7152,0.0722));" +
        "gl_FragColor=vec4(color.rgb*(l-0.25),1.0);}";

    var blurFS =
        "precision mediump float;" +
        "varying vec2 uv;" +
        "uniform sampler2D tex;" +
        "uniform vec2 offset;" +
        "void main() {" +
        "vec2 s = uv - offset * 5.0;" +
        "vec4 c = texture2D(tex, s);" +
        "s += offset;" +
        "c += texture2D(tex, s);" +
        "s += offset;" +
        "c += 2.0 * texture2D(tex, s);" +
        "s += offset;" +
        "c += 2.0 * texture2D(tex, s);" +
        "s += offset;" +
        "c += 3.0 * texture2D(tex, s);" +
        "s += offset;" +
        "c += 3.0 * texture2D(tex, s);" +
        "s += offset;" +
        "c += 2.0 * texture2D(tex, s);" +
        "s += offset;" +
        "c += 2.0 * texture2D(tex, s);" +
        "s += offset;" +
        "c += texture2D(tex, s);" +
        "s += offset;" +
        "c += texture2D(tex, s);" +
        "gl_FragColor = c / 21.0;}";

    var combineFS =
        "precision mediump float;" +
        "varying vec2 uv;" +
        "uniform sampler2D original;" +
        "uniform sampler2D blurred;" +
        "uniform float glow;" +
        "void main(){" +
        "vec4 c=1.0 * texture2D(original, uv)+glow*texture2D(blurred,uv);" +
        "gl_FragColor = c;}";

    var gl,
        buffer = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);

    function createTexture(width, height) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }

    function createFBO(gl, width, height) {
        var frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        
        // color
        var texture = createTexture(width, height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        // depth
        var renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        return {
            fbo: frameBuffer,
            tex: texture,
            width: width,
            height: height
        };
    }

    function getShader(src, kind) {
        var s = gl.createShader(kind);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
    }

    function createShader(fs, vs) {
        var p = gl.createProgram();
        gl.attachShader(p, getShader(vs, gl.VERTEX_SHADER));
        gl.attachShader(p, getShader(fs, gl.FRAGMENT_SHADER));
        gl.linkProgram(p);
        return p;
    }

    function Bloom(context) {
        gl = context;
        this.width = gl.drawingBufferWidth;
        this.height = gl.drawingBufferHeight;
        this.quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        this.screen = createTexture(this.width, this.height);
        this.down = createFBO(gl, this.width / 4, this.height / 4);
        this.blur = createFBO(gl, this.width / 4, this.height / 4);
        
        var program = [];
        program.push(createShader(downFilterFS, fullScreenVS));
        program.push(createShader(blurFS, fullScreenVS));
        program.push(createShader(combineFS, fullScreenVS));
        this.program = program;
        
        var location = [];
        location.push(gl.getUniformLocation(program[0], 'offset'));
        location.push(gl.getUniformLocation(program[0], 'tex'));
        location.push(gl.getUniformLocation(program[1], 'offset'));
        location.push(gl.getUniformLocation(program[1], 'tex'));
        location.push(gl.getUniformLocation(program[2], 'original'));
        location.push(gl.getUniformLocation(program[2], 'blurred'));
        location.push(gl.getUniformLocation(program[2], 'glow'));
        
        this.location = location;
    }

    Bloom.prototype.draw = function(g) {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        
        // テクスチャにコピー
        gl.bindTexture(gl.TEXTURE_2D, this.screen);
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this.width, this.height, 0);

        // バッファを縮小
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.down.fbo);
        gl.viewport(0, 0, this.width / 4, this.height / 4);

        gl.useProgram(this.program[0]);
        gl.uniform2f(this.location[0], 1 / this.width, 1 / this.height);
        gl.uniform1i(this.location[1], 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.screen);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        // ガウスぼかし
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.blur.fbo);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.down.tex);

        gl.useProgram(this.program[1]);
        gl.uniform2f(this.location[2], 4 / this.width, 0);
        gl.uniform1i(this.location[3], 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.down.fbo);
        gl.bindTexture(gl.TEXTURE_2D, this.blur.tex);
        gl.uniform2f(this.location[2], 0, 4 / this.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // 合成
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.width, this.height);
        gl.useProgram(this.program[2]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.screen);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.down.tex);
        gl.uniform1i(this.location[4], 0);
        gl.uniform1i(this.location[5], 1);
        gl.uniform1f(this.location[6], g);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(null);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
    };

    global.Bloom = Bloom;
})(this);


(function() {
    'use strict';

    var gl = initContext('bloom-canvas');

    if(!gl) return;

    var width = 256,
        height = 256;

    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);

    var bloom = true,
        glow = 5.0,
        update = true;

    var check = createCheckbox('bloom', function(v) {
        bloom = v;
    });
    document.body.appendChild(check);
    document.getElementById('bloom').checked = true;

    var slider = createSlider('glow', 5 / 20, function(v) {
        glow = v * 20;
    });
    document.body.appendChild(slider);

    gl.canvas.addEventListener('click', () => {
        update = !update;
    }, false);

    var b = new Bloom(gl);

    var model = createTorus(32, 32);

    var program = initShader(gl, 'shader-fs', 'shader-vs');
    initBuffer(gl, model);


    var camera = {},
        matrix = {},
        light = {},
        material = {};

    camera.position = new Vector3(0, 5.0, 14.0);
    camera.target = new Vector3(0, 0.3, 0);
    camera.up = new Vector3(0, 1, 0);
    matrix.mMatrix = new Matrix4();
    matrix.nMatrix = new Matrix3();
    matrix.vMatrix = new Matrix4();
    matrix.mvMatrix = new Matrix4();
    matrix.pMatrix = new Matrix4();
    material.diffuse = new Float32Array([0.9, 0.4, 0.0, 1.0]);
    material.specular = new Float32Array([0.8, 0.8, 0.8, 1.0]);
    material.ambient = new Float32Array([0.05, 0.05, 0.05, 1.0]);
    material.emission = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    light.position = new Vector3(0.0, 4.0, 1.0);
    light.direction = [0.0, 1.0, 0.0];
    light.intensity = new Float32Array([0.5]);

    var frame = 0;

    Matrix4.perspective(45.0 * Math.PI / 180.0, width / height, 0.1, 1000.0, matrix.pMatrix);
    Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);
    Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02, matrix.mMatrix);
    matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
    matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();

    function render() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        if(update) {
            frame++;
        }
        Matrix4.rotateXYZ(frame * 0.02, 0.0, frame * 0.02, matrix.mMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        matrix.nMatrix = matrix.mvMatrix.toMatrix3().transpose().inverse();
        
        program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program.uniform['pMatrix'].value = matrix.pMatrix.data;
        program.uniform['nMatrix'].value = matrix.nMatrix.data;
        program.uniform['diffuse'].value = material.diffuse;
        //program.uniform['ambient'].value = material.ambient;
        program.uniform['specular'].value = material.specular;
        program.uniform['uLightDirection'].value = light.direction;
        program.uniform['power'].value = 50.0;
        
        var mesh = model.meshes[0];
        
        gl.useProgram(program);
        setupUniform(program);
        setupAttribute(program, mesh.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
        gl.drawElements(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
        
        if(bloom) {
            b.draw(glow);
        }
        
        gl.flush();
    }

    setAnimationFrame(render, 0);
//	render();
})();



