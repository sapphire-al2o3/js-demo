(function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width,
        h = canvas.height,
        cx = w / 2,
        cy = h / 2;
    
    var stop = false,
        active = null,
        down = false,
        click = { x: 0, y: 0 },
        mouse = { x: 0, y: 0 },
        points = [
            { x: cx - 60, y: cy - 60 },
            { x: cx - 60, y: cy + 60 },
            { x: cx + 60, y: cy + 60 },
            { x: cx + 60, y: cy - 60 }
        ];
    
    
    canvas.addEventListener('mousedown', function(e) {
        var rect = e.target.getBoundingClientRect();
        click.x = e.clientX - rect.left;
        click.y = e.clientY - rect.top;
        active = hover;
        down = true;
    }, false);
    
    canvas.addEventListener('mouseup', function(e) {
        down = false;
        active = null;
    }, false);
    
    canvas.addEventListener('mouseout', function(e) {
        down = false;
        active = null;
    }, false);
    
    canvas.addEventListener('mousemove', function(e) {
        var rect = e.target.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        if(down) {
            click.x = mouse.x;
            click.y = mouse.y;
        }
        e.stopPropagation();
    }, false);
    
    var frame = 0;
    
    function render() {
        ctx.clearRect(0, 0, 400, 400);
        
        ctx.fillStyle = '#B8FF6C';
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(frame * 0.015);
        ctx.fillRect(-80, -80, 160, 160);
        ctx.restore();
        
        ctx.fillStyle = '#73CEFF';
        ctx.beginPath();
        for(var i = 0; i < points.length; i++) {
            var r = 50;
            if(hover === points[i]) r = 55;
            ctx.arc(points[i].x, points[i].y, r, 0, Math.PI * 2, false);
            ctx.closePath();
        }
        ctx.fill();
    }
    
    
    function distance(a, b) {
        var dx = a.x - b.x,
            dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    function update() {
        
        if(!active) {
            hover = null;
            for(var i = 0; i < points.length; i++) {
                if(distance(mouse, points[i]) < 55) {
                    hover = points[i];
                    break;
                }
            }
        } else {
            active.x = mouse.x;
            active.y = mouse.y;
        }
        
        render();
        
        if(!stop) {
            frame++;
        }
    }
    
    var setAnimFrame = function(callback, interval) {
        var elapsed = 0,
            time = Date.now(),
            stop = false;
        
        interval = interval || 0;
        
        var update = function() {
            var delta = Date.now() - time;
            time = Date.now();
            elapsed += delta;
            if(elapsed >= interval) {
                var n = elapsed / interval ^ 0;
                elapsed -= n * interval;
                callback();
            }
            if(!stop) {
                requestAnimationFrame(update);
            }
        };
        
        update();
    };
    setAnimFrame(update);
})();
