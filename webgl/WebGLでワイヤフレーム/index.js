(function() {
	'use strict';

	var gl,
		program = [],
		camera = {},
		matrix = {},
		frame = 0;

	camera.position = new Vector3(0, 5.0, 14.0);
	camera.target = new Vector3(0, 0.3, 0);
	camera.up = new Vector3(0, 1, 0);
	matrix.mMatrix = new Matrix4();
	matrix.nMatrix = new Matrix4();
	matrix.vMatrix = new Matrix4();
	matrix.mvMatrix = new Matrix4();
	matrix.pMatrix = new Matrix4();

	var color0 = new Float32Array([0.0, 0.0, 0.0, 1.0]),
		color1 = new Float32Array([1.0, 1.0, 1.0, 1.0]);
	
	var pos = [
		new Vector3(0, 0, 0),
		new Vector3(0, 2, 0),
		new Vector3(0, -2, 0),
		new Vector3(2, 0, 0),
		new Vector3(-2, 0, 0)
	];
	// WebGLのコンテキスト取得
	gl = initContext('canvas');
	
	var model = createCube();
	
	initBuffer(gl, model);
	program = initShader(gl, 'shader-fs', 'shader-vs');
	
	gl.enable(gl.BLEND);
	gl.depthFunc(gl.LEQUAL);

	Matrix4.perspective(45.0 * Math.PI / 180.0, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000.0, matrix.pMatrix);
	Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);
	program.uniform['pMatrix'].value = matrix.pMatrix.data;
	
	var timer = setAnimationFrame(render, 1000 / 30);
	
	function drawCube(pos) {
		// 行列設定
		Matrix4.rotateY(frame * 0.05, matrix.mMatrix);
		matrix.mMatrix.data[12] = pos.x;
		matrix.mMatrix.data[13] = pos.y;
		matrix.mMatrix.data[14] = pos.z;
		matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
		
		// ユニフォーム設定
		program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
		
		// 頂点バッファ
		for(var i = 0; i < model.meshes.length; i++) {
			var mesh = model.meshes[i];
			
			setupAttribute(program, mesh.vbo);
			
			program.uniform['color'].value = color1;
			setupUniform(program);
			
//			gl.blendFunc(gl.ZERO, gl.ONE);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
			gl.drawElements(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
			
			program.uniform['color'].value = color0;
			setupUniform(program);
			
			gl.blendFunc(gl.ONE, gl.ZERO);
			gl.drawElements(gl.LINE_LOOP, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
		}
	}
	
	// 描画
	function render() {
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		for(var i = 0; i < 5; i++) {
			drawCube(pos[i]);
		}
		frame++;

		gl.flush();
	}

	gl.canvas.addEventListener('click', function() {
		timer.toggle();
	});
    
    function createCube(x) {
        
        x = x || 1.0;

        return {
            meshes: [
                {
                    indexStream: [
                        0, 1, 2, 0, 2, 3,
                        4, 6, 5, 4, 7, 6,
                        8, 10, 9, 8, 11, 10,
                        12, 13, 14, 12, 14, 15,
                        16, 18, 17, 16, 19, 18,
                        20, 21, 22, 20, 22, 23
                    ],
                    vertexStream: {
                        position: [
                            -x, x, -x,
                            -x, x,  x,
                             x, x,  x,
                             x, x, -x,
                            
                            -x, -x, -x,
                            -x, -x,  x,
                             x, -x,  x,
                             x, -x, -x,
                            
                            -x, -x, x,
                            -x,  x, x,
                             x,  x, x,
                             x, -x, x,
                            
                            -x, -x, -x,
                            -x,  x, -x,
                             x,  x, -x,
                             x, -x, -x,
                        
                            x, -x, -x,
                            x, -x,  x,
                            x,  x,  x,
                            x,  x, -x,
                            
                            -x, -x, -x,
                            -x, -x,  x,
                            -x,  x,  x,
                            -x,  x, -x   
                        ]
                    }
                }
            ]
        };
    }
    
}());
