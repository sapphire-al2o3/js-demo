const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

let repeat = w;

function dist2(sx, sy, ex, ey) {
    let dx = ex - sx;
    let dy = ey - sy;
    return Math.sqrt(dx * dx + dy * dy);
}

const min = (a, b) => Math.min(a, b);

const b = 64;
const maxd = b * b + 1;
const bw = w / b ^ 0;
const bh = h / b ^ 0;
const randx = [];
const randy = [];

for (let y = 0; y < bh + 2; y++) {
    for (let x = 0; x < bw + 2; x++) {
        let k = y * (bw + 2) + x;
        randx[k] = ((x - 1) + Math.random()) * b;
        randy[k] = ((y - 1) + Math.random()) * b;
    }
}

function cell(x, y) {
    let ix = x / b ^ 0;
    let iy = y / b ^ 0;
    let fx = x / b - ix;
    let fy = y / b - iy;
    let distance = maxd;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let k = (iy + i + 1) * (bw + 2) + (ix + j + 1);
            let cx = randx[k];
            let cy = randy[k];
            let d = dist2(cx, cy, x, y);
            if (d < distance) {
                distance = d;
            }
        }
    }
    return distance
}

function render(data, octaves = 5, persistence = 0.5) {
    console.time('noise');
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let k = (i * w + j) * 4;
            let y = cell(j, i) * 2 ^ 0;
            data[k] = data[k + 1] = data[k + 2] = y;
            data[k + 3] = 255;
        }
    }
    
    ctx.putImageData(image, 0, 0);
    console.timeEnd('noise');
}

const image = ctx.createImageData(w, h);
const data = image.data;

render(data);

/*

ctx.fillStyle = '#F00';

for (let y = 1; y < bh + 1; y++) {
    for (let x = 1; x < bw + 1; x++) {
        let k = y * (bw + 2) + x;
        let cx = randx[k];
        let cy = randy[k];
        ctx.fillRect(cx, cy, 2, 2);
    }
}

*/