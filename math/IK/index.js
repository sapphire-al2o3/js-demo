
CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0.0, Math.PI * 2.0, false);
    this.fill();
};
CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0.0, Math.PI * 2.0, false);
    this.stroke();
};
CanvasRenderingContext2D.prototype.strokeLine = function(x0, y0, x1, y1) {
    this.beginPath();
    this.moveTo(x0, y0);
    this.lineTo(x1, y1);
    this.stroke();
};

function max(a, b) {
    return a > b ? a : b;
}

function min(a, b) {
    return a > b ? b : a;
}

function range(a, b) {
    return Math.random() * (b - a) + a;
}

function lerp(a, b, t) {
    return a * (1.0 - t) + b * t;
}

function distance2(a, b) {
    let dx = b.x - a.x,
        dy = b.y - a.y;
    return dx * dx + dy * dy;
}

function distance(a, b) {
    let dx = b.x - a.x,
        dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function normalize(v) {
    let l = length(v);
    return { x: v.x / l, y: v.y / l };
}

function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}

function sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
}

function mul(v, s) {
    return { x: v.x * s, y: v.y * s };
}

function direction(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    let l = dx * dx + dy * dy;
    return { x: dx / l, y: dy / l };
}

let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height,
    down = false,
    p = {x: 0, y: 0},
    x = 16.0,
    active = null,
    stripe = true,
    attach = false;

let len = [];
let pos = [];
let num = 12;

const maxIteration = 5;

let base = {
    x: width / 2, y: height / 2
}

for (let i = 0; i < num; i++) {
    pos.push({
        x: width / 2, y: i * x + height / 2
    });
}

let end = pos[pos.length - 1];

let target = {
    x: end.x, y: end.y, hit: false
};

for (let i = 0; i < pos.length - 1; i++) {
    len.push(x);
}

ctx.fillStyle = '#FFF';

function update(frame) {
    target.hit = distance2(p, target) < 6 * 6;
    if (down) {
        if (target.hit) {
            active = target;
        }
        if (active) {
            active.x = p.x;
            active.y = p.y;
        }
    }

    // FABRIK
    base.x = pos[0].x;
    base.y = pos[0].y;

    let prevDist = 0;
    for (let i = 0; i< maxIteration; i++) {
        let dist = distance(pos[pos.length - 1], target);
        let change = Math.abs(dist - prevDist);

        prevDist = dist;
        if (dist < 1e-6 || change < 1e-8) {
            break;
        }

        pos[pos.length - 1].x = target.x;
        pos[pos.length - 1].y = target.y;
        for (let i = pos.length - 1; i >= 1; i--) {
            let dir = normalize(sub(pos[i], pos[i - 1]));
            pos[i - 1].x = pos[i].x - dir.x * len[i - 1];
            pos[i - 1].y = pos[i].y - dir.y * len[i - 1];
        }

        pos[0].x = base.x;
        pos[0].y = base.y;
        for (let i = 0; i <= pos.length - 2; i++) {
            let dir = normalize(sub(pos[i + 1], pos[i]));
            pos[i + 1].x = pos[i].x + dir.x * len[i];
            pos[i + 1].y = pos[i].y + dir.y * len[i];
        }
    }
}

function render() {
    // ctx.clearRect(0, 0, 400, 400);
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2.0;
    ctx.strokeStyle = '#094';
    ctx.strokeCircle(target.x, target.y, 6);

    // ctx.strokeCircle(base.x, base.y, 4);

    if (attach) {
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = '#ADD';
        ctx.strokeCircle(end.x, end.y, 6);
    }

    canvas.style['cursor'] = active ? 'pointer' : 'default';
    
    ctx.lineWidth = 2.0;
    for (let i = 1; i < pos.length; i++) {
        let e = pos[i],
            s = pos[i - 1];
        ctx.strokeStyle = stripe && (i & 1) ? '#AF0' : '#D50';
        ctx.strokeLine(s.x, s.y, e.x, e.y);
    }
}

setInterval(() => {
    update();
    render();
}, 1000 / 30);

canvas.addEventListener('mousedown', (e) => {
    const rect = e.target.getBoundingClientRect();
    p.x = e.clientX - rect.left;
    p.y = e.clientY - rect.top;
    down = true;
}, false);


canvas.addEventListener('mousemove', (e) => {
    const rect = e.target.getBoundingClientRect();
    p.x = e.clientX - rect.left;
    p.y = e.clientY - rect.top;
    e.stopPropagation();
}, false);
    
canvas.addEventListener('mouseup', (e) => {
    down = false;
    active = false;
}, false);
    
canvas.addEventListener('mouseout', (e) => {
    down = false;
    active = false;
}, false);

document.body.appendChild(createSlider('x', x / 32.0, v => {
    x = v * 32.0 + 0.1;
    for (let i = 0; i < len.length; i++) {
        len[i] = x;
    }
    
    let d = direction(pos[pos.length - 1], pos[pos.length - 2]);
    pos[pos.length - 1].x = pos[pos.length - 2].x + d.x * x;
    pos[pos.length - 1].y = pos[pos.length - 2].y + d.y * x;
}));

document.body.appendChild(createCheckbox('stripe', v => {
    stripe = v;
}, stripe));
