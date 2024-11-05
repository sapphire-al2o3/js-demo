
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let mouse = {x: 0, y: 0};
let clickX = 0, clickY = 0;
let down = false;
let p0 = {x: 100, y: 300, label: 'P0'},
    p1 = {x: 300, y: 300, label: 'P1'},
    p2 = {x: 240, y: 100, label: 'P2'},
    p3 = {x: 100, y: 80, label: 'P3'},
    p4 = {x: 120, y: 200, label: 'P4'},
    p5 = {x: 200, y: 200, label: 'P5'},
    p6 = {x: 100, y: 240, label: 'P6'};
let active = null;
let shapes = [p0, p1, p2, p3, p4, p5, p6];
let count = 6;
let lines = false;

ctx.lineWidth = 2.0;
ctx.font = '9pt consolas';

canvas.addEventListener('mousedown', e => {
    const rect = e.target.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    down = true;
    draw();
}, false);

canvas.addEventListener('mouseup', e => {
    down = false;
    active = null;
}, false);

canvas.addEventListener('mouseout', e => {
    down = false;
    active = null;
}, false);

canvas.addEventListener('mousemove', e => {
    let rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    if (down) {
        clickX = mouse.x;
        clickY = mouse.y;
    }
    
    if (mouse.x !== 0 || mouse.y !== 0) {
        draw();
    }
    
    e.stopPropagation();
}, false);

function cross(x0, y0, x1, y1) {
    return x0 * y1 - x1 * y0;
}

function angle(p, v0, v1) {
    let dx0 = v0.x - p.x;
    let dy0 = v0.y - p.y;
    let dx1 = v1.x - p.x;
    let dy1 = v1.y - p.y;
    let l0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
    let l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    let dot = dx0 * dx1 + dy0 * dy1;
    let sign = cross(dx0, dy0, dx1, dy1) > 0 ? 1 : -1;
    // Math.atan2(dx0 * dy1 - dx1 * dy0, dx0 * dx1 + dy0 * dy1);
    return dot / (l0 * l1) * sign;
}

function inside() {
    let s = 0;
    let wn = 0;
    for (let i = 0; i < count; i++) {
        let a = shapes[i];
        let b = shapes[(i + 1) % count];

        if (a.x === p6.x && a.y === p6.y) {
            return true;
        }

        // let cos = angle(p6, a, b);
        // s += Math.acos(cos);

        if ((a.y <= p6.y) && (b.y > p6.y)) {
            let t = (p6.y - a.y) / (b.y - a.y);
            if (p6.x < (a.x + t * (b.x - a.x))) {
                wn++;
            }
        } else if ((a.y > p6.y) && (b.y <= p6.y)) {
            let t = (p6.y - a.y) / (b.y - a.y);
            if (p6.x < (a.x + t * (b.x - a.x))) {
                wn--;
            }
        }
    }
    // console.log(s / (Math.PI * 2), wn);
    return wn !== 0;
}


function draw() {
    let d = new Vector2(mouse.x, mouse.y);
    // if (down) {
    //     p6.x = clickX;
    //     p6.y = clickY;
    // }

    if (down) {
        if (active === null) {
            for (let i = 0; i < shapes.length; i++) {
                if (d.distance(shapes[i]) < 6) {
                    active = shapes[i];
                }
            }
        }
        if (active !== null) {
            active.x = clickX;
            active.y = clickY;
        }
    }
    
    
    ctx.clearRect(0, 0, 400, 400);
    ctx.strokeStyle = '#999';
    ctx.fillStyle = '#CCF';
    ctx.beginPath();
    
    ctx.moveTo(shapes[0].x, shapes[0].y);
    for (let i = 1; i < count; i++) {
        ctx.lineTo(shapes[i].x, shapes[i].y);
    }
    ctx.lineTo(shapes[0].x, shapes[0].y);
    ctx.stroke();

    
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
    
    ctx.strokeStyle = inside() ? '#37E' : '#E37';
    ctx.strokeCircle(p6.x, p6.y, d.distance(p6) < 6 ? 6 : 3);
}
draw();
