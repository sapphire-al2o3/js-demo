(function() {
    'use strict';
    
    var ctx = document.getElementById('graph').getContext('2d'),
        w = ctx.canvas.width,
        h = ctx.canvas.height;
    
    function plot2Dp(ctx, f, w, h, itr) {
        itr = itr === undefined ? 80 : itr;
        ctx.beginPath();
        var b = f(0);
        ctx.moveTo(b.x + w * 0.5, b.y + h * 0.5);
        
        for (var i = 1; i <= itr; i++) {
            var p = f(i / itr * Math.PI * 2);
            ctx.lineTo(p.x + w * 0.5, p.y + h * 0.5);
        }
        ctx.stroke();
    }
    
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
        
        function sign(x) {
            return x >= 0 ? 1 : -1;
        }
        
        plot2Dp(ctx, function (t) {
            var c = Math.cos(t),
                s = Math.sin(t),
                x = sign(c) * a * Math.pow(Math.abs(c), r) * 100,
                y = sign(s) * b * Math.pow(Math.abs(s), r) * 100;
            return {
                x: x,
                y: y
            };
        }, w, h);
        
        ctx.fillText('|x/a|^r+|y/b|^r=1', 10, 16);
    }

    var a = 1.0;
    document.body.appendChild(createSlider('a', a, function (v) {
        a = v;
    }));

    var b = 1.0;
    document.body.appendChild(createSlider('b', b, function (v) {
        b = v;
    }));

    var r = 1.0;
    document.body.appendChild(createSlider('r', r / 4, function (v) {
        r = v * 4.0;
    }));
    
    setAnimationFrame(function(d) {
        renderGraph(d);
    }, 1000 / 30);
    
})();