

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

const size = 16;
const scale = w / size;

ctx.lineWidth = 1.0;
ctx.strokeStyle = '#000';
ctx.beginPath();
ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2, true);
ctx.stroke();

ctx.beginPath();
ctx.arc(w / 2, h / 2, w / 2 - 10, 0, Math.PI * 2, true);
ctx.stroke();

ctx.strokeStyle = '#AAA';
ctx.beginPath();
for (let i = 1; i < 16; i++) {
    let x = scale * i - 0.5;
    ctx.moveTo(0.5, x);
    ctx.lineTo(w + 0.5, x);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h + 0.5);
}
ctx.stroke();