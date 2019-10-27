(function() {
    'use strict';
    
    function plot2d(ctx, f, w, h, itr) {
        itr = itr === undefined ? 40 : itr;
        ctx.beginPath();
        ctx.moveTo(0, h - (f(-Math.PI) + 1) * h * 0.5);
        for(var i = 1; i <= 40; i++) {
            var t = i / 40,
                x = (t * 2 - 1) * Math.PI;
            ctx.lineTo(t * w, h - (f(x) + 1) * h * 0.5);
        }
        ctx.stroke();
    }
    
    var factor = 1.0;
    var slider = createSlider('factor', factor, function(v) {
        factor = v;
    });
    document.body.appendChild(slider);
    
    var ctx = document.getElementById('graph').getContext('2d'),
        w = ctx.canvas.width,
        h = ctx.canvas.height;
    
    function renderGraph() {
        ctx.font = '9pt consolas';
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#AAA';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.5 + 0.5);
        ctx.lineTo(w, h * 0.5 + 0.5);
        ctx.moveTo(w * 0.5 + 0.5, 0);
        ctx.lineTo(w * 0.5 + 0.5, h);
        ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#444';
        plot2d(ctx, function(x) {
            var d = Math.cos(x) * factor + (1 - factor);
            return d;
        }, w, h);
    }
    renderGraph();
    
    var gl = initContext('canvas');
    
    var m = createSphere(32);
    var program = initShader(gl, 'shader-fs', 'shader-vs');
    var camera = {},
        matrix = {},
        light = [1.0, 1.0, 0.0];
    camera.position = new Vector3(0, 2.0, 4.0);
    camera.target = new Vector3(0.0, 0.0, 0.0);
    camera.up = new Vector3(0, 1, 0);
    matrix.mMatrix = new Matrix4();
    matrix.vMatrix = Matrix4.lookAt(camera.position, camera.target, camera.up);
    matrix.pMatrix = Matrix4.perspective(45.0 * Math.PI / 180.0, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
    matrix.nMatrix = matrix.vMatrix.toMatrix3().inverse();
    
    initBuffer(gl, m);
    
    gl.clearColor(0.95, 0.95, 0.95, 1.0);
    
    var time = 0;
    
    function render(d) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var mesh = m.meshes[0];
        
        time += d;
        
        light[0] = Math.cos(time * 0.001);
        light[2] = Math.sin(time * 0.001);
        
        program.uniform.mvMatrix.value = matrix.vMatrix.data;
        program.uniform.pMatrix.value = matrix.pMatrix.data;
        program.uniform.nMatrix.value = matrix.nMatrix.data;
        program.uniform.light.value = light;
        program.uniform.factor.value = factor;
        program.uniform.diffuse.value = [0.0, 0.7, 1.0];
        //program.uniform.ambient.value = [0.0, 0.3, 0.5];
        
        setupUniform(program);
        setupAttribute(program, mesh.vbo);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
		var size = mesh.indexStream.length;
        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0);
        
        gl.flush();
    }
    
    
    setAnimationFrame(function(d) {
        renderGraph();
        render(d);
    }, 1000 / 60);
})();
