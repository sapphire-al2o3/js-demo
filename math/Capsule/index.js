const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#9BF";
ctx.strokeStyle = "#9BF";

const cos = Math.cos;
const sin = Math.sin;
const atan = Math.atan;

let start = {
    x: 150,
    y: 150
};

let end = {
    x: 250,
    y: 250
};

let shapes = [start, end];

let active = null;
let down = false;
let mouse = {
    x: 0,
    y: 0
};
let t = 0;
let radius = 32;
let circleRadius = 24;

setInterval(function() {
    t += 1 / 30;

    if (down) {
        if (active === null) {
            for (let i = 0; i < shapes.length; i++) {
                if (distance(shapes[i].x, shapes[i].y, mouse.x, mouse.y) < 8) {
                    active = shapes[i];
                }
            }
        }
        if (active !== null) {
            active.x = mouse.x;
            active.y = mouse.y;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let px = sin(4 * t * 0.2) * 180 + 200,
        py = sin(3 * t * 0.2) * 180 + 200;
    
    distSegToPoint(start.x, start.y, end.x, end.y, px, py);
}, 1000 / 30);


canvas.addEventListener('mousedown', (e) => {
    const rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    down = true;
}, false);

canvas.addEventListener('mouseup', (e) => {
    down = false;
    active = null;
}, false);

canvas.addEventListener('mouseout', (e) => {
    down = false;
    active = null;
}, false);

canvas.addEventListener('mousemove', (e) => {
    if (down) {
        const rect = e.target.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }
    e.stopPropagation();
}, false);

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

function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function distance(x0, y0, x1, y1) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
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

    let hit = distance(px, py, qx, qy) < radius + circleRadius;

    ctx.strokeStyle = "#9BF";
    drawCircle(sx, sy, 4);
    drawCircle(ex, ey, 4);

    ctx.strokeStyle = "#9BF";
    drawLine(ex, ey, sx, sy);

    ctx.strokeStyle = "#6d8158";
    drawLine(qx, qy, px, py);

    ctx.strokeStyle = "#BF9";
    drawCircle(qx, qy, 4);

    ctx.strokeStyle = hit ? "#E64" : "#BF9";
    drawCircle(px, py, circleRadius);
    drawCapsule(sx, sy, ex, ey, radius);
}
