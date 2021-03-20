const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

let repeat = w;

function dist2(sx, sy, ex, ey) {
    return (ex - sx) * (ey - sy);
}

const b = 3;
const bw = w / b ^ 0;
const bh = h / b ^ 0;
const randx = [];
const randy = [];

for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
        let k = y * bw + x;
        randx[k] = Math.random();
        randy[k] = Math.random();
    }
}

function cell(x, y) {
    let ix = x / b ^ 0;
    let iy = y / b ^ 0;
    let fx = x - ix;
    let fy = y - iy;
    
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let k = (y + i) * bw + (x + j);
            let cx = randx[k];
            let cy = randy[k];
        }
    }
}

function render(data, octaves = 5, persistence = 0.5) {
    console.time('noise');
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let k = (i * w + j) * 4;
            let y = cell(j, i);
            data[k] = data[k + 1] = data[k + 2] = y ^ 0;
            data[k + 3] = 255;
        }
    }
    
    ctx.putImageData(image, 0, 0);
    console.timeEnd('noise');
}

const image = ctx.createImageData(w, h);
const data = image.data;

render(data);
