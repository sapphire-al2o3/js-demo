var canvas,
    ctx,
    gl,
    program,
    vertex = {},
    vbo = {},
    tex,
    matrix = {},
    buffer,
    video,
    cq = glMatrix.quat.create([0.0, 0.0, 0.0, 1.0]),
    tq = glMatrix.quat.create(cq);


matrix.pMatrix = glMatrix.mat4.create();
matrix.mvMatrix = glMatrix.mat4.create();
matrix.nMatrix = glMatrix.mat3.create();

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
            dq = glMatrix.quat.fromValues(dy * as, dx * as, 0.0, Math.cos(ar));
            glMatrix.quat.multiply(tq, dq, cq);
        }
        // render();
    }
    e.preventDefault();
}
function up(e) {
    drag = false;
    cq.set(tq);
}

(function ready() {
    
    canvas = document.getElementById('canvas');
    video = document.getElementById('video');
    
    canvas.addEventListener('mousedown', down, false);
    canvas.addEventListener('mousemove', move, false);
    canvas.addEventListener('mouseup', up, false);
    
    gl = canvas.getContext('webgl');
    gl.viewportWidth = gl.canvas.width;
    gl.viewportHeight = gl.canvas.height;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    initBuffer();
    initShader();
    
    let capture = false;

    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
            video.srcObject = mediaStream;
            video.onloadedmetadata = e => {
                video.play();
                capture = true;
            };
        });
    }
    
    setInterval(function() {
        if(capture) {
            render();
        }
	}, 1000/15);
})();

function createCube() {
    var vertices = [
        // Front face
        -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    var indices = [
        // Front face
        0, 1, 2,
        0, 2, 3,
        // Back face
        4, 5, 6,
        4, 6, 7,
        // Top face
        8, 9, 10,
        8, 10, 11,
        // Bottom face
        12, 13, 14,
        12, 14, 15,
        // Right face
        16, 17, 18,
        16, 18, 19,
        // Left face	
        20, 21, 22,
        20, 22, 23
    ];
    var normals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];
    var textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];
    return {size: 36, v: vertices, n: normals, t: textureCoords, i: indices};
}

function initBuffer() {
    //vertex = createSphere(32);
    //vertex = createTorus(32, 32);
    vertex = createCube();

    vbo.vtx = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vtx);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex.v), gl.STATIC_DRAW);

    vbo.tex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.tex);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex.t), gl.STATIC_DRAW);

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

function initTexture() {
    var img = document.getElementById('video');

    if(!tex) {
        tex = gl.createTexture();
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    //gl.pixelStorei(gl.PACK_ALIGNMENT, true);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 64, 64, 0, gl.RGB, gl.UNSIGNED_BYTE, img);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);

    getError();
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

    program.vertex.texcoord = gl.getAttribLocation(program, 'aVertexTexcoord');
    gl.enableVertexAttribArray(program.vertex.texcoord);

    program.location = {};
    for(var e in matrix) {
        program.location[e] = gl.getUniformLocation(program, e);
    }
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
        //console.log(error + ':' + token[error]);
    }
}

let rotMtx = glMatrix.mat4.create();
let vMatrix = glMatrix.mat4.create();

function preRender() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.perspective(matrix.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    glMatrix.mat4.identity(matrix.mvMatrix);
    //mat4.translate(mvMatrix, [-0.0, 0.0, -6.0]);

    glMatrix.mat4.lookAt(vMatrix, [-2, 2, -4], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.multiply(matrix.mvMatrix, vMatrix, glMatrix.mat4.fromQuat(rotMtx, tq));
    glMatrix.mat3.normalFromMat4(matrix.nMatrix, matrix.mvMatrix);

    gl.uniformMatrix4fv(program.location.pMatrix, false, matrix.pMatrix);
    gl.uniformMatrix4fv(program.location.mvMatrix, false, matrix.mvMatrix);
    gl.uniformMatrix3fv(program.location.nMatrix, false, matrix.nMatrix);
    gl.uniform1i(program.samplerUniform, 0);

    // 頂点バッファ
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.vtx);
    gl.vertexAttribPointer(program.vertex.position, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo.tex);
    gl.vertexAttribPointer(program.vertex.texcoord, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo.idx);

    initTexture();

    // テクスチャ
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
}

function render() {
    preRender();

    gl.drawElements(gl.TRIANGLES, vertex.size, gl.UNSIGNED_SHORT, 0);
    gl.flush();

    getError();
}
