const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const num = document.getElementById('num');

const pixels = [];
let size = 24;
let sizeX = 5;
let sizeY = 6;

let w = sizeX * size;
let h = sizeY * size;

canvas.width = w;
canvas.height = h;

for (let i = 0; i < sizeY; i++) {
    pixels[i] = [];
    for (let j = 0; j < sizeX; j++) {
        pixels[i][j] = 0;
    }
}

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 400, 400);

// 0x1D18FE31
// 0x3D1F463E
// 0x1D18422E
// 0x3D18C63E
// 0x3F0F421F

function render() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#09F';
    let n = 0;
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            if (pixels[i][j]) {
                ctx.fillRect(j * size, i * size, size, size);
            }
            n = (n << 1) | pixels[i][j];
        }
    }
    ctx.fill();

    num.value = '0x' + n.toString(16).toUpperCase();
}

canvas.addEventListener('click', e => {
    let r = e.target.getBoundingClientRect(),
        x = (e.clientX - r.left) / size ^ 0,
        y = (e.clientY - r.top) / size ^ 0;
    if (x < sizeX && y < sizeY) {
        pixels[y][x] = 1 - pixels[y][x];
        render();
    }
});

render();

document.getElementById('decode').addEventListener('click', e => {
    let p = parseInt(num.value, 16);
    for (let i = sizeY - 1; i >= 0; i--) {
        for (let j = sizeX - 1; j >= 0; j--) {
            pixels[i][j] = p & 1;
            p = p >> 1;
        }
    }
    render();
});
