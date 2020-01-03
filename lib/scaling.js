(function(global) {
    'use strict';

    const fullScreenVS =`
        attribute vec2 position;
        varying vec2 uv;
        void main(){
        uv=position.xy*0.5+0.5;
        gl_Position=vec4(position.xy,0.0,1.0);}`;

    const fullScreenFS =`
        precision mediump float;
        varying vec2 uv;
        uniform sampler2D tex;
        void main(){
        gl_FragColor=texture2D(tex, uv);}`;

    let gl,
        buffer = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);

    function createTexture(width, height) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
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

    function Scaling(context, scale) {
        gl = context;
        this.width = gl.drawingBufferWidth / scale;
        this.height = gl.drawingBufferHeight / scale;
        this.scale = scale;
        this.quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        this.screen = createTexture(this.width, this.height);
        this.down = createFBO(gl, this.width, this.height);

        var program = [];
        program.push(createShader(fullScreenFS, fullScreenVS));
        this.program = program;
        
        var location = [];
        location.push(gl.getUniformLocation(program[0], 'tex'));
        
        this.location = location;
    }

    Scaling.prototype.setup = function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.down.fbo);
        gl.viewport(0, 0, this.width, this.height);
        return this.down;
    };

    Scaling.prototype.draw = function() {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        
        // // テクスチャにコピー
        // gl.bindTexture(gl.TEXTURE_2D, this.screen);
        // gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this.width, this.height, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.width * this.scale, this.height * this.scale);
        gl.useProgram(this.program[0]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.down.tex);
        gl.uniform1i(this.location[0], 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(null);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
    };

    global.Scaling = Scaling;
})(this);

