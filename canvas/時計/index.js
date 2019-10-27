var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    buf = document.getElementById('buffer').getContext('2d'),
    w = canvas.width,
    h = canvas.height,
    pn = [];

ctx.fillRect(0, 0, w, h);
ctx.fillStyle = '#FFF';

buf.font = '32px "Century Gothic"';
buf.fillStyle = '#FFF';

for(var i = 0; i < 10; i++) {
    var pi = [],
        count = 500;
    buf.clearRect(0, 0, 32, 32);
    buf.fillText("" + i, 0, 24);
    var img = buf.getImageData(0, 0, 32, 32),
        data = img.data;
    while(count > 0) {
        var x = Math.random() * 32 ^ 0,
            y = Math.random() * 32 ^ 0;
        if(data[(y * 32 + x) * 4]) {
        var rx = (Math.random() - 0.5) * 4.0,
        ry = (Math.random() - 0.5) * 4.0;
            var px = {'x': x * 4 + rx, 'y': y * 4 + ry, 'r': Math.random() + 0.5};
            pi.push(px);
        count--;
        }
    }
    
    pn.push(pi);
}

var prevSec = 0,
    prevSecH = 0,
    prevSecL = 0,
    prevMinH = 0,
    prevMinL = 0,
    time = 0.0,
    timeSecH = 0.0,
    timeSecL = 0.0,
    timeMinH = 0.0,
    timeMinL = 0.0;

setInterval(function() {
    var now = new Date(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        text = "" + min + ":" + sec;
        text = "" + sec,
    minh = min / 10 ^ 0,
    minl = min % 10,
    sech = sec / 10 ^ 0,
    secl = sec % 10;
    if(prevSec != sec) {
        prevSec = sec;
        time = 0.0;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, w, h);

    if(prevSecH != sech) {
        timeSecH = 0.0;
        prevSecH = sech;
    }
    if(prevMinH != minh) {
        timeMinH = 0.0;
        prevMinH = minh;
    }
    if(prevMinL != minl) {
        timeMinL = 0.0;
        prevMinL = minl;
    }
    ctx.fillStyle = '#F0F0F0';
    //ctx.fillStyle = hsva(minl * 36, 1, 1, 1);
    draw(minl, timeMinL, 96, 20);
    
    //ctx.fillStyle = hsva(sech * 36, 1, 1, 1);
    draw(sech, timeSecH, 192, 20);
    
    //ctx.fillStyle = hsva(minh * 36, 1, 1, 1);
    draw(minh, timeMinH, 16, 20);
    
    //ctx.fillStyle = hsva(lerp(secl - 1, secl, time > 1.0 ? 1.0 : time) * 36, 1, 1, 1);
    draw(sec % 10, time, 288, 20);
    
    time += 0.05;
    timeSecH += 0.05;
    timeMinH += 0.05;
    timeMinL += 0.05;
}, 33);

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function draw(n, t, tx, ty) {
    var n0 = (n + 9) % 10,
        p = pn[n],
        p0 = pn[n0];
    if(t > 1.0) {
    	t = 1.0;
    }
    for(var i = 0; i < p.length; i++) {
        var x = lerp(p0[i].x, p[i].x, easeInOut(t)) + tx + (Math.random() - 0.5) * 3,
            y = lerp(p0[i].y, p[i].y, easeInOut(t)) + ty + (Math.random() - 0.5) * 3,
	    r = pn[0][i].r;
        ctx.fillRect(x, y, r, r);
    }
}

function easeInOut(x) {
    return 0.5 * Math.sin(Math.PI * (x - 0.5)) + 0.5;
}

function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')';}