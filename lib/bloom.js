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

