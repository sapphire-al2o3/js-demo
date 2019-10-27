var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    mouse = {x: 0, y: 0},
    delta = new Vector2(0, 0),
    pos = new Vector2(0, 0),
    down = false,
    active = false,
    shapes = [],
    p = [
        174,110,
        155,130,
        267,191,
        174,303,
        126,337,
        114,372,
        203,335,
        300,292,
        266,48,
        111,83
    ];
  
function drawShape(ctx, d) {
    ctx.beginPath();
    ctx.moveTo(d[0], d[1]);
    for(var i = 2, n = d.length - 6; i < n; i += 6) {
        ctx.bezierCurveTo(d[i], d[i + 1], d[i + 2], d[i + 3], d[i + 4], d[i + 5]);
    }
    ctx.bezierCurveTo(d[i], d[i + 1], d[i + 2], d[i + 3], d[0], d[1]);
    ctx.closePath();
}

ctx.lineWidth = 2.0;
ctx.font = '9pt consolas';
  
canvas.addEventListener('mousedown', function(e) {
    var rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    pos.x = mouse.x;
    pos.y = mouse.y;
    down = true;
}, false);
canvas.addEventListener('mouseup', function(e) {
    down = false;
    active = false;
}, false);
canvas.addEventListener('mouseout', function(e) {
    down = false;
    active = false;
}, false);
canvas.addEventListener('mousemove', function(e) {
    var rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    if(down) {
        delta.x = mouse.x - pos.x;
        delta.y = mouse.y - pos.y;
        pos.x = mouse.x;
        pos.y = mouse.y;
    }
    
    if(mouse.x !== 0 || mouse.y !== 0) {
        draw();
    }
}, false);
  
var draw = function() {
    
    ctx.clearRect(0, 0, 400, 400);
    
    drawShape(ctx, p);
    if(ctx.isPointInPath(mouse.x, mouse.y)) {
        ctx.fillStyle = '#FF88AA';
        ctx.fill();
        
        if(down) {
            active = true;
        }
    } else {
        ctx.fillStyle = '#FFAADD';
        ctx.fill();
    }
    
    if(active) {
        for(var i = 0, n = p.length; i < n; i += 2) {
            p[i] += delta.x;
            p[i + 1] += delta.y;
        }
    }
};

draw();

