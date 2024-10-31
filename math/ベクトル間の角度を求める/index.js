(function() {
    
    var points = [];
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height,
        cx = width / 2,
        cy = height / 2,
        p0 = { x: 100, y: 100 },
        p1 = { x: 0, y: -100 };
    
    var down = false,
        click = { x: 0, y: 0 },
        mouse = { x: 0, y: 0 },
        hover,
        active;
    
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
    
    // ベクトルの正規化
    function normalize(v) {
        var n = 1.0 / Math.sqrt(v.x * v.x + v.y * v.y);
        return { x: v.x * n, y: v.y * n }
    }
    
    function distance(a, b) {
        var dx = a.x - b.x,
            dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // 円を描画する
    function drawCircle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // ベクトル間の角度を求める
    function angle(v0, v1) {
        return Math.atan2(v0.x * v1.y - v1.x * v0.y, v0.x * v1.x + v0.y * v1.y);
    }
    
    function fontStyle(fontSize, fontFamily) {
        return '' + fontSize + 'px ' + fontFamily;
    }
    
    function update() {
        if(!active) {
            hover = null;
            var p = {};
            p.x = p0.x + cx;
            p.y = p0.y + cy;
            if(distance(mouse, p) < 12) {
                hover = p0;
            }
            p.x = p1.x + cx;
            p.y = p1.y + cy;
            if(distance(mouse, p) < 12) {
                hover = p1;
            }
        } else {
            var p = {};
            p.x = mouse.x - cx;
            p.y = mouse.y - cy;
            var n = normalize(p);
            var l = Math.sqrt(active.x * active.x + active.y * active.y);
            active.x = l * n.x;
            active.y = l * n.y;
            
        }
        
        render();
    }
    
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#ffb2db';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p0.x + cx, p0.y + cy);
        ctx.stroke();
        
        ctx.fillStyle = '#ff7dc3';
        drawCircle(p0.x + cx, p0.y + cy, hover === p0 ? 12 : 8);
        
        ctx.strokeStyle = '#95deff';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p1.x + cx, p1.y + cy);
        ctx.stroke();
        
        ctx.fillStyle = '#6ad1ff';
        drawCircle(p1.x + cx, p1.y + cy, hover === p1 ? 12 : 8);
        
        ctx.fillStyle = '#daff3e';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, 40, Math.atan2(p1.y, p1.x), Math.atan2(p0.y, p0.x));
        ctx.fill();
        
        var a = angle(p1, p0);
        a = a < 0 ? a + Math.PI * 2 : a;
        ctx.font = fontStyle(24, 'Consolas');
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ff7f11';
        ctx.fillText((a * 180 / Math.PI).toFixed(1), 220, 150);
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