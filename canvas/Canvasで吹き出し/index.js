var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height;

ctx.shadowBlur = 8.0;
ctx.shadowOffsetX = 1.0;
ctx.shadowOffsetY = 1.0;
ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
ctx.fillStyle = '#FFF';
ctx.clearRect(0, 0, w, h);
ctx.beginPath();
roundRect(ctx, 10, 10, 200, 200, 12);
ctx.moveTo(160, 150);
ctx.lineTo(60, 150);
ctx.lineTo(150, 240);
ctx.closePath();
ctx.fill();

function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x, y + r);
    ctx.lineTo(x, y + h - r);
    ctx.quadraticCurveTo(x, y + h, x + r, y + h);
    ctx.lineTo(x + w - r, y + h);
    ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    ctx.lineTo(x + w, y + r);
    ctx.quadraticCurveTo(x + w, y, x + w - r, y);
    ctx.lineTo(x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
}
