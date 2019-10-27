var gl = initContext('canvas');

// 拡張機能を有効にする
if(!gl.getExtension('OES_standard_derivatives')) {
    throw 'extension not support';
}

var program = initShader(gl, 'shader-fs', 'shader-vs');

createControl(program, document.body, {
    scale: 1.0,
    alphaTest: 0.3,
    smoothCenter: 0.5,
    outlineCenter: 0.48,
    glyphColor: new Float32Array([1.0, 1.0, 1.0]),
    outlineColor: new Float32Array([0.0, 0.0, 1.0]),
    outline: false
}, function() {
    render(model);
});

// アルファブレンド
gl.enable(gl.BLEND);
gl.blendEquation(gl.FUNC_ADD);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
var model = {};
model.meshes = [createPlaneMesh(200, 200, 0)];
model.materials = [
    { tex: initTexture(gl, document.getElementById('texture')) }
];

// 頂点バッファの初期化
initBuffer(gl, model);

render(model);

// モデルの描画
function drawModel(model) {
    for(var i = 0; i < model.meshes.length; i++) {
        var mesh = model.meshes[i],
            mat = model.materials[mesh.material];
        
        if(mat) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, mat.tex);
        }
        
        setupAttribute(program, mesh.vbo);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
        gl.drawElements(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
    }
}
	
// 描画
function render(model) {
    gl.clearColor(0.5, 0.7, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    setupUniform(program);
    
    drawModel(model);
    
    gl.flush();
    getError(gl);
}

// マウスホイールイベント
var wheelHandler = function(e) {
    var y = e.wheelDelta ? e.wheelDelta : e.deltaY,
        scale = program.uniform['scale'].value;
    
    scale *= y > 0 ? 1.0 / 0.9 : 0.9;
    
    if(scale < 0.1) {
        scale = 0.1;
    }
    if(scale > 10.0) {
        scale = 10.0;
    }
    
    program.uniform['scale'].value = scale;
    
    render(model);
};

document.getElementById('canvas').addEventListener('wheel', wheelHandler, false);
document.getElementById('canvas').addEventListener('mousewheel', wheelHandler, false);

// 板ポリ生成
function createPlaneMesh(x, y, m) {
	var position = [
		-x, y, 0.0,
		x, y, 0.0,
		-x, -y, 0.0,
		x, -y, 0.0
	];
	
	var texcoord = [
		0.0, 1.0,
		1.0, 1.0,
		0.0, 0.0,
		1.0, 0.0
	];
	
	return {
		material: m,
		indexStream: [1, 0, 2, 1, 2, 3],
		vertexStream: {
			position: position,
			uv: texcoord
		}
	};
}
