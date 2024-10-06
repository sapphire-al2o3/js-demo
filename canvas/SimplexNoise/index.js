const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

let repeat = w;

function inc(num) {
    num++;
    if (repeat > 0) num %= repeat;
    
    return num;
}

function lerp(a, b, x) {
    return a + x * (b - a);
}

function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

const p = [];
const permutation = [];

for (let x = 0; x < 256; x++) {
    permutation[x] = Math.random() * 256 ^ 0;
}

for (let x = 0; x < 512; x++) {
    p[x] = permutation[x & 255];
}

const grad2 = [
    1, 1,
    -1, 1,
    1, -1,

    -1, -1,
    1, 0,
    -1, 0,
    
    1, 0,
    -1, 0,
    0, 1,
    
    0, -1, 
    0, 1,
    0, -1
];
const grad2x = p.map(v => grad2[(v % 12) * 2]);
const grad2y = p.map(v => grad2[(v % 12) * 2 + 1]);

const C1 = (3 - Math.sqrt(3)) / 6;
const C2 = (Math.sqrt(3) - 1) / 2;

function noise(x, y) {
    
    let s = (x + y) * C2; // dot(v, C2)
    let xi = (x + s ^ 0) & 255;
    let yi = (y + s ^ 0) & 255;
    let t = (xi + yi) * C1;
    
    let x0 = x - xi + t;
    let y0 = y - yi + t;

    let ix = x0 > y0 ? 1 : 0;
    let iy = x0 > y0 ? 0 : 1;

    let x1 = x0 + C1 - ix;
    let y1 = y0 + C1 - iy;
    let x2 = x0 + C1 * 2 - 1;
    let y2 = x0 + C1 * 2 - 1;

    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
        const gi = xi + p[yi];
        const gx = grad2x[gi];
        const gy = grad2y[gi];
        t0 *= t0;
        n0 = t0 * t0 * (gx * x0 + gy * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
        const gi = xi + ix + p[yi + iy];
        const gx = grad2x[gi];
        const gy = grad2y[gi];
        t1 *= t1;
        n1 = t1 * t1 * (gx * x1 + gy * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
        const gi = xi + 1 + p[yi + 1];
        const gx = grad2x[gi];
        const gy = grad2y[gi];
        t2 *= t2;
        n2 = t2 * t2 * (gx * x2 + gy * y2);
    }
    
    return 70 * (n0 + n1 + n2);
}

function octave(x, y, octaves, persistence, frequency = 5) {
    let total = 0,
        amplitude = 1,
        maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        repeat = frequency;
        total += noise(x * frequency, y * frequency) * amplitude;
        
        maxValue += amplitude;
        
        amplitude *= persistence;
        frequency *= 2;
    }
    
    return total / maxValue;
}

function render(data, octaves, persistence) {
    console.time('noise');
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let k = (i * w + j) * 4;
            let y = octave(j / w, i / h, octaves, persistence);
            data[k] = data[k + 1] = data[k + 2] = y * 255 ^ 0;
            data[k + 3] = 255;
        }
    }
    
    ctx.putImageData(image, 0, 0);
    console.timeEnd('noise');
}

const image = ctx.createImageData(w, h);
const data = image.data;

let octaves = 5,
    persistence = 0.5;

    render(data, octaves, persistence);

document.body.appendChild(createSlider('octaves', octaves / 8, v => {
    octaves = (v * 8 ^ 0) + 1;
    render(data, octaves, persistence);
}));

document.body.appendChild(createSlider('persistence', persistence, v => {
    persistence = v;
    render(data, octaves, persistence);
}));
