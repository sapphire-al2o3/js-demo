var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

function drawHeart(ctx, x, y, h) {
    var h2 = h * 2;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x - h, y);
    ctx.bezierCurveTo(x - h2, y - h, x - h, y - h2, x, y - h);
    ctx.bezierCurveTo(x + h, y - h2, x + h2, y - h, x + h, y);
    ctx.closePath();
}

ctx.fillStyle = '#F00';
drawHeart(ctx, 200, 200, 100);
ctx.fill();