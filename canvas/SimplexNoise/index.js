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

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
        const gi = xi + p[yi];
    }

    let u = fade(xf);
    let v = fade(yf);

    let a = p[p[xi] + yi];
    let b = p[p[inc(xi)] + yi];
    let c = p[p[xi] + inc(yi)];
    let d = p[p[inc(xi)] + inc(yi)];
    
    return lerp(a, b, u) + (c - a) * v * (1 - u) + (d - b) * u * v;
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

function render(data, octaves = 5, persistence = 0.5) {
    console.time('noise');
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let k = (i * w + j) * 4;
            let y = octave(j / w, i / h, octaves, persistence);
            // let y = noise(i / w * 32, j / h * 32, 0);
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

let octaves = 5,
    persistence = 0.5;

document.body.appendChild(createSlider('octaves', 5 / 8, v => {
    octaves = (v * 8 ^ 0) + 1;
    render(data, octaves);
}));

document.body.appendChild(createSlider('persistence', 0.5, v => {
    persistence = v;
    render(data, octaves, persistence);
}));
