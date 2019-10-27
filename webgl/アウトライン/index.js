var Outline = (function(global) {
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
		"vec4 c=texture2D(tex,uv);" +
		"vec4 h=1.0-abs(texture2D(tex,uv+vec2(offset.x,0.0))-c);" +
//		"vec4 h=1.0-sign(abs(texture2D(tex,uv+vec2(offset.x,0.0))-c)-0.7);" +
		"vec4 v=1.0-abs(texture2D(tex,uv+vec2(0.0,offset.y))-c);" +
//		"vec4 v=1.0-sign(abs(texture2D(tex,uv+vec2(0.0,offset.y))-c)-0.7);" +
//		"vec4 hv=1.0-sign(abs(texture2D(tex,uv+vec2(offset.x,offset.y))-c)-0.5);" +
//		"//c+=texture2D(tex,uv+vec2(-offset));" +
		"c=h*v;" +
		"gl_FragColor=vec4(c.rgb,1.0);}";
	
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
		
		this.screen = createTexture(gl, this.width, this.height);
		
		var program = [];
		program.push(createShader(outlineFS, fullScreenVS));
		this.program = program;
		
		var location = [];
		location.push(gl.getUniformLocation(program[0], 'tex'));
		location.push(gl.getUniformLocation(program[0], 'offset'));
		this.location = location;
	}
	
	Outline.prototype.draw = function(g) {
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		
		gl.disable(gl.DEPTH_TEST);
		
		// テクスチャにコピー
		gl.bindTexture(gl.TEXTURE_2D, this.screen);
		gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this.width, this.height, 0);

		// 合成
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, this.width, this.height);
		gl.useProgram(this.program[0]);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.screen);
		gl.uniform1i(this.location[0], 0);
		gl.uniform2f(this.location[1], 1 / this.width, 1 / this.height);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		
		gl.useProgram(null);
		gl.enable(gl.DEPTH_TEST);
	};
	
	return Outline;
})();


(function() {
	'use strict';
	
	var gl = initContext('canvas'),
		width = gl.canvas.width,
		height = gl.canvas.height;
	
	var program = initShader(gl, 'shader-fs', 'shader-vs');
	
	var model = cube(200, 0.2), // 使ってない
		m2 = cube(1500, 0.2); // キューブの数と大きさを指定
	
    var isOutline = true;
    var check = createCheckbox('outline', function(v) {
        isOutline = v;
    });
    document.body.appendChild(check);
    document.getElementById('outline').checked = true;
    
	initBuffer(gl, model);
	initBuffer(gl, m2);
	
	var camera = {},
		matrix = {};
	
	camera.position = new Vector3(0, 0.0, 20.0);
	camera.target = new Vector3(0, 0, 0);
	camera.up = new Vector3(0, 1, 0);
	matrix.mMatrix = new Matrix4();
	matrix.vMatrix = new Matrix4();
	matrix.mvMatrix = new Matrix4();
	matrix.pMatrix = new Matrix4();
	
	Matrix4.perspective(60.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
	Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.mvMatrix);

	program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
	program.uniform['pMatrix'].value = matrix.pMatrix.data;

	var f = 0;
	
	var outline = new Outline(gl);
	
	function render() {
//		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, width, height);
		
		camera.position.x = Math.cos(f * 0.02) * 20;
		camera.position.y = Math.cos(f * 0.005) * 15;
		camera.position.z = Math.sin(f * 0.02) * 20;
		
		Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.mvMatrix);
		program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
//		program.uniform['color'].value = [1, 1, 1, 1];
		
		program.uniform['color'].value = [0, 0, 0, 1];

        var mesh = m2.meshes[0];
        
        gl.useProgram(program);
	    setupUniform(program);
	    setupAttribute(program, mesh.vbo);
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
	    gl.drawElements(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
		
        if(isOutline)
		    outline.draw(1);
		
		gl.flush();
		
		f++;
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
})();
