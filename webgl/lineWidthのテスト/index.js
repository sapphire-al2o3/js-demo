var gl = initContext('canvas'),
    program = initShader(gl, 'shader-fs', 'shader-vs');


var model = {};
model.meshes = [];
model.meshes.push({
    vertexStream: {
        position: [
            -100, 100, 0,
            100, 100, 0,
            100, -100, 0,
            -100, -100, 0
        ]
    },
    indexStream: [0, 1, 2, 3]
});

initBuffer(gl, model);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

setupAttribute(program, model.meshes[0].vbo);
gl.lineWidth(4.0);
gl.drawArrays(gl.LINE_LOOP, 0, 4);
gl.flush();
