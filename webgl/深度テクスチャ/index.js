(function(global) {
    'use strict';
    
    var fullScreenVS =
        "attribute vec2 position;" +
        "varying vec2 uv;" +
        "void main(){" +
        "uv=position.xy*0.5+0.5;" +
        "gl_Position=vec4(position.xy,0.0,1.0);}";
    
    var outlineFS =
        "precision mediump float;" +
        "varying vec2 uv;" +
        "uniform sampler2D tex;" +
        "uniform vec2 offset;" +
        "void main(){" +
//		"vec4 c=vec4(1.0/(offset.x*texture2D(tex,uv).r)+offset.y);" +
        "vec4 c=vec4((texture2D(tex,uv).r));" +
        "gl_FragColor=vec4(c.rgb,1.0);}";
    
    var gl,
        ext,
        buffer = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);
    
    // depth texture を作る
    function createDepthTexture(width, height) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    
    function createFBO(gl, width, height) {
        var frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        
        // color
        var renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderBuffer);
        
        // depth
        var depthTexture = createDepthTexture(width, height);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        return {
            fbo: frameBuffer,
            depthTex: depthTexture,
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
    
    function Depth(context) {
        gl = context;
        
        // 拡張機能が有効化確認
        ext = gl.getExtension('WEBGL_depth_texture');
        console.log(ext);
        this.width = gl.drawingBufferWidth;
        this.height = gl.drawingBufferHeight;
        this.quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        this.framebuffer = createFBO(gl, this.width, this.height);
        
        var program = [];
        program.push(createShader(outlineFS, fullScreenVS));
        this.program = program;
        
        var location = [];
        location.push(gl.getUniformLocation(program[0], 'tex'));
        location.push(gl.getUniformLocation(program[0], 'offset'));
        this.location = location;
        
        getError(gl);
    }
    
    // フレームバッファを切り替える
    Depth.prototype.preDraw = function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer.fbo);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    
    // 深度テクスチャを表示する
    Depth.prototype.draw = function(near, far) {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        
        gl.disable(gl.DEPTH_TEST);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.width, this.height);
        gl.useProgram(this.program[0]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.depthTex);
        gl.uniform1i(this.location[0], 0);
        gl.uniform2f(this.location[1], 1.0 - far / near, far / near);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.useProgram(null);
        gl.enable(gl.DEPTH_TEST);
    };
    
    global.Depth = Depth;
})(this);



(function() {
    'use strict';
    
    var gl = initContext('canvas'),
        width = gl.canvas.width,
        height = gl.canvas.height;
    
    var program = initShader(gl, 'shader-fs', 'shader-vs');
    
    var model = cube(200, 0.2),
        m2 = cube(300, 0.8),
        plane = createPlane(100, 10);
    
    initBuffer(gl, model);
    initBuffer(gl, m2);
    initBuffer(gl, plane);
    
    var camera = {},
        matrix = {};
    
    camera.position = new Vector3(0, 0.0, 20.0);
    camera.target = new Vector3(0, 0, 0);
    camera.up = new Vector3(0, 1, 0);
    matrix.mMatrix = new Matrix4();
    matrix.vMatrix = new Matrix4();
    matrix.mvMatrix = new Matrix4();
    matrix.pMatrix = new Matrix4();
    
    var near = 1,
        far = 100.0;
    
    Matrix4.perspective(60.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, near, far, matrix.pMatrix);
    Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.mvMatrix);

    program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
    program.uniform['pMatrix'].value = matrix.pMatrix.data;

    var isDepth = true;
    var check = createCheckbox('depth', function(v) {
        isDepth = v;
        render();
    });
    document.body.appendChild(check);
    document.getElementById('depth').checked = true;
    
    var f = 0;
    
    var depth = new Depth(gl);
    
    function render(deltaTime) {
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, width, height);
        
        camera.position.x = Math.cos(f * 0.02) * 10;
        camera.position.y = Math.cos(f * 0.005) * 15;
        camera.position.z = Math.sin(f * 0.02) * 20;
        
        Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.mvMatrix);
        program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
        
        if(isDepth) depth.preDraw();
        
        program.uniform['color'].value = [0, 0, 0, 1];
        
        gl.enable(gl.DEPTH_TEST);
        drawMesh(program, m2.meshes[0])
        
        if(isDepth)
            depth.draw(near, far);
        
        gl.flush();
        if(deltaTime > 0) {
            f++;
        }
    }
    
    render();
    getError(gl);
    var timer = setAnimationFrame(render, 0);
    gl.canvas.addEventListener('click', function(e) {
        timer.toggle();
    });
    
    function rand() {
        return Math.random() * 2.0 - 1.0;
    }
    
    function createPlane(x, z) {
        var idx = [0, 1, 2, 0, 2, 3],
            vtx = [
                x, 0, -z,
                -x, 0, -z,
                -x, 0, z,
                x, 0, z
            ];
        return { meshes: [{
            indexStream: idx,
            vertexStream: {
                position: vtx
            }
        }]};
    }
    
    function cube(n, s) {
        var vtx = [],
            idx = [],
            r = 8;
        for(var i = 0; i < n; i++) {
            var x = rand(),
                y = rand(),
                z = rand(),
                l = 1;//Math.sqrt(x * x + y * y + z * z);
            x = x * r / l;
            y = y * r / l;
            z = z * r / l;
            [
                0, 1, 2, 0, 2, 3,
                4, 6, 5, 4, 7, 6,
                0, 4, 5, 0, 5, 1,
                1, 5, 6, 1, 6, 2,
                2, 6, 7, 2, 7, 3,
                3, 7, 4, 3, 4, 0
            ].forEach(function(e) {
                idx.push(e + i * 8);
            });
            var p = [
                -s, s, -s,
                -s, s,  s,
                 s, s,  s,
                 s, s, -s,

                -s, -s, -s,
                -s, -s,  s,
                 s, -s,  s,
                 s, -s, -s,
            ];
            for(var j = 0; j < p.length; j += 3) {
                vtx.push(
                    p[j + 0] + x,
                    p[j + 1] + y,
                    p[j + 2] + z
                );
            }
        }
        return { meshes: [{
            indexStream: idx,
            vertexStream: {
                position: vtx
            }
        }]};
    }
 
    function drawMesh(program, mesh) {
        var gl = program.context;
        gl.useProgram(program);
        setupUniform(program);
        setupAttribute(program, mesh.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
        gl.drawElements(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
    }
})();
