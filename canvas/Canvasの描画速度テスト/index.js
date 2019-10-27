var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

var image = ctx.createImageData(canvas.width, canvas.height);

var cx = canvas.width / 2,
    cy = canvas.height / 2;

var aTime = document.getElementById('a-time'),
    bTime = document.getElementById('b-time'),
    cTime = document.getElementById('c-time');

function setPixel(x, y, color) {
    var i = (y * image.width + x) * 4,
        d = image.data;
    d[i + 0] = color >> 24 & 0xFF;
    d[i + 1] = color >> 16 & 0xFF;
    d[i + 2] = color >> 8 & 0xFF;
    d[i + 3] = color & 0xFF;
}

function drawCircleA(x, y, r, color) {
    var sx = x - r,
        sy = y - r,
        ex = x + r,
        ey = y + r;
    
    for(var i = sy; i <= ey; i++) {
        for(var j = sx; j <= ex; j++) {
            var d = (j - x) * (j - x) + (i - y) * (i - y);
            if(d <= r * r) {
                setPixel(j, i, color);
            }
            
        }
    }
    
    ctx.putImageData(image, 0, 0);
}

function drawCircleB(x, y, r, color) {
    var sx = x - r | 0,
        sy = y - r | 0,
        ex = x + r | 0,
        ey = y + r | 0;
    
    var data = image.data,
        w = image.width;
    
    for(var i = sy; i <= ey; i++) {
        for(var j = sx; j <= ex; j++) {
            var d = (j - x) * (j - x) + (i - y) * (i - y);
            if(d <= r * r) {
                var k = (i * w + j) * 4 | 0;
                data[k + 0] = color >> 24 & 0xFF;
                data[k + 1] = color >> 16 & 0xFF;
                data[k + 2] = color >> 8 & 0xFF;
                data[k + 3] = color & 0xFF;
            }
            
        }
    }
    
    ctx.putImageData(image, 0, 0);
}

function drawCircleC(x, y, r, color) {
    var sx = x - r | 0,
        sy = y - r | 0,
        ex = x + r | 0,
        ey = y + r | 0;
    
    var w = image.width;
    var data = new Uint32Array(image.data.buffer);
    var r2 = r * r;
    
    for(var i = sy; i <= ey; i++) {
        var k = i * w + sx;
        
        var dy = (i - y) * (i - y);
        
        for(var j = sx; j <= ex; j++) {
            var dx = (j - x) * (j - x); 
            var d = dx + dy;
            if(d <= r2) {
                data[k] = color;
            }
            k++;
        }
    }
    //image.data.set(new Uint8ClampedArray(data.buffer));
    ctx.putImageData(image, 0, 0);
}

ctx.clearRect(0, 0, canvas.width, canvas.height);

document.getElementById('a').addEventListener('click', function() {
    console.time('drawCircleA');
    var t = Date.now();
    drawCircleA(cx, cy, cx - 10, 0xFF0000FF);
    t = (Date.now() - t);
    console.timeEnd('drawCircleA');
    aTime.textContent = '' + t + 'ms';
});

document.getElementById('b').addEventListener('click', function() {
    console.time('drawCircleB');
    var t = Date.now();
    drawCircleB(cx, cy, cx - 10, 0xFF00FFFF);
    t = (Date.now() - t);
    console.timeEnd('drawCircleB');
    bTime.textContent = '' + t + 'ms';
});

document.getElementById('c').addEventListener('click', function() {
    console.time('drawCircleC');
    var t = Date.now();
    drawCircleC(cx, cy, cx - 10, 0xFFFFFF00);
    t = (Date.now() - t);
    console.timeEnd('drawCircleC');
    cTime.textContent = '' + t + 'ms';
});
