var gl,
	program,
	material = {},
	camera = {},
	light = {},
	matrix = {},
	blockSlider,
	windDir = new Vector3(0.2, 0.0, -0.1).normalize(),
	windForce = new Vector3(0.2, 0.0, -0.1),
	grassSlider,
	frame = 0;

// initialize
(function() {
	material.diffuse = new Float32Array([1.0, 1.0, 1.0, 1.0]);
	light.direction = new Float32Array([0.0, 1.0, 0.0]);
	camera.position = new Vector3(0, 1, 4);
	camera.target = new Vector3(0, 0, 0);
	camera.up = new Vector3(0, 1, 0);
})();

function createModel() {
	var meshes = [],
		materials = [];
	materials.push({
		"texture": "grass.png",
		"wrap": WebGLRenderingContext.CLAMP_TO_EDGE
	});
	materials.push({
		"texture": "ground.jpg",
		"wrap": WebGLRenderingContext.REPEAT
	});
	
	var model = {};
	model.meshes = [];
	model.materials = materials;
	
	var mesh = {},
		vertexStream = {},
		indexStream = [],
		uv = [],
		position = [],
		normal = [],
		color = [],
		j = 0;
	
	for(var i = 0; i < 4000; i++) {
		var x = Math.random() * 8.0 - 4.0,
			z = Math.random() * 9.0 - 6.1,
			s = Math.random() * 0.1;
		position.push(x + 0.3 + s, 0.3 + s * 2, z);
		position.push(x + 0.3 + s, 0.0, z);
		position.push(x - 0.3 + s, 0.3 + s * 2, z);
		position.push(x - 0.3 + s, 0.0, z);
		normal.push(0.0, 1.0, 0.0);
		normal.push(0.0, 1.0, 0.0);
		normal.push(0.0, 1.0, 0.0);
		normal.push(0.0, 1.0, 0.0);
		uv.push(1.0, 1.0);
		uv.push(1.0, 0.0);
		uv.push(0.0, 1.0);
		uv.push(0.0, 0.0);
		color.push(1.0, 1.0, 1.0);
		color.push(0.0, 0.0, 0.0);
		color.push(1.0, 1.0, 1.0);
		color.push(0.0, 0.0, 0.0);
		indexStream.push(j, j + 2, j + 1, j + 2, j + 3, j + 1);
		j += 4;
	}
	
	vertexStream.position = position;
	vertexStream.uv = uv;
	vertexStream.normal = normal;
	vertexStream.color = color;
			
	mesh.vertexStream = vertexStream;
	mesh.indexStream = indexStream;
	mesh.material = 0;
	
	model.meshes.push(mesh);
	
	mesh = {};
	mesh.vertexStream = {
		position: [
			10.0, 0.0, 10.0,
			10.0, 0.0, -10.0,
			-10.0, 0.0, 10.0,
			-10.0, 0.0, -10.0
		],
		normal: [
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0
		],
		uv: [
			16.0, 0.0,
			16.0, 16.0,
			0.0, 0.0,
			0.0, 16.0
		],
		color: [
			0.5, 0.5, 0.5,
			0.5, 0.5, 0.5,
			0.5, 0.5, 0.5,
			0.5, 0.5, 0.5
		]
	};
	mesh.indexStream = [0, 1, 2, 2, 1, 3];
	mesh.material = 1;
	model.meshes.push(mesh);
	
	return model;
}

window.onload = function () {
	var model = createModel();
	grassSlider = slider("slider", 240);
	ready(model);
};

function ready(model) {
	// WebGLのコンテキスト取得
	gl = initContext('canvas');
	initBuffer(gl, model);
	program = initShader(gl, 'shader-fs', 'shader-vs');
	setupTexture(model);
	
	setInterval(function() {
		render(model);
	}, 1000 / 30);
}

function setupTexture(model) {
	var materials = model.materials;
	
	for (var i = 0, n = materials.length; i < n; i++) {
		var mat = materials[i],
			image = new Image();
		image.onload = function (m) {
			return function () { m.tex = initTexture(gl, this); };
		}(mat);
		image.src = mat.texture;
	}
}

// 描画
function render(model) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// 行列設定
	matrix.pMatrix = Matrix4.perspective(45.0 * Math.PI / 180.0, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
	matrix.mvMatrix = Matrix4.lookAt(camera.position, camera.target, camera.up);
	matrix.nMatrix = matrix.mvMatrix.toMatrix3().inverse().transpose();
	
	// ユニフォーム設定
	gl.uniformMatrix4fv(program.uniform.mvMatrix.location, false, matrix.mvMatrix.data);
	gl.uniformMatrix4fv(program.uniform.pMatrix.location, false, matrix.pMatrix.data);
	gl.uniformMatrix3fv(program.uniform.nMatrix.location, false, matrix.nMatrix.data);
	gl.uniform1f(program.uniform.elapsedTime.location, frame * 0.08);
	gl.uniform3fv(program.uniform.windDir.location, windDir.toTypedArray());
	gl.uniform3fv(program.uniform.windForce.location, windForce.toTypedArray());
	gl.uniform3fv(program.uniform.lightDirection.location, light.direction);
	gl.uniform4fv(program.uniform.diffuse.location, material.diffuse);
	
	gl.activeTexture(gl.TEXTURE0);
	
	// 頂点バッファ
	for(var i = 0; i < model.meshes.length; i++) {
		var mesh = model.meshes[i],
			mat = model.materials[mesh.material];
		
		gl.bindTexture(gl.TEXTURE_2D, mat.tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, mat.wrap);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mat.wrap);
		
		setupAttribute(program, mesh.vbo);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
		var size = mesh.indexStream.length;
		gl.drawElements(gl.TRIANGLES, i === 0 ? (grassSlider.value * size / 3 ^ 0) * 3 : size, gl.UNSIGNED_SHORT, 0);
	}
	
	frame++;
	
	gl.flush();
	getError(gl);
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
		if(elm.value > 1.0) elm.value = 1.0;
		if(elm.value < 0.0) elm.value = 0.0;
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
	elm.value = 1.0;
	return elm;
}
