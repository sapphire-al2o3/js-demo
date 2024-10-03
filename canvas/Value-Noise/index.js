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

function noise(x, y) {
    
    let xi = (x ^ 0) & 255;
    let yi = (y ^ 0) & 255;
    let xf = x - (x ^ 0);
    let yf = y - (y ^ 0);
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

document.body.appendChild(createSlider('octaves', 5 / 7, v => {
    let o = (v * 7 ^ 0) + 1;
    if (o !== octaves) {
        octaves = o;
        render(data, octaves);
    }
}));

document.body.appendChild(createSlider('persistence', 0.5, v => {
    persistence = v;
    render(data, octaves, persistence);
}));
