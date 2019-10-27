var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height,
    cx = w / 2,
    cy = h / 2;

function render(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    var r = 100,
        r2 = 85;
    ctx.moveTo(Math.cos(t) * r + cx, Math.sin(t) * r + cy);
    ctx.lineTo(Math.cos(t) * r2 + cx, Math.sin(t) * r2 + cy);
    for(var i = 1; i < 32; i++) {
        var a = Math.PI * i / 16 + t,
            c = Math.cos(a),
            s = Math.sin(a),
            x = c * r + cx,
            y = s * r + cy,
            x2 = c * r2 + cx,
            y2 = s * r2 + cy;
        if(i & 1) {
            ctx.lineTo(x2, y2);
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
            ctx.lineTo(x2, y2);
        }
    }
    ctx.closePath();
    ctx.fill();
}
var t = 0.0;
setInterval(function() {
    render(t);
    t += 0.02;
}, 33);
