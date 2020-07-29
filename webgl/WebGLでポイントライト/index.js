const quat4 = glMatrix.quat;
const mat4 = glMatrix.mat4;
const mat3 = glMatrix.mat3;
const vec3 = glMatrix.vec3;

var canvas,
    ctx,
    gl,
    program,
    vertex = {},
    material = {},
    light = {},
    vbo = {},
    matrix = {},
    blockSlider,
    cq = quat4.create([0.0, 0.0, 0.0, 1.0]),
    tq = quat4.create(cq);

// initialize
(function() {
    material.diffuse = new Float32Array([0.7, 0.7, 1.0, 1.0]);
    material.specular = new Float32Array([0.8, 0.8, 0.8, 1.0]);
    material.ambient = new Float32Array([0.05, 0.05, 0.05, 1.0]);
    material.emission = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    light.position = vec3.create([0.0, 0.0, 0.0]);
    light.direction = vec3.create([1.0, 1.0, 0.0]);
    light.intensity = 10.0;
    material.power = 100.0;
    matrix.pMatrix = mat4.create();
    matrix.mvMatrix = mat4.create();
    matrix.nMatrix = mat3.create();
    matrix.vMatrix = mat4.create();
})();

var drag = false,
    mouse = {};

function down(e) {
    drag = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function move(e) {
    if(drag) {
	var x = e.clientX,
	    y = e.clientY,
	    dx = (x - mouse.x) / 400.0,
	    dy = (y - mouse.y) / 400.0,
	    a = Math.sqrt(dx * dx + dy * dy);
	if(a !== 0.0) {
	    var ar = a * Math.PI,
		as = Math.sin(ar) / a,
		dq = quat4.create([dy * as, dx * as, 0.0, Math.cos(ar)]);
	    quat4.multiply(dq, cq, tq);
	}
	render();
    }
    e.preventDefault();
}

function up(e) {
    drag = false;
    cq.set(tq);
}

window.onload = function ready() {
    blockSlider = slider("slider", 240);
    
    canvas = document.getElementById('canvas');
    
    canvas.addEventListener('mousedown', down, false);
    canvas.addEventListener('mousemove', move, false);
    canvas.addEventListener('mouseup', up, false);

    gl = canvas.getContext('experimental-webgl');
    
    gl.viewportWidth = gl.canvas.width;
    gl.viewportHeight = gl.canvas.height;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    
    initBuffer();
    initShader();
    
    setInterval(render, 1000 / 30);
};


function initBuffer() {
	vertex = createPlane();
	//vertex = createTorus(32, 32);
	
	vbo.vtx = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vtx);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex.v), gl.STATIC_DRAW);
	
	vbo.nrm = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo.nrm);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex.n), gl.STATIC_DRAW);
	
	vbo.idx = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo.idx);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(vertex.i), gl.STATIC_DRAW);
}

