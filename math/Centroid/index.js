
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let mouse = {x: 0, y: 0};
let clickX = 0, clickY = 0;
let down = false;
let p0 = {x: 100, y: 100, label: 'P0'},
    p1 = {x: 300, y: 300, label: 'P1'},
    p2 = {x: 300, y: 100, label: 'P2'},
    p3 = {x: 240, y: 80, label: 'P3'};
let active = {};
let shapes = [p0, p1, p2, p3];
let count = 3;
let lines = false;

ctx.lineWidth = 2.0;
ctx.font = '9pt consolas';

canvas.addEventListener('mousedown', e => {
    const rect = e.target.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    down = true;
}, false);

canvas.addEventListener('mouseup', e => {
    down = false;
    active = {};
}, false);

canvas.addEventListener('mouseout', e => {
    down = false;
    active = {};
}, false);

canvas.addEventListener('mousemove', e => {
    var rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    if(down) {
        clickX = mouse.x;
        clickY = mouse.y;
    }
    
    if(mouse.x !== 0 || mouse.y !== 0) {
        draw();
    }
    
    e.stopPropagation();
}, false);

function center() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < count; i++) {
        x += shapes[i].x;
        y += shapes[i].y;
    }
    x /= count;
    y /= count;
    return [x, y];
}

function centerTri(q0, q1, q2) {
    let x = (q0.x + q1.x + q2.x) / 3;
    let y = (q0.y + q1.y + q2.y) / 3;
    return [x, y];
}

function interSeg(p0x, p0y, v0x, v0y, p1x, p1y, v1x, v1y) {
    let d = v0x * v1y - v0y * v1x;
    if (d === 0) {
        return -1;
    }

    d = 1 / d;

    let t = (v1y * (p1x - p0x) - v1x * (p1y - p0y)) * d;
    return [p0x + v0x * t, p0y + v0y * t];
}

function centerOfGravity() {
    let [x0, y0] = centerTri(p0, p1, p2);
    let [x1, y1] = centerTri(p0, p2, p3);
    let [x2, y2] = centerTri(p0, p1, p3);
    let [x3, y3] = centerTri(p1, p2, p3);

    return interSeg(x0, y0, x1 - x0, y1 - y0, x2, y2, x3 - x2, y3 - y2)
}

function draw() {
    let d = new Vector2(mouse.x, mouse.y);
    if (down) {
        for (let i = 0; i < count; i++) {
            if (d.distance(shapes[i]) < 6) {
                active = shapes[i];
            }
        }
        active.x = clickX;
        active.y = clickY;
    }
    
    
    ctx.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = '#999';
    ctx.beginPath();
    
    ctx.moveTo(shapes[0].x, shapes[0].y);
    for (let i = 1; i < count; i++) {
        ctx.lineTo(shapes[i].x, shapes[i].y);
    }
    ctx.lineTo(shapes[0].x, shapes[0].y);
    ctx.stroke();

    let x, y, z, w;

    if (count === 3 && lines) {
        let hx = (p1.x + p2.x) / 2;
        let hy = (p1.y + p2.y) / 2;
        ctx.strokeStyle = '#DDD';
        ctx.strokeLine(p0.x, p0.y, hx, hy);

        hx = (p0.x + p2.x) / 2;
        hy = (p0.y + p2.y) / 2;
        ctx.strokeLine(p1.x, p1.y, hx, hy);

        hx = (p0.x + p1.x) / 2;
        hy = (p0.y + p1.y) / 2;
        ctx.strokeLine(p2.x, p2.y, hx, hy);
    }

    if (count === 4 && gravity) {
        ctx.strokeStyle = '#DDD';
        ctx.strokeLine(p0.x, p0.y, p2.x, p2.y);
        ctx.strokeLine(p1.x, p1.y, p3.x, p3.y);

        ctx.strokeLine(p0.x, p0.y, p2.x, p2.y);
        ctx.strokeLine(p1.x, p1.y, p3.x, p3.y);

        ctx.strokeStyle = '#7BF';
        [x, y] = centerTri(p0, p1, p2);
        ctx.strokeCircle(x, y, 2);
        [z, w] = centerTri(p0, p2, p3);
        ctx.strokeCircle(z, w, 2);

        ctx.strokeLine(x, y, z, w);

        ctx.strokeStyle = '#FB7';
        [x, y] = centerTri(p0, p1, p3);
        ctx.strokeCircle(x, y, 2);
        [z, w] = centerTri(p1, p2, p3);
        ctx.strokeCircle(z, w, 2);

        ctx.strokeLine(x, y, z, w);

        [x, y] = centerOfGravity();
        ctx.strokeStyle = '#E7E';
        ctx.strokeCircle(x, y, 3);
    }

    ctx.strokeStyle = '#000';
    for (let i = 0; i < count; i++) {
        const e = shapes[i];
        if (d.distance(e) < 6) {
            ctx.strokeCircle(e.x, e.y, 6);
        } else {
            ctx.strokeCircle(e.x, e.y, 3);
        }
        ctx.fillText(e.label, e.x, e.y - 8);
    }

    [x, y] = center();
    ctx.strokeStyle = '#37E';
    ctx.strokeCircle(x, y, 3);
}
draw();

document.body.appendChild(createCheckbox('lines', (v) => {
    lines = v;
    draw();
}, false, '補助線'));

document.body.appendChild(createRadio(['tri', 'quad'], (v, id, i) => {
    if (i === 0) {
        count = 3;
        checkbox.style.display = 'none';
    } else {
        count = 4;
        checkbox.style.display = 'block';
    }
    draw();
}));

let gravity = false;

const checkbox = createCheckbox('centroid', (v) => {
    gravity = v;
    draw();
});
checkbox.style.display = 'none';
document.body.appendChild(checkbox);
