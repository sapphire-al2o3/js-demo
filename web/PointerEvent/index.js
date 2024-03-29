const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const strokeColor = 'rgba(230, 200, 255, 1.0)';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 8.0;
ctx.strokeStyle = strokeColor;

let down = false;
let px, py;

canvas.addEventListener('pointerdown', (e) => {
    console.log('type', e.type);
    console.log('button', e.button);
    console.log('pointerId', e.pointerId);
    console.log('pointerType', e.pointerType);
    const rect = e.target.getBoundingClientRect();
    down = true;
    px = e.clientX - rect.left + 0.5;
    py = e.clientY - rect.top + 0.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
}, false);

canvas.addEventListener('pointermove', (e) => {
    if (down) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left + 0.5;
        const y = e.clientY - rect.top + 0.5;

        ctx.lineTo(x, y);
        ctx.stroke();
        
        px = x;
        py = y;
    }
}, false);

canvas.addEventListener('pointerup', (e) => {
    if (down) {
        down = false;
    }
}, false);