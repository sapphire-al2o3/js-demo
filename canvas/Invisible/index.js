const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

ctx.fillStyle = '#000';
ctx.strokeStyle = '#999';
ctx.lineWidth = 4.0;

const s = 48;

for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(i * s + 8, 0);
    ctx.lineTo(i * s + 8, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * s + 8);
    ctx.lineTo(w, i * s + 8);
    ctx.stroke();
}

for (let i = -10; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 2 * s + 8, 8);
    ctx.lineTo((i * 2 + 10) * s + 8, s * 10 + 8);
    ctx.stroke();
}

for (let i = -10; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo((i * 2 + 10) * s + 8, 8);
    ctx.lineTo(i * 2 * s + 8, s * 10 + 8);
    ctx.stroke();
}

for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.arc(i * s * 2 + 8, j * s * 2 + 8, 3, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
