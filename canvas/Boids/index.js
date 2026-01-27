const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

const boids = [];
const Max = 60;

const img = document.getElementById('sprite');

let sw = 0.090;
let aw = 0.010;
let cw = 0.004;

let rw = 0.04;

let mouse = {
    x: 0,
    y: 0
};
let down = false;

for (let i = 0; i < Max; i++) {
    boids.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-2, 2),
        vy: rand(-2, 2),
        dx: 1,
        dy: 0
    });
}


function rand(min, max) {
    return Math.random() * (max - min + 1) + min ^ 0;
}

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}


function neighbor(p0, p1) {
    let dx = p1.x - p0.x;
    let dy = p1.y - p0.y;
    return dx * dx + dy * dy < 900;
}

function limitSpeed(p, limit) {
    let l = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (l > limit) {
        p.vx = p.vx / l * limit;
        p.vy = p.vy / l * limit;
    }
}

function separation(k) {
    let fx = 0;
    let fy = 0;
    let p = boids[k];
    for (let i = 0; i < boids.length; i++) {
        if (i !== k && neighbor(p, boids[i])) {
            let x = p.x - boids[i].x;
            let y = p.y - boids[i].y;
            let l = x * x + y * y;
            fx += x / l;
            fy += y / l;
        }
    }
    return [fx, fy];
}

function alignment(k) {
    let vx = 0;
    let vy = 0;
    let n = 0;
    for (let i = 0; i < boids.length; i++) {
        if (i !== k && neighbor(boids[k], boids[i])) {
            vx += boids[i].vx;
            vy += boids[i].vy;
            n++;
        }
    }
    if (n > 0) {
        let p = boids[k];
        vx = vx / n - p.vx;
        vy = vy / n - p.vy;
    }
    return [vx, vy];
}

function cohesion(k) {
    let cx = 0;
    let cy = 0;
    let n = 0;
    for (let i = 0; i < boids.length; i++) {
        if (i !== k && neighbor(boids[k], boids[i])) {
            cx += boids[i].x;
            cy += boids[i].y;
            n++;
        }
    }
    if (n > 0) {
        let p = boids[k];
        cx = cx / n - p.x;
        cy = cy / n - p.y;
    }
    return [cx, cy];
}

function repulsion(k, p) {
    let vx = 0;
    let vy = 0;
    let dx = boids[k].x - p.x;
    let dy = boids[k].y - p.y;

    let l = Math.sqrt(dx * dx + dy * dy);

    if (l > 0 && l < 64) {
        vx = dx / l;
        vy = dy / l;
    }

    return [vx, vy];
}

function update() {

    for (let i = 0; i < boids.length; i++) {

        let [sx, sy] = separation(i);
        let [ax, ay] = alignment(i);
        let [cx, cy] = cohesion(i);

        boids[i].vx += sw * sx + aw * ax + cw * cx;
        boids[i].vy += sw * sy + aw * ay + cw * cy;

        if (down) {
            let [rx, ry] = repulsion(i, mouse);
            boids[i].vx += rx;
            boids[i].vy += ry;
        }

        limitSpeed(boids[i], 6);

        boids[i].x += boids[i].vx;
        boids[i].y += boids[i].vy;

        if (boids[i].x < 0) {
            boids[i].x = 0;
            boids[i].vx *= -1;
        } else if (boids[i].x >= w) {
            boids[i].x = w - 1;
            boids[i].vx *= -1;
        }
        if (boids[i].y < 0) {
            boids[i].y = 0;
            boids[i].vy *= -1;
        } else if (boids[i].y >= h) {
            boids[i].y = h - 1;
            boids[i].vy *= -1;
        }
    }

    down = false;
}

function render() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#FFF';
    ctx.fillStyle ='#FFF';
    for (let i = 0; i < boids.length; i++) {
        let x = boids[i].x;
        let y = boids[i].y;
        let vx = boids[i].vx;
        let vy = boids[i].vy;
        let l = Math.sqrt(vx * vx + vy * vy);
        vx = vx / l * 8;
        vy = vy / l * 8;

        // ctx.beginPath();
        // ctx.moveTo(x, y);
        
        // ctx.lineTo(x - vx, y - vy);
        // ctx.stroke();
        let r = Math.atan2(vy, vx) + Math.PI * 0.5;
        ctx.translate(x, y);
        ctx.rotate(r);
        
        ctx.drawImage(img, 0, 0);
        ctx.resetTransform();
        // ctx.fillRect(x, y, 4, 4);
    }
}

setAnimationFrame((t) => {
    update();
    render();
}, 1000 / 30);

// document.body.appendChild(createCheckbox('Area', v => {
//     area = v;
//     render();
// }, true));

// document.body.appendChild(createCheckbox('Stairs', v => {
//     stairs = v;
//     render();
// }, true));

// document.body.appendChild(createButton('generate', () => {
//     fillMap(0, 0, sizeW, sizeH, 0)
//     root = split(treeDepth, 0, 0, sizeW, sizeH);
//     room(root);
//     corridor(root, 0);
//     placement(root, 2, 0, 0);
//     placement(root, 3, 0, rand(1, (1 << treeDepth) - 1));
//     render();
// }), false);

canvas.addEventListener('click', e => {
    const rect = e.target.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    down = true;
});

document.body.appendChild(createSlider('separation', 0.5, v => {
    sw = v * 0.4;
}));

document.body.appendChild(createSlider('alignment', 0.5, v => {
    aw = v * 0.04;
}));

document.body.appendChild(createSlider('cohesion', 0.5, v => {
    cw = v * 0.01;
}));

