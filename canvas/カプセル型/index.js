var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#9BF";
ctx.strokeStyle = "#9BF";

var atan = Math.atan,
    cos = Math.cos,
    sin = Math.sin;

var r = 16,
    l = 16;

var t = 0;
setInterval(function() {
    t += 1 / 30;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            var x = cos(t) * l,
                y = sin(t) * l,
                cx = j * 48,
                cy = i * 48;
            drawCapsule(cx - x, cy - y, cx + x, cy + y, r);
        }
    }

}, 1000 / 30);

function drawCapsule(x0, y0, x1, y1, r) {
    var dx = x1 - x0,
        dy = y1 - y0,
        t = atan(dx / dy);
    
    ctx.beginPath();
    ctx.arc(x0, y0, r, Math.PI - t, 2 * Math.PI - t, dy < 0);
    ctx.arc(x1, y1, r, -t, Math.PI - t, dy < 0);
    ctx.closePath();
    ctx.stroke();
}