// シェーダの取得
function getShader(gl, id) {
	var shaderScript = document.getElementById(id),
		str = shaderScript.textContent,
		shader = null;
	
	if(shaderScript.type == 'x-shader/x-fragment') {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if(shaderScript.type == 'x-shader/x-vertex') {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	
	shader.source = str;
	
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

// シェーダコードからAttributeを取得する
function getAttribute(str) {
    var attributes = [];
    str = str.replace(/\s*\/\/.*\n/g, '');
    str.replace(
		/attribute\s+(float|vec2|vec3|vec4)\s+(\w+);/g,
		function(str, type, name) { attributes.push({type: type, name: name}); }
    );
    return attributes;
}

// シェーダコードからUnifromを取得する
function getUniform(str) {
	var uniforms = [];
	str = str.replace(/\s*\/\/.*\n/g, '');
	str.replace(
		/uniform\s+(float|vec2|vec3|vec4|mat3|mat4|bool|sampler2D)\s+(\w+);/g,
		function(str, type, name) { uniforms.push({type: type, name: name}); }
	);
	return uniforms;
}

// シェーダの初期化
function initShader() {
	var fs = getShader(gl, 'shader-fs'),
		vs = getShader(gl, 'shader-vs'),
		attribute = getAttribute(vs.source),
		uniform = getUniform(vs.source);
	
	getError();
	
	// Create the shader program
	program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);

	// If creating the shader program failed, alert
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert(gl.getProgramInfoLog(program));
	}

	gl.useProgram(program);
	
	program.vertex = {};
	program.vertex.position = gl.getAttribLocation(program, 'aVertexPosition');
	gl.enableVertexAttribArray(program.vertex.position);

	//program.vertex.color = gl.getAttribLocation(program, 'aVertexColor');
	//gl.enableVertexAttribArray(program.vertex.color);

	//program.vertex.texcoord = gl.getAttribLocation(program, 'aTexCoord');
	//gl.enableVertexAttribArray(program.vertex.texcoord);
	
	program.vertex.normal = gl.getAttribLocation(program, 'aVertexNormal');
	gl.enableVertexAttribArray(program.vertex.normal);
	
	program.location = {};
	for(var e in matrix) {
		program.location[e] = gl.getUniformLocation(program, e);
	}
	
	//program.samplerUniform = gl.getUniformLocation(program, 'uSampler');
	program.lightDirectionUniform = gl.getUniformLocation(program, 'uLightDirection');
	program.lightPositionUniform = gl.getUniformLocation(program, 'uLightPosition');
	program.lightIntensityUniform = gl.getUniformLocation(program, 'uLightIntensity');
	
	for(e in material) {
		program.location[e] = gl.getUniformLocation(program, '' + e);
	}
	program.diffuseUniform = gl.getUniformLocation(program, 'diffuse');
	program.ambientUniform = gl.getUniformLocation(program, 'ambient');
	program.specularUniform = gl.getUniformLocation(program, 'specular');
	program.power = gl.getUniformLocation(program, 'power');
}

// エラーの取得
function getError() {
	var error = gl.getError();
	if(error != gl.NO_ERROR) {
		var token = {
			1280: 'INVALID_ENUM',
			1281: 'INVALID_VALUE',
			1282: 'INVALID_OPERATION',
			1285: 'OUT_OF_MEMORY'
		};
		console.log(error + ':' + token[error]);
	}
}

mat3.multiplyVec3 = function (mat, vec, dest) {
    if (!dest) { dest = vec; }

    var x = vec[0], y = vec[1], z = vec[2];

    dest[0] = mat[0] * x + mat[3] * y + mat[6] * z;
    dest[1] = mat[1] * x + mat[4] * y + mat[7] * z;
    dest[2] = mat[2] * x + mat[5] * y + mat[8] * z;

    return dest;
};

var lightPos = [1, 1, 1],
	t = 0.0;

function preRender() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(matrix.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	mat4.identity(matrix.mvMatrix);
	//mat4.translate(mvMatrix, [-0.0, 0.0, -6.0]);
	matrix.vMatrix = mat4.create();
	mat4.lookAt(matrix.vMatrix, [-2, 8, -6], [0, 0, 0], [0, 1, 0]);
	var mMatrix = mat4.create(),
		scale = vec3.create([4, 1, 4]);
	mat4.identity(mMatrix);
	mat4.scale(mMatrix, scale, mMatrix);
	// mat4.multiply(mMatrix, quat4.toMat4(tq), mMatrix);
	let rotMtx = mat4.create();
	mat4.multiply(mMatrix, mat4.fromQuat(rotMtx, tq), mMatrix);
	
	mat4.multiply(matrix.mvMatrix, matrix.vMatrix, mMatrix);
	// mat4.toInverseMat3(matrix.mvMatrix, matrix.nMatrix);
	// mat3.transpose(matrix.nMatrix);
	mat3.normalFromMat4(matrix.nMatrix, matrix.mvMatrix);
	
	gl.uniformMatrix4fv(program.location.pMatrix, false, matrix.pMatrix);
	gl.uniformMatrix4fv(program.location.mvMatrix, false, matrix.mvMatrix);
	gl.uniformMatrix3fv(program.location.nMatrix, false, matrix.nMatrix);
	gl.uniformMatrix4fv(program.location.vMatrix, false, matrix.vMatrix);
	//gl.uniform1i(program.samplerUniform, 0);
	
	// マテリアルの設定
	gl.uniform4fv(program.diffuseUniform, material.diffuse);
	gl.uniform4fv(program.ambientUniform, material.ambient);
	gl.uniform4fv(program.specularUniform, material.specular);
	gl.uniform1f(program.power, material.power);
	
	// ライトの設定
	gl.uniform3fv(program.lightPositionUniform, light.position);
	gl.uniform1f(program.lightIntensityUniform, light.intensity);
	// 頂点バッファ
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vtx);
	gl.vertexAttribPointer(program.vertex.position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo.nrm);
	gl.vertexAttribPointer(program.vertex.normal, 3, gl.FLOAT, false, 0, 0);
	
	//gl.bindBuffer(gl.ARRAY_BUFFER, vbo.clr);
	//gl.vertexAttribPointer(program.vertex.color, 4, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo.idx);
}

function render() {
	preRender();
	
	light.position[1] = blockSlider.value * 10.0;
	gl.uniform3fv(program.lightPositionUniform, light.position);
	light.position[0] = 4.0 * Math.sin(t + 0.3);
	light.position[2] = 4.0 * Math.cos(0.5 * t);
	t += 0.05;
	
	
	gl.drawElements(gl.TRIANGLES, vertex.size, gl.UNSIGNED_SHORT, 0);
	gl.flush();
	
	getError();
	
}

function slider(id, w, func) {
	var elm = document.getElementById(id);
	elm.onmousedown = function(e) {
		var cur = this.firstChild,
			t = document,
			r = elm.getBoundingClientRect(),
			x = e.pageX - r.left,
			y = e.pageY - r.top,
			l = r.left;
		cur.style.left = x - 5 + 'px';
		
		elm.value = x / w;
		
	    t.onselectstart = function() { return false; };
		    
		t.onmousemove = function(e) {
		    var x = e.clientX - l;
		    if(x < 0) x = 0;
		    if(x > w) x = w;
		    cur.style.left = x - 5 + 'px';
		    elm.value = x / w;
		    if(func) func(elm.value);
		};
	    t.onmouseup = function(e) {
		    t.onmousemove = null;
		    t.onmouseup = null;
		    t.onselectstart = null;
		};
	    
	    if(func) func(elm.value);
	};
    elm.value = 0.3;
    return elm;
}