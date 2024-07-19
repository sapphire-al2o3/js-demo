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

let thickness = 6;
let count = 200;

ctx.fillStyle = '#000';
ctx.strokeStyle = '#000';
ctx.lineWidth = 1;

function render(delta) {
    // time += delta;

    ctx.clearRect(0, 0, w, h);

    
    for (let i = 0; i < count; i++) {
        
        let th = Math.random() * Math.PI * 2;
        let r = minR + Math.random() * 100;

        let x0 = Math.cos(th) * r + cx;
        let y0 = Math.sin(th) * r + cy;
        let x1 = Math.cos(th) * maxR + cx;
        let y1 = Math.sin(th) * maxR + cy;

        if (thickness === 0) {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        } else {
            let x1r = x1 + Math.sin(th) * thickness;
            let x1l = x1 - Math.sin(th) * thickness;
            let y1r = y1 + Math.cos(th) * thickness;
            let y1l = y1 - Math.cos(th) * thickness;

            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1r, y1r);
            ctx.lineTo(x1l, y1l);
            ctx.fill();
        }
    }
}

render();

let timer = setAnimationFrame(render, 1000 / 10);

canvas.addEventListener('click', () => {
    timer.toggle();
});

document.body.appendChild(createSlider('thickness', 1, v => {
    thickness = v * 20 ^ 0;
    render();
}));

const maxCount = 500;
document.body.appendChild(createSlider('count', count / maxCount, v => {
    count = v * maxCount ^ 0;
    render();
}));
