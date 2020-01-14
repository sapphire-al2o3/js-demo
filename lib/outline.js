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
        uniform vec2 screen;
        uniform vec2 offset;
        void main(){
        vec2 o=screen.xy*offset;
        vec4 c=texture2D(tex,uv);
        float e=max(texture2D(tex,uv+vec2(o.x,0.0)).a-c.a,0.0);
        e+=max(texture2D(tex,uv+vec2(-o.x,0.0)).a-c.a,0.0);
        e+=max(texture2D(tex,uv+vec2(0.0,o.y)).a-c.a,0.0);
        e+=max(texture2D(tex,uv+vec2(0.0,-o.y)).a-c.a,0.0);
        vec3 rgb=c.rgb*vec3(1.0,.2,.1)*(1.0-e);
        gl_FragColor=vec4(rgb,1.0);}`;

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

        // stencil
        // let stencil = createTexture(width, height);
        // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, stencil, 0);
        // gl.bindTexture(gl.TEXTURE_2D, null);

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

    function Outline(context) {
        gl = context;
        this.width = gl.drawingBufferWidth;
        this.height = gl.drawingBufferHeight;
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
        location.push(gl.getUniformLocation(program[0], 'screen'));
        location.push(gl.getUniformLocation(program[0], 'offset'));
        
        this.location = location;
    }

    Outline.prototype.setup = function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.down.fbo);
        gl.viewport(0, 0, this.width, this.height);
        return this.down;
    };

    Outline.prototype.draw = function(lineWidth, fb) {
        fb = fb || this.down;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        
        // テクスチャにコピー
        gl.bindTexture(gl.TEXTURE_2D, this.screen);
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this.width, this.height, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fb.fbo);
        gl.viewport(0, 0, this.width, this.height);
        gl.useProgram(this.program[0]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.screen);
        gl.uniform1i(this.location[0], 0);
        gl.uniform2f(this.location[1], 1 / this.width, 1 / this.height);
        gl.uniform2f(this.location[2], lineWidth, lineWidth);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(null);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
    };

    global.Outline = Outline;
})(this);

