// forked from sapphire_al2o3's "WebGLでリサージュ曲線" http://jsdo.it/sapphire_al2o3/1XOS
(function() {
    'use strict';
    
    function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return [[v,p,m,m,q,v][i],[q,v,v,p,m,m][i],[m,m,q,v,v,p][i],a];}		

    var canvas = document.getElementById('canvas'),
        gl = initContext('canvas', {preserveDrawingBuffer: true}),
        program = initShader(gl, 'shader-fs', 'shader-vs'),
        fill = initShader(gl, 'shader-fs-fill', 'shader-vs-fill');
    
    var camera = {},
        matrix = {};

    camera.position = new Vector3(0, 0.0, 2.0);
    camera.target = new Vector3(0, 0.0, 0);
    camera.up = new Vector3(0, 1, 0);
    
    camera.fovy = 45.0 * Math.PI / 180.0;
    camera.aspect = gl.canvas.width / gl.canvas.height;
    camera.near = 0.1;
    camera.far = 1000.0;
    
    camera.lookAt = function(matrix) {
        Matrix4.lookAt(this.position, this.target, this.up, matrix);
    };
    
    camera.perspective = function(matrix) {
        Matrix4.perspective(this.fovy, this.aspect, this.near, this.far, matrix);
    }
    
    matrix.mMatrix = new Matrix4();
    matrix.vMatrix = new Matrix4();
    matrix.mvMatrix = new Matrix4();
    matrix.pMatrix = new Matrix4();
    
    camera.perspective(matrix.pMatrix);
    camera.lookAt(matrix.vMatrix);
    Matrix4.identity(matrix.mMatrix);
    matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
    
    // バッファの生成
    
    var size = 44,
        positions = new Float32Array(size),
        colors = new Float32Array(size * 3);
    
    for(var i = 0; i < size; i++) {
        positions[i] = i * 2.0 * Math.PI / size;
        var c = hsva(i / size * 360 ^ 0, 0.6, 1.0, 1.0);
        colors[i * 3] = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
    }

    var vbo = {};
    vbo.r = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.r);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    vbo.c = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.c);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    var plane = {
        position: [
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0
        ],
        vbo: {}
    };
    
    plane.vbo.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, plane.vbo.position);
    var buffer = new Float32Array(plane.position);
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    
    var clearColor = new Float32Array([0.0, 0.0, 0.0, 0.1]);
    
    gl.enable(gl.BLEND);
    // デプステストを常にパスするようにする
    gl.depthFunc(gl.ALWAYS);

    // アルファブレンド
    function setAlphaBlend(gl) {
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    // 加算合成
    function setAdditionBlend(gl) {
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    }

    var frame = 0,
        speed = 0.002,
        a = 8.0,
        b = 9.0;
    
    // 描画
    function render(model) {
        // 塗りつぶし
        fill.uniform['color'].value = clearColor;
        gl.useProgram(fill);
        setupUniform(fill);
        //gl.disableVertexAttribArray(1);
        setupAttribute(fill, plane.vbo);
        
		setAlphaBlend(gl);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        // 点の描画
        program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program.uniform['pMatrix'].value = matrix.pMatrix.data;
        program.uniform['time'].value = frame * speed;
        program.uniform['a'].value = a;
        program.uniform['b'].value = b;
        program.uniform['radius'].value = 0.6;
        
        gl.useProgram(program);
        setupUniform(program);
        setupAttribute(program, vbo);
        setAdditionBlend(gl);
        gl.drawArrays(gl.POINTS, 0, positions.length);
        gl.flush();
        
        frame++;
    }

    setInterval(function() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        a = Math.random() * 20 + 1 ^ 0;
        b = Math.random() * 20 + 1 ^ 0;
    }, 5000);

    setInterval(render, 1000 / 30);
})();
