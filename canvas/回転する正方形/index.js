(function() {
    'use strict';
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width,
        h = canvas.height;
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    
    function render(f) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, w, h);
        
        var cx = w / 2,
            cy = h / 2;
        
        for(var i = 1; i < 32; i++) {
            ctx.strokeStyle = 'rgba(0,0,0,' + i / 64 + ')';
            ctx.beginPath();
            var t = i * 10 + f * 0.002 * i,
                r = w * 0.3 + i * 2,
                x = Math.cos(t) * r + cx,
                y = Math.sin(t) * r + cy;
            ctx.moveTo(x, y);
            for(var j = 1; j < 4; j++) {
                x = Math.cos(t + j * Math.PI * 0.5) * r + cx;
                y = Math.sin(t + j * Math.PI * 0.5) * r + cy;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    var frame = 0;
    
    setInterval(function() {
        render(frame);
        frame++;
    }, 1000 / 30);
    
})();