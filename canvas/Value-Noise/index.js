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

for (let x = 0; x < 512; x++) {
    p[x] = permutation[x & 255];
}

function noise(x, y) {
    
    let xi = (x ^ 0) & 255;
    let yi = (y ^ 0) & 255;
    let zi = (z ^ 0) & 255;
    let xf = x - (x ^ 0);
    let yf = y - (y ^ 0);
    let zf = z - (z ^ 0);
    let u = fade(xf);
    let v = fade(yf);
    let w = fade(zf);

    let x1, x2, y1, y2;
    x1 = lerp(grad(aaa, xf,     yf, zf),
              grad(baa, xf - 1, yf, zf),
              u);
    x2 = lerp(grad(aba, xf,     yf - 1, zf),
              grad(bba, xf - 1, yf - 1, zf),
              u);
    y1 = lerp(x1, x2, v);

    x1 = lerp(grad(aab, xf, yf, zf - 1),
              grad(bab, xf - 1, yf, zf - 1),
              u);
    x2 = lerp(grad(abb, xf, yf - 1, zf - 1),
              grad(bbb, xf - 1, yf - 1, zf - 1),
              u);
    y2 = lerp(x1, x2, v);
    
    return (lerp(y1, y2, w) + 1) / 2;
}

function octave(x, y, octaves, persistence, frequency = 4) {
    let total = 0,
        amplitude = 1,
        maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        total += noise(x * frequency, y * frequency) * amplitude;
        
        maxValue += amplitude;
        
        amplitude *= persistence;
        frequency *= 2;
    }
    
    return total / maxValue;
}

const image = ctx.createImageData(w, h);
const data = image.data;
console.time('noise');
for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
        let k = (i * w + j) * 4;
        let y = octave(j / w, i / h, 5, 0.5);
        // let y = perlin(i / w * 32, j / h * 32, 0);
        data[k] = data[k + 1] = data[k + 2] = y * 255 ^ 0;
        data[k + 3] = 255;
    }
}

ctx.putImageData(image, 0, 0);
console.timeEnd('noise');