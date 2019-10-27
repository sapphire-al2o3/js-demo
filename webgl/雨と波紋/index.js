(function() {
	'use strict';
	
	var canvas = document.getElementById('canvas');
    
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    
    var gl = initContext('canvas', {preserveDrawingBuffer: true});
	
	var max = 6000,
		count = 6000,
		speed = 0.8;
	
	var program = [
		initShader(gl, 'shader-fs', 'shader-vs'),
		initShader(gl, 'rain-fs', 'rain-vs')
	];
	
	var model = createRandom(max);
	
	var camera = {},
		matrix = {};
	
	camera.position = new Vector3(0, 2.0, 2.0);
	camera.target = new Vector3(0, 0, 0);
	camera.up = new Vector3(0, 1, 0);
	matrix.mMatrix = new Matrix4();
	matrix.nMatrix = new Matrix4();
	matrix.vMatrix = new Matrix4();
	matrix.mvMatrix = new Matrix4();
	matrix.pMatrix = new Matrix4();
	
	initBuffer(gl, model);
	
	gl.enable(gl.BLEND);
	gl.blendEquation(gl.FUNC_ADD);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	gl.depthFunc(gl.ALWAYS);
	
	var frame = 0;
	
	var timer = setAnimationFrame(function() {
		frame++;
		render(model);
	}, 1000 / 30);
	
	gl.canvas.addEventListener('click', timer.toggle.bind(timer));
	
	Matrix4.perspective(45.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
	program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
	program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
	program[1].uniform['mvMatrix'].value = matrix.mvMatrix.data;
	program[1].uniform['pMatrix'].value = matrix.pMatrix.data;
	
	var position = new Vector3(0, 0, 0);
	position.y = camera.position.y;
	
	// 描画
	function render(model) {
		gl.clearColor(0.4, 0.7, 0.9, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		// 行列設定
		Matrix4.rotateY(0.1 * frame, matrix.mMatrix);
		position.x = Math.cos(0.007 * frame) * 2.0;
		position.y = 2.0 + Math.cos(0.01 * frame);
		position.z = Math.sin(0.007 * frame) * 2.0;
		Matrix4.lookAt(position, camera.target, camera.up, matrix.mvMatrix);
		
		program[0].uniform['time'].value = frame * speed * 0.1;
		program[1].uniform['time'].value = frame * speed * 0.1;
		
		gl.useProgram(program[1]);
		setupUniform(program[1]);
		setupAttribute(program[1], model.meshes[1].vbo);
		gl.drawArrays(gl.LINES, 0, count / 3);
		
		gl.useProgram(program[0]);
		setupUniform(program[0]);
		setupAttribute(program[0], model.meshes[0].vbo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.meshes[0].ibo);
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
		
		gl.flush();
	}
	
	function createRandom(n) {
		var p = [],
			c = [],
			offset = [],
			v = [],
			i = [],
			uv = [],
			size = [],
			l = [];
		var j = 0;
		for(; n >= 0; n--) {
			var s = Math.random() * 2.0 * Math.PI,
				r = Math.random() * 1.0,
				x = Math.random() * 6.0 - 3.0,//r * Math.cos(s),
				z = Math.random() * 6.0 - 3.0,//r * Math.sin(s),
				a = (Math.random() * 3.0 + 0.1) * 1.5,
				o0 = Math.random(),
				o1 = Math.random() + 1.0,
				w = 0.06;
			p.push(
				x - w, 0, z - w,
				x - w, 0, z + w,
				x + w, 0, z + w,
				x + w, 0, z - w
			);
			l.push(x, 0, z, x, 1.0, z);
			c.push(
				1.0, 1.0, 1.0, 0.5,
				1.0, 1.0, 1.0, 0.5,
				1.0, 1.0, 1.0, 0.5,
				1.0, 1.0, 1.0, 0.5
			);
			offset.push(o0, o1, o0, o1, o0, o1, o0, o1);
			uv.push(
				-1, -1,
				-1, 1,
				1, 1,
				1, -1
			);
			i.push(j, j + 1, j + 2, j, j + 2, j + 3);
			j += 4;
		}
		
		return {
			meshes: [
				{
					vertexStream: {
						position: p,
						color: c,
						offset: offset,
						uv: uv
					},
					indexStream: i
				}, {
					vertexStream: {
						position: l,
						color: c,
						offset: offset
					}
				}

			],
			materials: []
		};
	}
	
})();