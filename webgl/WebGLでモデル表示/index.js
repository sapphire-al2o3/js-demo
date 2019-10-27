var Base64 = function () {
    "use strict";
    
    var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        d = {},
        i = 0,
        l = e.length;
    
    for (i = 0; i < l; i += 1) {
        d[e[i]] = i;
    }

    return {
        encode: function (a, s) {
            var l = s === undefined ? a.length : s,
                m = l % 3,
                r = [],
                i = 0,
                j = 0;
            
            for (i = 0; i <= l - 3; i += 3) {
                j = (a[i] << 16) | (a[i + 1] << 8) | a[i + 2];
                r.push(e[j >> 18 & 63], e[j >> 12 & 63], e[j >> 6 & 63], e[j & 63]);
            }
            
            if (m === 1) {
                j = a[i] << 16;
                r.push(e[j >> 18 & 63], e[j >> 12 & 63], '==');
            } else if (m === 2) {	
                j = (a[i] << 16) | (a[i + 1] << 8);
                r.push(e[j >> 18 & 63], e[j >> 12 & 63], e[j >> 6 & 63], '=');
            }
            
            return r.join('');
        },
        decode: function (b, a) {
            if (a === undefined) {
                a = [];
            }
            
            var l = b.length;
            
            b[l - 1] === '=' && l--;
            b[l - 1] === '=' && l--;
            b[l - 1] === '=' && l--;
            
            var m = b.length - l;
            
            for (var i = 0, j = 0; i <= l - 4; i += 4) {
                var k = (d[b[i]] << 18) | (d[b[i + 1]] << 12) | (d[b[i + 2]] << 6) | d[b[i + 3]];
                a[j++] = k >> 16 & 255;
                a[j++] = k >> 8 & 255;
                a[j++] = k & 255;
            }
            
            if (m == 1) {
                k = (d[b[i]] << 18) | (d[b[i + 1]] << 12) | (d[b[i + 2]] << 6);
                a[j++] = k >> 16 & 255;
                a[j] = k >> 8 & 255;
            } else if (m == 2) {
                k = (d[b[i]] << 18) | (d[b[i + 1]] << 12);
                a[j] = k >> 16 & 255;
            }
            
            return a;
        },
        decodeSize: function (b) {
            var l = b.length;
            if (l >= 4) {
                var s = l / 4 * 3;
                b[l - 1] === '=' && s--;
                b[l - 2] === '=' && s--;
                b[l - 3] === '=' && s--;
                return s;
            }
            return 0;
        }
    };

}();

