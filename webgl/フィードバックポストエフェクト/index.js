// forked from sapphire_al2o3's "アウトライン" http://jsdo.it/sapphire_al2o3/uJCKe
var Feedback = (function(global) {
	'use strict';
	
	var fullScreenVS =
		"attribute vec2 position;" +
		"varying vec2 uv;" +
		"void main(){" +
		"uv=position.xy*0.5+0.5;" +
		"gl_Position=vec4(position.xy,0.0,1.0);}";
    var feedbackVS =
        "attribute vec2 position;" +
        "uniform vec4 rot;" +
        "varying vec2 uv;" +
        "void main(){" +
        "vec2 center=vec2(0.5,0.5);" +
        "uv=position.xy*0.5+0.5;" +
        "float s=dot(uv,rot.xy)-dot(rot.xy,center);" +
        "float t=dot(uv,rot.zw)-dot(rot.zw,center);" +
        "uv=vec2(s,t)+center;" +
        "gl_Position=vec4(position.xy,0.0,1.0);}";
	var feedbackFS =
        "precision mediump float;" +
        "varying vec2 uv;" +
        "uniform sampler2D tex;" +
		"uniform float blend;" +
		"void main(){" +
		"vec4 c=texture2D(tex,uv);" +
        "gl_FragColor=vec4(c.rgb,blend);}";
	
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
	
	function Feedback(context) {
		gl = context;
		this.width = gl.drawingBufferWidth;
		this.height = gl.drawingBufferHeight;
		this.quad = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
		gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		this.screen = createTexture(gl, this.width, this.height);
		
		var program = [];
		program.push(createShader(feedbackFS, feedbackVS));
		this.program = program;
		
		var location = [];
		location.push(gl.getUniformLocation(program[0], 'tex'));
        location.push(gl.getUniformLocation(program[0], 'rot'));
//        location.push(gl.getUniformLocation(program[0], 'center'));
		location.push(gl.getUniformLocation(program[0], 'blend'));
		this.location = location;
        this.first = true;
	}
	
	Feedback.prototype.draw = function(blend, scale) {
        if(!this.first) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            
            gl.disable(gl.DEPTH_TEST);
            gl.viewport(0, 0, this.width, this.height);
            
            gl.useProgram(this.program[0]);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.screen);
            
            gl.uniform1i(this.location[0], 0);
            var c = Math.cos(0) * scale,
                s = Math.sin(0) * scale;
            gl.uniform4f(this.location[1], c, -s, s, c);
            gl.uniform1f(this.location[2], blend);
            
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        this.first = false;
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, this.width, this.height, 0);
        //gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, this.width, this.height);
		
		gl.useProgram(null);
		gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
	};
	
	return Feedback;
})();


(function() {
	'use strict';
	
	var gl = initContext('canvas'),
		width = gl.canvas.width,
		height = gl.canvas.height;
	
	var program = initShader(gl, 'shader-fs', 'shader-vs');
	
	var model = cube(200, 0.2), // 使ってない
		m2 = cube(1500, 0.2); // キューブの数と大きさを指定
	
    var isFeedback = true;
    var check = createCheckbox('feedback', function(v) {
        isFeedback = v;
    });
    var blend = 0.65;
    var sliderBlend = createSlider('blend', blend, function(v) {
        blend = v;
    });
    var scale = 0.95;
    var sliderScale = createSlider('scale', scale * 0.5, function(v) {
        scale = v * 2;
    });
    document.body.appendChild(check);
    document.body.appendChild(sliderBlend);
    document.body.appendChild(sliderScale);
    document.getElementById('feedback').checked = true;
    
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
	
	var feedback = new Feedback(gl);
	
	function render() {
//		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, width, height);
		
		camera.position.x = Math.cos(f * 0.01) * 20;
		camera.position.y = Math.cos(f * 0.005) * 15;
		camera.position.z = Math.sin(f * 0.01) * 20;
		
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
		
        if(isFeedback)
		    feedback.draw(blend, scale);
		
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
