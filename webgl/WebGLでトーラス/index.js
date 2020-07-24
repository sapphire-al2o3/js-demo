
const quat = glMatrix.quat;
const vec3 = glMatrix.vec3;
const mat3 = glMatrix.mat3;
const mat4 = glMatrix.mat4;

var canvas,
    ctx,
    gl,
    program,
    vertex = {},
    material = {},
    light = {},
    vbo = {},
    tex,
    matrix = {},
    blockSlider,
    cq = quat.create([0.0, 0.0, 0.0, 1.0]),
    tq = quat.create(cq);

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
                dq = quat.fromValues(dy * as, dx * as, 0.0, Math.cos(ar));
            quat.multiply(tq, dq, cq);
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
    canvas = document.getElementById('canvas');
    
    canvas.addEventListener('mousedown', down, false);
    canvas.addEventListener('mousemove', move, false);
    canvas.addEventListener('mouseup', up, false);
    
    // WebGLのコンテキスト取得
    gl = canvas.getContext('webgl');
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
    
    setTimeout(function() {
        render();
    }, 100);
};

// トーラスの生成
function createTorus(n, m) {
    var vertices = [],
    	indices = [],
    	normals = [],
    s = 3.0,
    t = 1.0;
    
    for(var i = 0; i <= n; i++) {
        var ph = Math.PI * 2.0 * i / n,
            r = Math.cos(ph) * t,
            y = Math.sin(ph) * t;

        for(var j = 0; j <= m; j++) {
            var th = 2.0 * Math.PI * j / m,
            x = Math.cos(th) * (s + r),
            z = Math.sin(th) * (s + r);
            vertices.push(x, y, z);
            normals.push(r * Math.cos(th), y, r * Math.sin(th));
        }
    }

    for(i = 0; i < n; i++) {
        for(j = 0; j < m; j++) {
            var count = (n + 1) * j + i;
            indices.push(count, count + n + 2, count + 1);
            indices.push(count, count + n + 1, count + n + 2);
        }
    }
    
    return {size: indices.length, v: vertices, i: indices, n: normals};
}

function initBuffer() {
    //vertex = createSphere(32);
    vertex = createTorus(64, 64);
    
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
    
    program.location = {};
    for(var e in matrix) {
        program.location[e] = gl.getUniformLocation(program, e);
    }
    
    program.lightDirectionUniform = gl.getUniformLocation(program, 'uLightDirection');
    for(e in material) {
        program.location[e] = gl.getUniformLocation(program, 'uMaterial.' + e);
    }
    program.diffuseUniform = gl.getUniformLocation(program, 'uMaterial.diffuse');
    program.ambientUniform = gl.getUniformLocation(program, 'uMaterial.ambient');
    program.specularUniform = gl.getUniformLocation(program, 'uMaterial.specular');
    program.power = gl.getUniformLocation(program, 'uMaterial.power');
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
    mat4.perspective(matrix.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.identity(matrix.mvMatrix);
    let vMatrix = mat4.create();
    let rotMtx = mat4.create();
    mat4.lookAt(vMatrix, [-2, 12, -6], [0, 0, 0], [0, 1, 0]);
    // mat4.multiply(vMatrix, quat.toMat4(tq), matrix.mvMatrix);
    // mat4.toInverseMat3(matrix.mvMatrix, matrix.nMatrix);
    // mat3.transpose(matrix.nMatrix);
    mat4.multiply(matrix.mvMatrix, vMatrix, glMatrix.mat4.fromQuat(rotMtx, tq));
    mat3.normalFromMat4(matrix.nMatrix, matrix.mvMatrix);

    // ユニフォーム設定
    gl.uniformMatrix4fv(program.location.pMatrix, false, matrix.pMatrix);
    gl.uniformMatrix4fv(program.location.mvMatrix, false, matrix.mvMatrix);
    gl.uniformMatrix3fv(program.location.nMatrix, false, matrix.nMatrix);
    gl.uniform4fv(program.diffuseUniform, material.diffuse);
    gl.uniform4fv(program.ambientUniform, material.ambient);
    gl.uniform4fv(program.specularUniform, material.specular);
    gl.uniform3fv(program.lightDirectionUniform, light.direction);

    // 頂点バッファ
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vtx);
    gl.vertexAttribPointer(program.vertex.position, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.nrm);
    gl.vertexAttribPointer(program.vertex.normal, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo.idx);
}

// 描画
function render() {
    preRender();
    gl.uniform1f(program.power, 50.0);
    gl.drawElements(gl.TRIANGLES, vertex.size, gl.UNSIGNED_SHORT, 0);
    gl.flush();
    getError();
}

