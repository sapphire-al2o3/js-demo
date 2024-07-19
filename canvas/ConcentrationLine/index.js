const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

let time = 0;
let a = 32;
let n = 10;
let cx = w / 2;
let cy = h / 2;

let minR = 100;
let maxR = 300;

ctx.fillStyle = '#FFF';
ctx.strokeStyle = '#000';
ctx.lineWidth = 1;

function render(delta) {
    // time += delta;

    ctx.clearRect(0, 0, w, h);

    let count = 200;
    for (let i = 0; i < count; i++) {
        
        let th = Math.random() * Math.PI * 2;
        let r = minR + Math.random() * 100;

        let x0 = Math.cos(th) * r + cx;
        let y0 = Math.sin(th) * r + cy;
        let x1 = Math.cos(th) * maxR + cx;
        let y1 = Math.sin(th) * maxR + cy;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }
}

render();

let timer = setAnimationFrame(render, 1000 / 10);

canvas.addEventListener('click', () => {
    timer.toggle();
});
