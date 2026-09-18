// 矩形同士の当たり判定
function rectToRect(r0, r1) {
    if (r0.min.x > r1.max.x) return false;
    if (r0.min.y > r1.max.y) return false;
    if (r1.min.x > r0.max.x) return false;
    if (r1.min.y > r0.max.y) return false;
    return true;
}

function dist2(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    return dx * dx + dy * dy;
}

function rectToPoint(r, x, y) {
    return x > r.min.x && x < r.max.x && y > r.min.y && y < r.max.y;
}

function rectToCircle(r, c) {
    // if (c.x + c.radius < r.min.x) return false;
    // if (c.x - c.radius > r.max.x) return false;
    // if (c.y + c.radius < r.min.y) return false;
    // if (c.y - c.radius > r.max.y) return false;

    let p = 0;
    if (rectToPoint(r, c.x - c.radius, c.y - c.radius)) p++;
    if (rectToPoint(r, c.x + c.radius, c.y - c.radius)) p++;
    if (rectToPoint(r, c.x - c.radius, c.y + c.radius)) p++;
    if (rectToPoint(r, c.x + c.radius, c.y + c.radius)) p++;

    if (p === 0) return false;
    if (p === 2) return true;

    if (c.x > r.min.x && c.x < r.max.x && c.y > r.min.y && c.y < r.max.y) return true;
    const d2 = c.radius * c.radius;
    if (dist2(c.x, c.y, r.min.x, r.min.y) < d2) return true;
    if (dist2(c.x, c.y, r.min.x, r.max.y) < d2) return true;
    if (dist2(c.x, c.y, r.max.x, r.min.y) < d2) return true;
    if (dist2(c.x, c.y, r.max.x, r.max.y) < d2) return true;
    return false;
}

let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height,
    mouse = new Vector2(0, 0),
    start = new Vector2(0, 0),
    down = false;

canvas.onmousedown = (e) => {
    down = true;
    var rect = e.target.getBoundingClientRect();
    start.x = e.clientX - rect.left;
    start.y = e.clientY - rect.top;
};

canvas.onmousemove = (e) => {
    if(down) {
        var rect = e.target.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        render();
    }
};

canvas.onmouseup = (e) => {
    down = false;
};

const circle = {};
circle.x = 200;
circle.y = 200;
circle.radius = 50;

const rect = {};
rect.min = new Vector2(150, 150);
rect.max = new Vector2(250, 250);

const rect1 = {};
rect1.min = new Vector2(0, 0);
rect1.max = new Vector2(100, 100);

ctx.strokeStyle = '#FFF';

render();

function render() {
    ctx.clearRect(0, 0, w, h);
    if (down) {
        rect1.min.x = Math.min(start.x, mouse.x);
        rect1.min.y = Math.min(start.y, mouse.y);
        rect1.max.x = Math.max(start.x, mouse.x);
        rect1.max.y = Math.max(start.y, mouse.y);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(rect1.min.x, rect1.min.y, rect1.max.x - rect1.min.x, rect1.max.y - rect1.min.y);

        ctx.strokeStyle = '#444';
        ctx.beginPath();
        ctx.moveTo(rect1.min.x, rect1.min.y);
        ctx.lineTo(circle.x, circle.y);
        ctx.lineTo(rect1.min.x, rect1.max.y);
        ctx.moveTo(rect1.max.x, rect1.min.y);
        ctx.lineTo(circle.x, circle.y);
        ctx.lineTo(rect1.max.x, rect1.max.y);
        ctx.stroke();

        if (rectToCircle(rect1, circle)) {
            ctx.strokeStyle = '#F00';
        } else {
            ctx.strokeStyle = '#FFF';
        }
    }
    // ctx.strokeRect(rect.min.x, rect.min.y, rect.max.x - rect.min.x, rect.max.y - rect.min.y);
    ctx.beginPath();
    ctx.arc(200, 200, circle.radius, 0, Math.PI * 2);
    ctx.stroke();
}

