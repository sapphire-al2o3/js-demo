// ブルーム
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
		"void main(){" +
		"vec2 s=uv-offset*5.0;" +
		"vec4 c=texture2D(tex,s);" +
		"c+=texture2D(tex,s+=offset);" +
		"c+=texture2D(tex,s+=offset)*2.0;" +
		"c+=texture2D(tex,s+=offset)*2.0;" +
		"c+=texture2D(tex,s+=offset)*3.0;" +
		"c+=texture2D(tex,s+=offset)*3.0;" +
		"c+=texture2D(tex,s+=offset)*2.0;" +
		"c+=texture2D(tex,s+=offset)*2.0;" +
		"c+=texture2D(tex,s+=offset);" +
		"c+=texture2D(tex,s+=offset);" +
		"gl_FragColor=c/21.0;}";
	
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
	
	function createTexture(gl, width, height) {
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
		var texture = createTexture(gl, width, height);
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
		
		this.screen = createTexture(gl, this.width, this.height);
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
	
    var gl = initContext('canvas', {preserveDrawingBuffer: true}),
		width = gl.canvas.width,
		height = gl.canvas.height;
	
	var program = [
		initShader(gl, 'shader-fs', 'fireworks-vs'),
		initShader(gl, 'shader-fs-fill', 'shader-vs-fill'),
		initShader(gl, 'shader-fs', 'tail-vs'),
		initShader(gl, 'shader-fs', 'shader-vs')
	];
	
	var bloom = new Bloom(gl);
		
	var camera = {},
		matrix = {};
	
	camera.position = new Vector3(0, 2.0, 25.0);
//	camera.position = new Vector3(0, 0.0, 30.0);
	camera.target = new Vector3(0, 6.0, 0);
//	camera.target = new Vector3(0, 10, 0);
	camera.up = new Vector3(0, 1, 0);
	matrix.mMatrix = new Matrix4();
	matrix.nMatrix = new Matrix4();
	matrix.vMatrix = new Matrix4();
	matrix.mvMatrix = new Matrix4();
	matrix.pMatrix = new Matrix4();
	
	var fireworks = [],
		tails = [];
	
	var count = 5000;
	
	var model = createRandom(count);
	
	initBuffer(gl, model);
	
	Matrix4.perspective(45.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
	Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.mvMatrix);
	program[0].uniform['mvMatrix'].value = matrix.mvMatrix.data;
	program[0].uniform['pMatrix'].value = matrix.pMatrix.data;
	program[0].uniform['scale'].value = 48.0;
	program[0].uniform['g'].value = [0.0, -9.8 / 10, 0.0];
	
	program[2].uniform['mvMatrix'].value = matrix.mvMatrix.data;
	program[2].uniform['pMatrix'].value = matrix.pMatrix.data;
	program[2].uniform['scale'].value = 48.0;
	program[2].uniform['g'].value = [0.0, -9.8, 0.0];
	
	program[3].uniform['mvMatrix'].value = matrix.mvMatrix.data;
	program[3].uniform['pMatrix'].value = matrix.pMatrix.data;
	program[3].uniform['color'].value = [0.7, 0.7, 0.7, 1];
	
	// ブレンドを有効
	gl.enable(gl.BLEND);
	gl.depthFunc(gl.ALWAYS);
	
	var frame = 0;
	
	var clearColor = [0, 0, 0, 0.2];
	
	var colors = [
		rgba(255, 35, 120, 0.58),
		rgba(179, 255, 35, 0.58),
		rgba(255, 73, 18, 0.58),
		rgba(45, 18, 255, 0.58),
		rgba(221, 255, 23, 0.78),
		rgba(23, 166, 255, 0.78)
	];
	
	function addFireworks(x, y, z) {
		var c = colors[Math.random() * colors.length ^ 0],
			o = Math.random() * (count - 200) ^ 0;
		createFirework([x, y, z], c, o, 200);
	}
	
	function addTails() {
		var c = colors[Math.random() * colors.length ^ 0],
			x = Math.random() * 20 - 10,
			z = Math.random() * 20 - 10,
			v = 10 + Math.random() * 4;
		createTail([x, 0, z], c, [0, 12, 0]);
	}
	
	function countFireworks() {
		var count = 0;
		for(var i = 0; i < fireworks.length; i++) {
			if(fireworks[i].time <= 1.0) count++;
		}
		return count;
	}
	
	var timer = setAnimationFrame(render, 1000 / 60);
	
	gl.canvas.addEventListener('click', function() {
		timer.toggle();
	});
	
	var time = 0;
	
	function render(delta) {
		time += delta / 1000;
		
		if(frame % 6 == 0) {
			addTails();
		}
		
		tails.forEach(function(e) {
			if(e.time <= 1.0) {
				e.time += delta / 1000;
				if(e.time > 1.0) {
					var v = e.velocity[1],
						y = v * e.time - 9.8 * 0.5 * e.time * e.time;
					addFireworks(e.position[0], y, e.position[2])
				}
			}
		});
		
		fireworks.forEach(function(e) {
			e.time += delta / 1000;
		});
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, width, height);
		
		gl.clearColor(0.0, 0.05, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		camera.position.x = Math.cos(0.003 * frame) * 25.0;
		camera.position.z = Math.sin(0.003 * frame) * 25.0;
		Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.mvMatrix);
		
		// 塗りつぶし
		
		setAlphaBlend(gl);
		
		gl.useProgram(program[1]);
		program[1].uniform['color'].value = clearColor;
		setupUniform(program[1]);
		setupAttribute(program[1], model.meshes[1].vbo);
		//gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		
		// fireworks
		
		renderFireworks(delta);
		
		setNormalBlend(gl);
		bloom.draw(6);
		
		
		setAlphaBlend(gl);
		
		gl.useProgram(program[3]);
		setupUniform(program[3]);
		setupAttribute(program[3], model.meshes[3].vbo);
		gl.drawArrays(gl.LINES, 0, model.meshes[3].vertexStream.position.length / 3);
		
		gl.flush();
		
		frame++;
		
	}
	
	function renderFireworks(delta) {
		setAdditionBlend(gl);
		
		gl.useProgram(program[2]);
		setupAttribute(program[2], model.meshes[2].vbo);
		
		tails.forEach(function(e) {
			if(e.time <= 1.0) {
				program[2].uniform['time'].value = e.time;
				program[2].uniform['position'].value = e.position;
				program[2].uniform['color'].value = [1, 1, 1, 1];
				program[2].uniform['velocity'].value = e.velocity;

				setupUniform(program[2]);
				gl.drawArrays(gl.POINTS, 0, model.meshes[2].vertexStream.o.length);
			}
		});
		
		gl.useProgram(program[0]);
		setupAttribute(program[0], model.meshes[0].vbo);
		
		fireworks.forEach(function(e) {
			if(e.time <= 1) {
				program[0].uniform['time'].value = e.time;
				program[0].uniform['speed'].value = e.speed;
				program[0].uniform['position'].value = e.position;
				program[0].uniform['color'].value = e.color;
				setupUniform(program[0]);
				gl.drawArrays(gl.POINTS, e.offset, e.size);
			}
		});
	}
	
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
	
	function setNormalBlend(gl) {
		gl.blendEquation(gl.FUNC_ADD);
		gl.blendFunc(gl.ONE, gl.ZERO);
	}
	
	// 色を配列にする
	// Bracketsでクイック編集する用
	function rgba(r, g, b, a) {
		var color = new Float32Array(4);
		color[0] = r / 255;
		color[1] = g / 255;
		color[2] = b / 255;
		color[3] = a;
		return color;
	}
	
	function createFirework(p, c, o, s) {
		var n = fireworks.length;
		for(var i = 0; i < n; i++) {
			var f = fireworks[i];
			if(f.time >= 1) {
				f.color = c;
				f.position = p;
				f.offset = o;
				f.size = s;
				f.speed = Math.random() * 0.4 + 1.2;
//				f.velocity = [0, 1, 0];
				f.time = 0;
				return;
			}
		}
		fireworks.push({
			position: p,
			color: c,
			time: 0,
			offset: o,
			size: s,
			speed: Math.random() * 0.4 + 1.2,
//			velocity: [0, 1, 0]
		});
	}
	function createTail(p, c, v) {
		var n = tails.length;
		for(var i = 0; i < n; i++) {
			var f = tails[i];
			if(f.time >= 1) {
				f.color = c;
				f.position = p;
				f.speed = Math.random() * 0.4 + 1.2;
				f.velocity = v;
				f.time = 0;
				return;
			}
		}
		tails.push({
			position: p,
			color: c,
			time: 0,
			speed: Math.random() * 0.4 + 1.2,
			velocity: v
		});
	}
	
	function randomRange(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	function createRandom(n) {
		var v = [],
			c = [];
		
		for(; n >= 0; n--) {
			var x = Math.random() * 2.0 - 1.0,
				y = Math.random() * 2.0 - 1.0,
				z = Math.random() * 2.0 - 1.0;
			var l = 2.0 / Math.sqrt(x * x + y * y + z * z) * randomRange(0.9, 1.0);
			v.push(x * l, y * l, z * l);
			c.push(0.8, 0.3, 0.5, 0.2);
		}
		
		var p = [],
			s = 10;
		for(var i = -s; i <= s; i++) {
			p.push(i * 2, 0, -s * 2);
			p.push(i * 2, 0, s * 2);
		}
		
		for(var i = -s; i <= s; i++) {
			p.push(-s * 2, 0, i * 2);
			p.push(s * 2, 0, i * 2);
		}
		
		return {
			meshes: [
				{
					vertexStream: {
						v: v,
//						color: c,
					},
				},
				{
					vertexStream: {
						position: [1, 1, -1, 1, 1, -1, -1, -1]
					},
					indexStream: [0, 1, 2, 0, 2, 3]
				},
				{
					vertexStream: {
						o: [0, 0.01, 0.02, 0.03, 0.04]
					}
				},
				{
					vertexStream: {
						position: p
					}
				}
			],
		};
	}
	
})();

