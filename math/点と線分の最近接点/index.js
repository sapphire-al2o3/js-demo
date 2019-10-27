var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#9BF";
ctx.strokeStyle = "#9BF";

var atan = Math.atan,
    cos = Math.cos,
    sin = Math.sin;
var t = 0;
setInterval(function() {
	t += 1 / 30;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var px = sin(4 * t * 0.2) * 180 + 200,
		py = sin(3 * t * 0.2) * 180 + 200;
	
	distSegToPoint(150, 150, 250, 250, px, py);

}, 1000 / 30);

/// sx, sy: 線分の始点
/// ex, ey: 線分の終点
/// px, py: 点
function distSegToPoint(sx, sy, ex, ey, px, py) {
	var vx = ex - sx,
		vy = ey - sy,
		l = 1 / (vx * vx + vy * vy),
		dx = px - sx,
		dy = py - sy,
        t = vx * l * dx + vy * l * dy;
	
	var qx, qy;
	
	if(t < 0) {
        // 線分の始点が最近接点
		qx = sx;
		qy = sy;
	} else if(t > 1) {
        // 線分の終点が最近接点
		qx = ex;
		qy = ey;
	} else {
		qx = t * vx + sx;
		qy = t * vy + sy;
	}
    
    ctx.strokeStyle = "#9BF";
	ctx.beginPath();
	ctx.moveTo(ex, ey);
	ctx.lineTo(sx, sy);
	ctx.stroke();
	
	ctx.strokeStyle = "#6d8158";
	ctx.beginPath();
	ctx.moveTo(qx, qy);
	ctx.lineTo(px, py);
	ctx.stroke();
	
	ctx.strokeStyle = "#BF9";
	ctx.beginPath();
	ctx.arc(qx, qy, 4, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(px, py, 4, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.stroke();
}
