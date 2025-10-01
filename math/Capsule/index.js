const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#9BF";
ctx.strokeStyle = "#9BF";

const cos = Math.cos;
const sin = Math.sin;
const atan = Math.atan;

let t = 0;
let radius = 32;
let circleRadius = 24;

setInterval(function() {
    t += 1 / 30;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let px = sin(4 * t * 0.2) * 180 + 200,
        py = sin(3 * t * 0.2) * 180 + 200;
    
    distSegToPoint(150, 150, 250, 250, px, py);
}, 1000 / 30);

function drawCapsule(x0, y0, x1, y1, r) {
    let dx = x1 - x0,
        dy = y1 - y0,
        t = atan(dx / dy);
    
    ctx.beginPath();
    ctx.arc(x0, y0, r, Math.PI - t, 2 * Math.PI - t, dy < 0);
    ctx.arc(x1, y1, r, -t, Math.PI - t, dy < 0);
    ctx.closePath();
    ctx.stroke();
}

function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
}

/// sx, sy: 線分の始点
/// ex, ey: 線分の終点
/// px, py: 点
function distSegToPoint(sx, sy, ex, ey, px, py) {
    let vx = ex - sx,
        vy = ey - sy,
        l = 1 / (vx * vx + vy * vy),
        dx = px - sx,
        dy = py - sy,
        t = vx * l * dx + vy * l * dy;

    let qx = 0,
        qy = 0;

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

    let hit = Math.sqrt((qx - px) * (qx - px) + (qy - py) * (qy - py)) < radius + circleRadius;

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
    drawCircle(qx, qy, 4);

    ctx.strokeStyle = hit ? "#E64" : "#BF9";
    drawCircle(px, py, circleRadius);
    drawCapsule(sx, sy, ex, ey, radius);
}
