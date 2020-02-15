(function() {
    CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
        this.beginPath();
        this.arc(x, y, r, 0.0, Math.PI * 2.0, false);
        this.fill();
    };
    CanvasRenderingContext2D.prototype.strokeLine = function(x0, y0, x1, y1) {
        this.beginPath();
        this.moveTo(x0, y0);
        this.lineTo(x1, y1);
        this.stroke();
    };
    function distance(a, b) {
        var dx = b.x - a.x,
            dy = b.y - a.y;
        return dx * dx + dy * dy;
    }
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        node = [],
        path = [],
        down = false,
        p = {x: 0, y: 0},
        p0 = {x: 100, y: 100},
        p1 = {x: 150, y: 150},
        p2 = {x: 200, y: 200},
        p3 = {x: 250, y: 250},
        shapes = [p0, p1, p2, p3],
        x = 20.0,
        k = 0.002,
        active = null;
    
    function update(frame) {
        p0.hit = distance(p, p0) < 6 * 6;
        if(down) {
            if(p0.hit) {
                active = p0;
            }
            if(active) {
                active.x = p.x;
                active.y = p.y;
            }
        }
        
        var e = p1;
        //					if(e) {
        for(var i = 1; i < shapes.length; i++) {
            var dx = shapes[i].x - shapes[i - 1].x,
                dy = shapes[i].y - shapes[i - 1].y,
                    d = Math.sqrt(distance(shapes[i - 1], shapes[i])) - x,
                        f = d * k;
            
            shapes[i].x -= dx * f;
            shapes[i].y -= dy * f;
        }
    }
    
    function render() {
        ctx.clearRect(0, 0, width, height);
        
        var hit = false;
        
        shapes.forEach(function(e) {
            var r = 8;
            if(e === p2 || e === p1) return;
            ctx.fillStyle = e === p0 ? '#094' : '#ADD';
            ctx.fillCircle(e.x, e.y, r);
            
            if(e.hit) {
                hit = true;
            }
        });
        
        canvas.style.cursor = p0.hit || active ? 'pointer' : 'default';
        
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();
    }
    
    setInterval(function() {
        update();
        render();
    }, 1000 / 30);
    
    var rect = canvas.getBoundingClientRect();
    
    canvas.addEventListener('mousedown', function(e) {
        var rect = e.target.getBoundingClientRect();
        p.x = e.clientX - rect.left;
        p.y = e.clientY - rect.top;
        down = true;
        
    }, false);
    
    canvas.addEventListener('mousemove', function(e) {
        var rect = e.target.getBoundingClientRect();
        p.x = e.clientX - rect.left;
        p.y = e.clientY - rect.top;
        e.stopPropagation();
    }, false);
    
    canvas.addEventListener('mouseup', function(e) {
        down = false;
        active = false;
    }, false);
    
    canvas.addEventListener('mouseout', function(e) {
        down = false;
        active = false;
    }, false);
    
})();