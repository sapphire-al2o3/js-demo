var canvas = document.getElementById('canvas'),
    gl = canvas.getContext('experimental-webgl'),
    width = canvas.width,
    height = canvas.height,
    vbo = {},
    tex,
    program,
    point = new Float32Array(2),
    img = new Image(),
    frame = 0;

canvas.addEventListener('mousemove', function(e) {
    point[0] = e.clientX * 2.0 / width - 1.0;
    point[1] = 1.0 - e.clientY * 2.0 / width;
}, false);

img.onload = ready;
img.src = 'flower.jpg';

function ready() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    initBuffer(createPlane(64));
    initShader();
    initTexture(img);
    setInterval(render, 1000 / 30);
}

function createPlane(n) {
    var position = [],
	color = [],
	texCoord = [];
    for(var i = 0; i <= n; i++) {
	for(var j = 0; j <= n; j++) {
	    var x = j / n * 2 - 1,
		y = i / n * 2 - 1;
	    position.push(x, y, 0.0);
	    color.push(1.0, 1.0, 1.0, 1.0);
	}
    }
    return {position: position, color: color, size: position.length / 3};
}

// 頂点バッファを作成する
function initBuffer(buffer) {
    vbo.size = buffer.size;
    vbo.vtx = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vtx);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer.position), gl.STATIC_DRAW);
    vbo.clr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.clr);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer.color), gl.STATIC_DRAW);
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

// シェーダの初期化
function initShader() {
    var fs = getShader(gl, 'shader-fs'),
	vs = getShader(gl, 'shader-vs'),
	attribute = [],
	uniform = [];
    
    attribute = getAttribute(vs.source);
    uniform = uniform.concat(getUniform(vs.source));
    uniform = uniform.concat(getUniform(fs.source));
    
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.log(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    program.attribute = attribute;
    for(var e in attribute) {
	attribute[e].location = gl.getAttribLocation(program, attribute[e].name);
	gl.enableVertexAttribArray(attribute[e].location);
    }

    program.uniform = uniform;
    for(e in uniform) {
	uniform[e].location = gl.getUniformLocation(program, uniform[e].name);
    }
    
    getError();
}

function initTexture(img) {
    tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 64, 64, 0, gl.RGB, gl.UNSIGNED_BYTE, img);

    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    getError();
}

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
	console.log(getError.caller.name);
    }
}

function preRender() {
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vtx);
    gl.vertexAttribPointer(program.attribute[0].location, 3, gl.FLOAT, false, 0, 0);    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.clr);
    gl.vertexAttribPointer(program.attribute[1].location, 4, gl.FLOAT, false, 0, 0);
    
    gl.uniform2f(program.uniform[0].location, point[0], point[1]);
    gl.uniform1i(program.uniform[1].location, 0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
}

function render() {
    preRender();
	
    gl.drawArrays(gl.POINTS, 0, vbo.size);
    gl.flush();
	
    getError();
    frame++;
}