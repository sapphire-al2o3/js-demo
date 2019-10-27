(function() {
	'use strict';
	
	var canvas = document.getElementById('canvas'),
        gl = initContext('canvas', {preserveDrawingBuffer: true,}),
        label = document.getElementById('particle'),
        max = 60000,
		count = 6000,
		speed = 0.2;
	
	document.body.appendChild(createSlider('Particle Count', count / max, function(v, id) {
		count = v * max ^ 0;
		label.textContent = count + ' particle';
	}));
	
	document.body.appendChild(createSlider('Speed', speed, function(v, id) {
		speed = v;
	}));
	
	var program = initShader(gl, 'shader-fs', 'shader-vs'),
        fill = initShader(gl, 'shader-fs-fill', 'shader-vs-fill'),
        model = createRandomSphere(max),
        camera = {},
        matrix = {},
        clearColor = new Float32Array([0.0, 0.0, 0.0, 0.3]);
	
	camera.position = new Vector3(0, 1.0, 2.0);
	camera.target = new Vector3(0, 0.1, 0);
	camera.up = new Vector3(0, 1, 0);
	matrix.mMatrix = new Matrix4();
	matrix.vMatrix = new Matrix4();
	matrix.mvMatrix = new Matrix4();
	matrix.pMatrix = new Matrix4();
	
    // 行列設定
    Matrix4.identity(matrix.mMatrix);
    Matrix4.perspective(45.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
    Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);
    matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
    
	initBuffer(gl, model);
	
	// 加算合成
	gl.enable(gl.BLEND);
	gl.blendEquation(gl.FUNC_ADD);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    
    gl.depthFunc(gl.ALWAYS);
	
	var frame = 0;
	
	setInterval(function() {
		frame++;
		render(model);
	}, 1000 / 30);
    
	// 描画
	function render(model) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
        fill.uniform['color'].value = clearColor;
        gl.useProgram(fill);
        setupUniform(fill);
        setupAttribute(fill, model.meshes[1].vbo);
        
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
		program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
		program.uniform['pMatrix'].value = matrix.pMatrix.data;
		program.uniform['time'].value = frame * speed * 0.1;
		
        gl.useProgram(program);
        
		setupUniform(program);
		
		setupAttribute(program, model.meshes[0].vbo);
		
	    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        
		gl.drawArrays(gl.POINTS, 0, count);
        
		gl.flush();
	}
	
    // 球面上にランダムに頂点を配置する
	function createRandomSphere(n) {
		var p = [],
			c = [],
			o = [],
			v = [],
            radius = [],
			size = [];
		
		for(; n >= 0; n--) {
			var s = Math.random() * 2.0 * Math.PI,
				y = Math.random() * 2.0 - 1.0,
				r = Math.sqrt(1.0 - y * y),
				x = r * Math.cos(s),
				z = r * Math.sin(s);
			p.push(x, y, z);
			c.push(0.3, 0.6, 1.0,  (Math.random() * 3.0 + 0.1) * 1.5 / 4.5);
			o.push(s);
			v.push(Math.random() + 0.1);
            radius.push(r),
			size.push(Math.random() * 3.0);
		}
		
		return {
			meshes: [
				{
					vertexStream: {
						position: p,
						color: c,
						o: o,
						v: v,
                        r: radius,
						size: size
					}
				},
                {
                    vertexStream: {
                        position: [
                             1.0, -1.0, 1.0,
                             1.0,  1.0, 1.0,
                            -1.0, -1.0, 1.0,
                            -1.0,  1.0, 1.0
                        ]
                    }
                }
			]
		};
	}
	
})();