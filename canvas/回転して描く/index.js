(function() {
    'use strict';
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width,
        h = canvas.height;
    
    var px = 0,
        py = 0,
        rect,
        rot = 32,
        down = false;
    
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = 'rgba(250, 100, 0, 0.4)';
    
    function mousemove(e) {
        if(down) {
            var x = e.pageX - rect.left + 0.5,
                y = e.pageY - rect.top + 0.5;
            
            render(x, y, px, py);
            
            px = x;
            py = y;
        }
    }
    
    function mouseup(e) {
        if(down) {
            down = false;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        }
    }
    
    function mousedown(e) {
        rect = e.target.getBoundingClientRect();
        px = e.pageX - rect.left + 0.5;
        py = e.pageY - rect.top + 0.5;
        down = true;
        
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    }
    
    canvas.addEventListener('mousedown', mousedown);
    
    document.getElementById('reset').addEventListener('click', function() {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, w, h);
    });
    document.getElementById('r32').addEventListener('click', function(e) {
        rot = 32;
    });
    document.getElementById('r16').addEventListener('click', function(e) {
        rot = 16;
    });
    document.getElementById('r8').addEventListener('click', function(e) {
        rot = 8;
    });
    document.getElementById('r64').addEventListener('click', function(e) {
        rot = 64;
    });
    document.getElementById('r3').addEventListener('click', function(e) {
        rot = 3;
    });
    function render(x, y, px, py) {
        
        var r = Math.PI * 2.0 / rot,
            c = Math.cos(r),
            s = Math.sin(r),
            tx = (w + h * s - w * c) * 0.5,
            ty = (h - w * s - h * c) * 0.5;
        
        for(var i = 0; i < rot; i++) {
            ctx.transform(c, s, -s, c, tx, ty);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
            
        }
        ctx.resetTransform();
    }
})();