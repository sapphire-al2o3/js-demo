var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

var image0 = new Image();
image0.src = 'photo_065.jpg';
image0.onload = function() {
    ctx.clearRect(0, 0, 400, 400);
    //ctx.drawImage(image0, 0, 0, 400, 400);
};

var image1 = new Image();
image1.src = 'tex.jpg';
image1.onload = function() {
    transition();
};

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

var f = 0.0,
    d = 0.01;
function transition() {
    ctx.clearRect(0, 0, 400, 400);
    ctx.globalAlpha = clamp(1.0 - f, 0.0, 1.0);
    ctx.drawImage(image1, 0, 0, 400, 400);
    //ctx.fillRect(0, 0, 100, 100);
    ctx.globalAlpha = clamp(f, 0.0, 1.0);
    ctx.drawImage(image0, 0, 0, 400, 400);
    f += d;
    if(f > 1.0) {
	d = -0.01;
    } else if(f < 0.0) {
	d = 0.01;
    }
    setTimeout(arguments.callee, 1000.0 / 10.0);
}