// https://note.com/anglers_member/n/nb00eca1226fc
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

const boids = [];
const Max = 30;

let sw = 0.0002;
let aw = 0.0002;
let cw = 0.0004;

for (let i = 0; i < Max; i++) {
    boids.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
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

function separation(k) {
    let fx = 0;
    let fy = 0;
    let p = boids[k];
    for (let i = 0; i < boids.length; i++) {
        if (i !== k) {
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
    for (let i = 0; i < boids.length; i++) {
        if (i !== k) {
            vx += boids[i].vx;
            vy += boids[i].vy;
        }
    }
    let p = boids[k];
    let n = boids.length - 1;
    vx = vx / n - p.vx;
    vy = vy / n - p.vy;
    return [vx, vy];
}

function cohesion(k) {
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < boids.length; i++) {
        if (i !== k) {
            cx += boids[i].x;
            cy += boids[i].y;
        }
    }
    let p = boids[k];
    let n = boids.length - 1;
    cx = cx / n - p.x;
    cy = cy / n - p.y;
    return [cx, cy];
}

function update() {



    for (let i = 0; i < boids.length; i++) {

        let [sx, sy] = separation(i);
        let [ax, ay] = alignment(i);
        let [cx, cy] = cohesion(i);

        boids[i].vx += sw * sx + aw * ax + cw * cx;
        boids[i].vy += sw * sy + aw * ay + cw * cy;

        boids[i].x += boids[i].vx;
        boids[i].y += boids[i].vy;

        if (boids[i].x < 0 || boids[i].x >= w) boids[i].vx *= -1;
        if (boids[i].y < 0 || boids[i].y >= h) boids[i].vy *= -1;
    }
}

function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle ='#FFF';
    for (let i = 0; i < boids.length; i++) {
        let x = boids[i].x;
        let y = boids[i].y;
        ctx.fillRect(x, y, 4, 4);
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
