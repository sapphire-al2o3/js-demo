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
let lineColor = '#000';

ctx.fillStyle = lineColor;
ctx.strokeStyle = lineColor;
ctx.lineWidth = 1;

function render(delta) {
    // time += delta;

    ctx.clearRect(0, 0, w, h);

    
    for (let i = 0; i < count; i++) {
        
        let th = Math.random() * Math.PI * 2;
        let r = minR + Math.random() * 100;

        let dx = Math.cos(th);
        let dy = Math.sin(th);
        let x0 = dx * r + cx;
        let y0 = dy * r + cy;
        let x1 = dx * (r + maxR) + cx;
        let y1 = dy * (r + maxR) + cy;

        if (thickness === 0) {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        } else {
            let x1r = x1 + dy * thickness;
            let y1r = y1 - dx * thickness;
            let x1l = x1 - dy * thickness;
            let y1l = y1 + dx * thickness;

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

document.body.appendChild(createSlider('thickness', thickness / 20, v => {
    thickness = v * 20 ^ 0;
    render();
}));

const maxCount = 500;
document.body.appendChild(createSlider('count', count / maxCount, v => {
    count = v * maxCount ^ 0;
    render();
}));

document.body.appendChild(createSlider('radius', minR / 200, v => {
    minR = v * 200 ^ 0;
    render();
}));

document.body.appendChild(createColor('color', '#000', (v, id, text) => {
    lineColor = text;
    ctx.fillStyle = lineColor;
    ctx.strokeStyle = lineColor;
    render();
}));
