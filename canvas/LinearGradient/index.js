const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
let time = 0;
function rgba(r, g, b, a) { return `rgb(${r} ${g} ${b}/${a})`; }

let color0 = [255, 0, 0];
let color1 = [0, 0, 0];
let colorBG = '#000';
let point0 = [100, 100];
let point1 = [200, 200];

let loop = false;

function getColor(a) {
    let r = color0[0] * a + color1[0] * (1 - a);
    let g = color0[1] * a + color1[1] * (1 - a);
    let b = color0[2] * a + color1[2] * (1 - a);
    return rgba(r, g, b, 1);
}

function render() {
    ctx.fillStyle = colorBG;
    ctx.fillRect(0, 0, 400, 400);
    let x0 = point0[0],
        y0 = point0[1],
        x1 = point1[0],
        y1 = point1[1];
    let grad3 = ctx.createLinearGradient(x0, y0, x1, y1);
    grad3.addColorStop(0, getColor(0));
    grad3.addColorStop(1, getColor(1));
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, 400, 400);
};

render();

canvas.addEventListener('click', e => {
    timer.toggle();
}, false);

document.body.appendChild(createColor('color0', '#FF0000', e => {
    color0 = e;
    render();
}));

document.body.appendChild(createColor('color1', '#000000', e => {
    color1 = e;
    render();
}));

document.body.appendChild(createColor('background', '#000000', (color, id, text) => {
    colorBG = text;
    render();
}));
