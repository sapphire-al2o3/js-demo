const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

ctx.fillStyle = '#FFF';

let time = 0;
const timer = setAnimationFrame((dt) => {

    time += dt * 0.1;

    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(0, 0, w, h);

    let x = Math.cos(time * 0.01) + 2;
    let y = Math.sin(time * 0.01) + 2;

    for(let i = 0; i < w; i++) {
        ctx.beginPath();
        ctx.moveTo(i * x, 0);
        ctx.lineTo(i * y, h);
        ctx.stroke();
    }

}, 1000 / 30);

canvas.addEventListener('click', () => {
    timer.toggle();
}, false);
