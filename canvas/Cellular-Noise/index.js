const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

let repeat = w;

function dist2(sx, sy, ex, ey) {
    let dx = ex - sx;
    let dy = ey - sy;
    return dx * dx + dy * dy;
}

const min = (a, b) => Math.min(a, b);

const b = 64;
const maxd = b * b + 1;
const bw = w / b ^ 0;
const bh = h / b ^ 0;
const randx = [];
const randy = [];
const randc = [];
let voronoi = false;

for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
        let k = y * bw + x;
        randx[k] = Math.random() * b;
        randy[k] = Math.random() * b;
        randc[k] = Math.random() * 256 ^ 0;
    }
}

function cell(x, y) {
    let ix = x / b ^ 0;
    let iy = y / b ^ 0;
    let distance = maxd;
    let c = 0;
    for (let i = -1; i <= 1; i++) {
        let ry = (iy + i + bh) % bh;
        let by = (iy + i) * b;
        for (let j = -1; j <= 1; j++) {

            let rx = (ix + j + bw) % bw;
            
            let k = ry * bw + rx;
            
            let cx = randx[k] + (ix + j) * b;
            let cy = randy[k] + by;

            let d = dist2(cx, cy, x, y);
            if (d < distance) {
                distance = d;
                c = randc[k];
            }
        }
    }
    return voronoi ? c : Math.sqrt(distance) * 2;
}

function render(data) {
    console.time('noise');
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let k = (i * w + j) * 4;
            let y = cell(j, i) ^ 0;
            data[k] = data[k + 1] = data[k + 2] = y;
            data[k + 3] = 255;
        }
    }
    
    ctx.putImageData(image, 0, 0);
    console.timeEnd('noise');
}

function plot() {
    ctx.fillStyle = '#F00';

    for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
            let k = y * bw + x;
            let cx = randx[k] + x * b;
            let cy = randy[k] + y * b;
            ctx.fillRect(cx, cy, 2, 2);
        }
    }
}

const image = ctx.createImageData(w, h);
const data = image.data;

render(data);
plot();

document.body.appendChild(createCheckbox('Voronoi', v => {
    voronoi = v;
    render(data);
    plot();
}));