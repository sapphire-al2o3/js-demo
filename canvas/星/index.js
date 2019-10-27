var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');


function drawStar(ctx, offsetX, offsetY, r0, r1) {
    ctx.beginPath();
    
    for(var i = 0; i < 10; i++) {
        var rad = i * Math.PI * 2 / 10 + 270 * Math.PI / 180,
            r = i & 1 ? r1 : r0,
            x = r * Math.cos(rad) + offsetX,
            y = r * Math.sin(rad) + offsetY;
        
        ctx.lineTo(x, y);
    }
    
    ctx.closePath();
}

function grad(ctx, h, r) {
    var g = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    g.addColorStop(0, hsla(h, 100, 95, 1));
    g.addColorStop(1, hsla(h, 100, 70, 1));
    return g;
}

function hsla(h, s, l, a) {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}

ctx.lineWidth = 4.0;
drawStar(ctx, 200, 200, 100, 50);

var frame = 0;

var stars = [];

for(var i = 0; i < 16; i++) {
    stars.push({
        r: 0,
        z: 100,
        h: (i * 44) % 360,
        e: false
    });
}

var n = stars.length,
    tail = 0;


function render() {
    ctx.clearRect(0, 0, 400, 400);
    
    if(frame % 20 === 0) {
        stars[tail].e = true;
        stars[tail].r = 0;
        stars[tail].z = 200;
        tail = (tail + 1) % n;
    }
    
    for(var i = 0; i < n; i++) {
        var star = stars[(i + tail) % n];
        if(star.e) {
            ctx.fillStyle = grad(ctx, star.h, star.r);
            drawStar(ctx, 200, 200, 800 / star.z * 4, 800 / star.z * 4 / 2);
            ctx.fill();
            star.z -= 8;
            if(star.z <= 0) {
                star.z = 1;
                //star.e = false;
            }
            star.r += 4;
        }
    }
        
    frame++;
    
    if(frame > 800) {
        //clearInterval(timer);
    }
}

var timer = setInterval(render, 1000 / 30);

