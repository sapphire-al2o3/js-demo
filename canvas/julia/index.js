var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    img = ctx.createImageData(canvas.width, canvas.height);

function julia(x, y, a, b) {
    var n = 0,
        zx = x,
        zy = y,
        t = 0.0;
    while(n < 255) {
        t = zx * zx - zy * zy + a;
        zy = 2 * zx * zy + b;
        zx = t;
        if(zx * zx + zy * zy > 4) {
            break;
        }
        n++;
    }
    return n;
}
console && console.time('draw');
var x, y,
    index = 0,
    data = img.data,
    cx = img.width / 2,
    cy = img.height / 2,
    t,
    m,
    zx, zy;
for(var i = 0, h = img.height; i < h; i++) {
    y = 2 * (i - cx) / h;
    for(var j = 0, w = img.width; j < w; j++) {
        x = 2 * (j - cy) / w;
        m = julia(x, y, -0.345, 0.654);
        
        data[index] = m;
        data[index + 1] = m * 10 & 255;
        data[index + 2] = m * 20 & 255;
        data[index + 3] = 255;
        
        index += 4;
    }
}
console && console.timeEnd('draw');
ctx.putImageData(img, 0, 0);
