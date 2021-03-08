const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

const permutation = [
    151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
];

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

function grad(hash, x, y, z) {
    let h = hash & 15;
    let u = h < 8 ? x : y;
    
    let v;
    if (h < 4) {
        v = y;
    } else if (h == 12 || h == 14) {
        v = x;
    } else {
        v = z;
    }
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}

const p = [];

for (let x = 0; x < 512; x++) {
    p[x] = permutation[x % 256];
}

function perlin(x, y, z) {
    if (repeat > 0) {
        x = x % repeat;
        y = y % repeat;
        z = z % repeat;
    }
    
    let xi = (x ^ 0) & 255;
    let yi = (y ^ 0) & 255;
    let zi = (z ^ 0) & 255;
    let xf = x - (x ^ 0);
    let yf = y - (y ^ 0);
    let zf = z - (z ^ 0);
    let u = fade(xf);
    let v = fade(yf);
    let w = fade(zf);

    let aaa, aba, aab, abb, baa, bba, bab, bbb;
    aaa = p[p[p[    xi ]+    yi ]+    zi ];
    aba = p[p[p[    xi ]+inc(yi)]+    zi ];
    aab = p[p[p[    xi ]+    yi ]+inc(zi)];
    abb = p[p[p[    xi ]+inc(yi)]+inc(zi)];
    baa = p[p[p[inc(xi)]+    yi ]+    zi ];
    bba = p[p[p[inc(xi)]+inc(yi)]+    zi ];
    bab = p[p[p[inc(xi)]+    yi ]+inc(zi)];
    bbb = p[p[p[inc(xi)]+inc(yi)]+inc(zi)];

    let x1, x2, y1, y2;
    x1 = lerp(grad(aaa, xf,     yf, zf),
              grad(baa, xf - 1, yf, zf),
              u);
    x2 = lerp(grad(aba, xf,     yf - 1, zf),
              grad(bba, xf - 1, yf - 1, zf),
              u);
    y1 = lerp(x1, x2, v);

    x1 = lerp(grad(aab, xf  , yf  , zf - 1),
              grad(bab, xf - 1, yf, zf - 1),
              u);
    x2 = lerp(grad(abb, xf, yf - 1, zf - 1),
              grad(bbb, xf - 1, yf - 1, zf - 1),
              u);
    y2 = lerp(x1, x2, v);
    
    return (lerp(y1, y2, w) + 1) / 2;
}

function octavePerlin(x, y, z, octaves, persistence) {
    let total = 0,
        frequency = 1,
        amplitude = 1,
        maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        total += perlin(x * frequency, y * frequency, z * frequency) * amplitude;
        
        maxValue += amplitude;
        
        amplitude *= persistence;
        frequency *= 2;
    }
    
    return total / maxValue;
}

const image = ctx.createImageData(w, h);
const data = image.data;

for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
        let k = (i * w + j) * 4;
        let y = octavePerlin(j / w * 4, i / h * 4, 0, 8, 0.5);
        // let y = perlin(i / w * 32, j / h * 32, 0);
        data[k] = data[k + 1] = data[k + 2] = y * 255 ^ 0;
        data[k + 3] = 255;
    }
}

ctx.putImageData(image, 0, 0);
