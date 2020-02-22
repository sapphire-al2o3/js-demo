const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

let time = 0;
let a = 32;
let n = 10;

ctx.fillStyle = "rgba(0,0,0,0.5)";
ctx.strokeStyle = "#9BF";
ctx.lineWidth = 2;

function render(delta) {
    time += delta;

    // ctx.clearRect(0, 0, w, h);
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    for(let i = 0; i <= n; i++) {
        let y = i * w / n;
        let x = Math.cos(y * 0.1 + time * 0.05) * a;
        ctx.lineTo(w / 2 + x, y);
    }
    ctx.stroke();
}

let timer = setAnimationFrame(render, 1000 / 4);

canvas.addEventListener('click', () => {
    timer.toggle();
});