var canvas,
	ctx,
	gl,
	program,
	vertex = {},
	material = {},
	light = {},
	tex,
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
	light.position = vec3.create([0.0, 4.0, 1.0]);
	light.direction = vec3.create([0.0, 1.0, 0.0]);
	light.intensity = new Float32Array([0.5]);
	matrix.pMatrix = mat4.create();
	matrix.mvMatrix = mat4.create();
	matrix.nMatrix = mat3.create();
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
		if(a != 0.0) {
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

function normal(a, b, c) {
	var ac = vec3.create(),
		bc = vec3.create(),
		n = vec3.create();
	vec3.subtract(a, b, ac);
	vec3.subtract(b, c, bc);
	vec3.cross(ac, bc, n);
	
	return vec3.normalize(n);
}

function calcNormal(m) {
	var vs = m.vertexStream,
		is = m.indexStream,
		p = vs.position;
	
	vs.normal = new Float32Array(p.length);
	
	for (var i = 0; i < vs.normal.length; i++) {
		vs.normal[i] = 0.0;
	}
	
	for (var i = 0, l = is.length; i < l; i += 3) {
		var i0 = is[i] * 3,
			i1 = is[i + 1] * 3,
			i2 = is[i + 2] * 3,
			v0 = vec3.create([p[i0], p[i0 + 1], p[i0 + 2]]),
			v1 = vec3.create([p[i1], p[i1 + 1], p[i1 + 2]]),
			v2 = vec3.create([p[i2], p[i2 + 1], p[i2 + 2]]),
			n = normal(v0, v1, v2);
		
		vs.normal[i0] += n[0];
		vs.normal[i0 + 1] += n[1];
		vs.normal[i0 + 2] += n[2];
		
		vs.normal[i1] += n[0];
		vs.normal[i1 + 1] += n[1];
		vs.normal[i1 + 2] += n[2];
		
		vs.normal[i2] += n[0];
		vs.normal[i2 + 1] += n[1];
		vs.normal[i2 + 2] += n[2];
	}
	
	for (i = 0, l = vs.normal.length; i < l; i += 3) {
		n = vec3.create([vs.normal[i], vs.normal[i + 1], vs.normal[i + 2]]);
		n = vec3.normalize(n);
		
		vs.normal[i] = n[0];
		vs.normal[i + 1] = n[1];
		vs.normal[i + 2] = n[2];
	}
}
function decode(m) {
	for(var i = 0; i < m.meshes.length; i++) {
		var mesh = m.meshes[i];
		
		var data = Base64.decode(mesh.indexStream),
			b = new Uint8Array(data);
		mesh.indexStream = new Uint16Array(b.buffer);
		
		for (var v in mesh.vertexStream) {
			var vs = mesh.vertexStream[v];
			data = Base64.decode(vs);
			b = new Uint8Array(data);
			mesh.vertexStream[v] = new Float32Array(b.buffer);
		}
		
		if (!('normal' in mesh.vertexStream)) {
			calcNormal(mesh);
		}
	}
}

window.onload = function () {
	decode(model);
	ready();
};

function ready() {
    canvas = document.getElementById('canvas');
    
	canvas.addEventListener('mousedown', down, false);
	canvas.addEventListener('mousemove', move, false);
	canvas.addEventListener('mouseup', up, false);

	// WebGLのコンテキスト取得
	gl = canvas.getContext('experimental-webgl');

	gl.viewportWidth = gl.canvas.width;
	gl.viewportHeight = gl.canvas.height;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
    
	console.log(model);
	
	//model = createTorus(16, 16);
	
    initBuffer(model);
    initShader();
    setupTexture(model);
	
    setTimeout(function() {
		render();
    }, 100);
};

function initBuffer(model) {

	for(var i = 0; i < model.meshes.length; i++) {
		var mesh = model.meshes[i],
			vbo = {};
		mesh.vbo = vbo;
		vbo.vtx = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vtx);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexStream.position), gl.STATIC_DRAW);
		
		vbo.nrm = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo.nrm);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexStream.normal), gl.STATIC_DRAW);
		
		if (mesh.vertexStream.uv.length > 0) {
			vbo.uv = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo.uv);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexStream.uv), gl.STATIC_DRAW);
		}
		vbo.idx = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo.idx);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(mesh.indexStream), gl.STATIC_DRAW);
	}
	
	getError();
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
	vs = getShader(gl, 'shader-vs');
    
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
    // 頂点座標属性の割り当てを取得
    program.vertex.position = gl.getAttribLocation(program, 'aVertexPosition');
    // 頂点座標属性を有効に
    gl.enableVertexAttribArray(program.vertex.position);
    
    program.vertex.normal = gl.getAttribLocation(program, 'aVertexNormal');
    gl.enableVertexAttribArray(program.vertex.normal);
	
	program.vertex.uv = gl.getAttribLocation(program, 'aVertexTexcoord');
	gl.enableVertexAttribArray(program.vertex.uv);
    
    program.location = {};
    for(var e in matrix) {
        program.location[e] = gl.getUniformLocation(program, e);
    }
    
    program.lightDirectionUniform = gl.getUniformLocation(program, 'uLightDirection');
    for(e in material) {
        program.location[e] = gl.getUniformLocation(program, 'uMaterial.' + e);
    }
    program.diffuseUniform = gl.getUniformLocation(program, 'diffuse');
    program.ambientUniform = gl.getUniformLocation(program, 'ambient');
    program.specularUniform = gl.getUniformLocation(program, 'specular');
    program.power = gl.getUniformLocation(program, 'power');
	
	getError();
}

function setupTexture(model) {
	var materials = model.materials;
	
	for (var i = 0, n = materials.length; i < n; i++) {
		var mat = materials[i],
			image = new Image();
		image.onload = function (m) {
			return function () { m.tex = initTexture(this); render(); };
		}(mat);
		image.src = mat.texture;
	}
}

function initTexture(img) {
	var tex = gl.createTexture();
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	getError();
	
	return tex;
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

function preRender() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 行列設定
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 2000.0, matrix.pMatrix);
    mat4.identity(matrix.mvMatrix);
    var vMatrix = mat4.create();
	mat4.lookAt([0, 6, 12], [0, 0, 0], [0, 1, 0], vMatrix);
	//mat4.lookAt([-2, 160, -6], [0, 0, 0], [0, 1, 0], vMatrix);
    mat4.multiply(vMatrix, quat4.toMat4(tq), matrix.mvMatrix);
    mat4.toInverseMat3(matrix.mvMatrix, matrix.nMatrix);
    mat3.transpose(matrix.nMatrix);
    
    // ユニフォーム設定
    gl.uniformMatrix4fv(program.location.pMatrix, false, matrix.pMatrix);
    gl.uniformMatrix4fv(program.location.mvMatrix, false, matrix.mvMatrix);
    gl.uniformMatrix3fv(program.location.nMatrix, false, matrix.nMatrix);
    gl.uniform4fv(program.diffuseUniform, material.diffuse);
    gl.uniform4fv(program.ambientUniform, material.ambient);
    gl.uniform4fv(program.specularUniform, material.specular);
    gl.uniform3fv(program.lightDirectionUniform, light.direction);
	gl.uniform1f(program.power, 50.0);
	
	gl.activeTexture(gl.TEXTURE0);
	
	// 頂点バッファ
	for(var i = 0; i < model.meshes.length; i++) {
		var mesh = model.meshes[i],
			mat = model.materials[mesh.material];
		
		gl.bindTexture(gl.TEXTURE_2D, mat.tex);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo.vtx);
		gl.vertexAttribPointer(program.vertex.position, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo.nrm);
		gl.vertexAttribPointer(program.vertex.normal, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo.uv);
		gl.vertexAttribPointer(program.vertex.uv, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vbo.idx);
		gl.drawElements(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
	}
	
	getError();
}

// 描画
function render() {
    preRender();
    gl.flush();
    getError();
}