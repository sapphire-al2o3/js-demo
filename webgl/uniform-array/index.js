(function() {
    'use strict';
    
    const gl = initContext('canvas'),
        width = gl.canvas.width,
        height = gl.canvas.height;
    
    const program = initShader(gl, 'shader-fs', 'shader-vs');
    
    const buffer = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);
    
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    
    const indexBuffer = new Int8Array([0, 1, 2, 3]);
    
    const indices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, indices);
    gl.bufferData(gl.ARRAY_BUFFER, indexBuffer, gl.STATIC_DRAW);
    
    const l = gl.getAttribLocation(program, 'index');
    gl.vertexAttribPointer(1, 1, gl.BYTE, false, 0, 0);
    
    gl.uniform2f(gl.getUniformLocation(program, 'screen'), width, height);
    
    // [0]とかで配列に値を設定できる
    const colorLoc0 = gl.getUniformLocation(program, 'colors[0]');
    gl.uniform4f(colorLoc0, 1.0, 1.0, 1.0, 1.0);
    const colorLoc1 = gl.getUniformLocation(program, 'colors[1]');
    gl.uniform4f(colorLoc1, 1.0, 0.0, 0.0, 1.0);
    var colorLoc2 = gl.getUniformLocation(program, 'colors[2]');
    gl.uniform4f(colorLoc2, 0.0, 1.0, 0.0, 1.0);
    var colorLoc3 = gl.getUniformLocation(program, 'colors[3]');
    gl.uniform4f(colorLoc3, 0.0, 0.0, 1.0, 1.0);
    
    const time = Date.now();
    const timeLoc = gl.getUniformLocation(program, 'time');

    const timer = setAnimationFrame(render, 0);
    
    function render() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, width, height);
        gl.uniform1f(timeLoc, Date.now() - time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        gl.flush();
    }
    
})();