var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    down = false,
    mouse = {},
    color = '#000',
    left = canvas.getBoundingClientRect().left,
    top = canvas.getBoundingClientRect().top,
    option = {};

option.zoom = 12;
option.imageWidth = 64;
option.imageHeight = 64;
option.canvasWidth = canvas.width;
option.canvasHeight = canvas.height;
option.canvasLeft = 0;
option.canvasTop = 0;
option.grid = {
    color0: '#808080',
    color1: '#C0C0C0',
    size: 16
};

drawGrid(ctx);
drawEllipse(ctx, 0, 0, 12, 22);

canvas.addEventListener('mousedown', function(e) {
    var x = e.offsetX,
	y = e.offsetY;// - top;
    mouse.x = x / option.zoom ^ 0;
    mouse.y = y / option.zoom ^ 0;
    //drawDot(ctx, x, y);
    down = true;
}, false);

document.addEventListener('mousemove', function(e) {
    if(down) {
        var x = e.offsetX / option.zoom ^ 0,
            y = e.offsetY / option.zoom ^ 0;
        ctx.clearRect(0, 0, option.canvasWidth, option.canvasHeight);
        drawGrid(ctx);
        drawEllipse(ctx, mouse.x, mouse.y, x, y);
        //mouse.x = x;
        //mouse.y = y;
    }
}, false);

document.addEventListener('mouseup', function(e) {
    down = false;
}, false);

function draw() {
    ctx.clearRect(0, 0, option.canvasWidth, option.canvasHeight);
    drawGrid(ctx);
    drawEllipse(ctx, 0, 0, 10, 10);
}

function drawDot(ctx, x, y) {
    var w = option.zoom,
        h = option.zoom;
    ctx.beginPath();
    ctx.rect(x * w, y * h, w, h);
    ctx.fill();
}

function eps(x0, y0, x1, y1, x, y) {
    var dx = (x1 - x0),
        dy = (y1 - y0),
        dx2 = dx * dx,
        dy2 = dy * dy,
        xx = 2 * x - x0 - x1,
        yy = 2 * y - y0 - y1,
        e = dx2 * dy2 - dy * dy * xx * xx - dx * dx * yy * yy;
    return e;
}

function drawEllipse(ctx, x0, y0, x1, y1) {
    var dx = x1 - x0,
        dy = y1 - y0,
        dx2 = dx * dx,
        dy2 = dy * dy,
        a = dx >> 1,
        b = dy >> 1,
        w = option.zoom,
        h = option.zoom;
    
    console.log(x0, y0, x1, y1, w, h);
    ctx.beginPath();
    var x = ((x0 + x1) >> 1) * w;
    ctx.rect(x, y0 * h, w, h);
    ctx.rect(x, y1 * h, w, h);
    if((dx & 1)) {
        ctx.rect(x + w, y0 * h, w, h);
        ctx.rect(x + w, y1 * h, w, h);
    }
    
    var y = ((y0 + y1) >> 1) * h;
    ctx.rect(x0 * w, y, w, h);
    ctx.rect(x1 * w, y, w, h);
    if((dy & 1)) {
        ctx.rect(x0 * w, y + h, w, h);
        ctx.rect(x1 * w, y + h, w, h);
    }
    
    var a2 = a * a,
    b2 = b * b,
    f = b2 *(-2 * a + 1) + 2 * a2,
    o = x * b2 / a2,
    cx = x0 + a,
    cy = y0 + b,
    cx1 = x1 - a,
    cy1 = y1 - b,
    n = a / Math.sqrt(b2 /a2 + 1);
    
    y = y1;
    x = ((x0 + x1) >> 1);
    for(var i = 0; i < n; i++) {
        var e0 = eps(x0 + 0.5, y0 + 0.5, x1 + 0.5, y1 + 0.5, x - 0.5, y + 0.5),
            e1 = eps(x0 + 0.5, y0 + 0.5, x1 + 0.5, y1 + 0.5, x - 0.5, y - 1 + 0.5);
        //e0 = eps(x0, y0, x1, y1, x, y),
        //e1 = eps(x0, y0, x1, y1, x, y - 1);
        console.log(e0, e1);
        if(Math.abs(e0) < Math.abs(e1)) {
            x = x - 1;
        } else {
            x = x - 1;
            y = y - 1;
        }
        ctx.rect(x * w, y * h, w, h);
        ctx.rect((x1 - x + x0) * w, y * h, w, h);
        ctx.rect(x * w, (y1 - y + y0) * h, w, h);
        ctx.rect((x1 - x + x0) * w, (y1 - y + y0) * h, w, h);
        ctx.fill();
    }
    
    if(y - 1 <= cy) {
        ctx.fill();
        return;
    }
    
    
    y = (y0 + y1) >> 1;
    x = x1;
    n = b / Math.sqrt(a2 /b2 + 1);
    var left = x0 + 0.5,
        right = x1 + 0.5,
        top = y0 + 0.5,
        bottom = y1 + 0.5;
    for(i = 0; i < n; i++) {
        e0 = eps(x0 + 0.5, y0 + 0.5, x1 + 0.5, y1 + 0.5, x + 0.5, y - 1 + 0.5);
        e1 = eps(x0 + 0.5, y0 + 0.5, x1 + 0.5, y1 + 0.5, x - 1 + 0.5, y - 1 + 0.5);
        if(Math.abs(e0) < Math.abs(e1)) {
            y = y - 1;
        } else {
            x = x - 1;
            y = y - 1;
        }
        ctx.rect(x * w, y * h, w, h);
        ctx.rect((x1 - x + x0) * w, y * h, w, h);
        ctx.rect(x * w, (y1 - y + y0) * h, w, h);
        ctx.rect((x1 - x + x0) * w, (y1 - y + y0) * h, w, h);
    }
    ctx.fill();
}

function drawGrid(ctx) {
    var n = 64,
        size = option.zoom,
        w = option.canvasWidth,
        h = option.canvasHeight;
    ctx.strokeStyle = option.grid.color1;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(var i = 1; i < n; i++) {
        var x = size * i - 0.5;
        ctx.moveTo(0.5, x);
        ctx.lineTo(w + 0.5, x);
        ctx.moveTo(x, 0.5);
        ctx.lineTo(x, h + 0.5);
    }
    ctx.stroke();
}