var gl,
	program,
	material = {},
	camera = {},
	light = {},
	matrix = {},
	frame = 0;

// initialize
material.diffuse = new Float32Array([1.0, 1.0, 1.0, 1.0]);
material.specular = new Float32Array([0.88281, 0.65802, 0.366065, 1.0]);
material.ambient = new Float32Array([0.08, 0.05, 0.02, 1.0]);
light.position = new Float32Array([0.0, 4.0, 2.0]);
light.direction = new Float32Array([1.0, 2.0, 1.0]);
camera.position = new Vector3(0, 2.0, 4.0);
camera.target = new Vector3(0.0, 0.0, 0.0);
camera.up = new Vector3(0, 1, 0);
matrix.mMatrix = new Matrix4();
matrix.nMatrix = new Matrix4();
matrix.vMatrix = new Matrix4();
matrix.mvMatrix = new Matrix4();
matrix.pMatrix = new Matrix4();

function initBuffer(model) {
	var createVertexBuffer = function(gl, vertices) {
		if(!vertices) return null;
		var b = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, b);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return b;
	};
	
	for(var i = 0; i < model.meshes.length; i++) {
		var mesh = model.meshes[i],
			vbo = {};
		mesh.vbo = vbo;
		vbo.position = createVertexBuffer(gl, mesh.vertexStream.position);
		vbo.normal = createVertexBuffer(gl, mesh.vertexStream.normal);
		
		mesh.ibo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(mesh.indexStream), gl.STATIC_DRAW);
		
		getError(gl);
	}
}

// 描画
function render(model) {
	light.direction[0] = 2.0 * Math.sin(frame * 0.02);
	light.direction[2] = 2.0 * Math.cos(frame * 0.02);
	
    // バッファクリア
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
	// 行列設定
	Matrix4.identity(matrix.mMatrix);
    Matrix4.perspective(45.0 * Math.PI / 180.0, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, matrix.pMatrix);
	Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);
	matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
	matrix.nMatrix = matrix.mvMatrix.toMatrix3().inverse();
    
	// ユニフォーム設定
	gl.uniformMatrix4fv(program.uniform.mvMatrix.location, false, matrix.mvMatrix.data);
	gl.uniformMatrix4fv(program.uniform.pMatrix.location, false, matrix.pMatrix.data);
	// gl.uniformMatrix3fv(program.uniform.nMatrix.location, false, matrix.nMatrix.data);
	gl.uniform3fv(program.uniform.lightDirection.location, light.direction);
	gl.uniform4fv(program.uniform.diffuse.location, material.diffuse);
	
	// 頂点バッファ
	for(var i = 0; i < model.meshes.length; i++) {
		var mesh = model.meshes[i];
		
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo.position);
		gl.vertexAttribPointer(program.attribute[0].location, 3, gl.FLOAT, false, 0, 0);
		//gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo.normal);
		//gl.vertexAttribPointer(program.attribute[1].location, program.attribute[1].size, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
		var size = mesh.indexStream.length;
		gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0);
        
	}
	
	frame++;
	
	gl.flush();
	getError(gl);
}

var m = createSphere(32);

gl = initContext('canvas');
if(!gl.getExtension('OES_standard_derivatives')) {
	throw 'extension not support';
}
gl.clearColor(0.2, 0.2, 0.2, 1.0);
initBuffer(m);
program = initShader(gl, 'shader-fs', 'shader-vs');
setInterval(function() {
    render(m);
}, 1000 / 30);

