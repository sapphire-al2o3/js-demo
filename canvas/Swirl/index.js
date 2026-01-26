var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    PI2 = Math.PI * 2.0;

(function start() {
    var width = canvas.width,
	height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#0F0';
    ctx.strokeStyle = rgba(0, 200, 255, 0.2);
    ctx.lineWidth = 2.0;
    ctx.font = '24pt "Courier New"';
})();

function render(f) {
    //ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = rgba(0, 0, 0, 0.2);
    ctx.fillRect(0, 0, 400, 400);
    for(var i = 0; i < 2000; i++) {
	var t = f * i / 2000 * PI2,
	    x = i / 4 * Math.cos(t),
	    y = i / 4 * Math.sin(t);
	ctx.strokeStyle = hsva(i / 2000 * 360, 1, 1, 0.2);
    	drawCircle(x + 200, y + 200, 16);
    }
    ctx.fillStyle = '#FFF';
    ctx.fillText("" + fps.toFixed(1), 10, 20);
}

function update(f) {
    render(f);
}

var time = 0.0,
    start = Date.now(),
    fps = 0.0;
setInterval(function() {
    var now = Date.now(),
	delta = now - start;
    fps = 1000 / delta;
    time += delta / 1000;
    if(time > 16) time = 0;
    update(time);
    start = now;
}, 1000 / 30);

//-------------------------------------------------------------

function rgba(r, g, b, a) {
    return 'rgba(' + (r^0) + ',' + (g^0) + ',' + (b^0) + ',' + a + ')';
}

function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;
return 'rgba('
+[[v,p,m,m,q,v][i]*255^0,
[q,v,v,p,m,m][i]*255^0,
[m,m,q,v,v,p][i]*255^0,a].join(',')+')';}

function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, PI2, false);
    ctx.stroke();
    //ctx.fill();
}
