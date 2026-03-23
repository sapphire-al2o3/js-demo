const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
let time = 0;
function rgba(r, g, b, a) { return `rgb(${r} ${g} ${b}/${a})`; }

let color0 = [255, 0, 0];
let color1 = [0, 0, 0];
let colorBG = '#000';
let point0 = { x: 100, y: 100 };
let point1 = { x: 200, y: 200 };
let points = [point0, point1];

let clickX = 0;
let clickY = 0;
let mouseX = 0;
let mouseY = 0;
let down = false;

function getColor(a) {
    let r = color0[0] * a + color1[0] * (1 - a);
    let g = color0[1] * a + color1[1] * (1 - a);
    let b = color0[2] * a + color1[2] * (1 - a);
    return rgba(r, g, b, 1);
}

function render() {
    ctx.fillStyle = colorBG;
    ctx.fillRect(0, 0, 400, 400);
    let x0 = point0.x,
        y0 = point0.y,
        x1 = point1.x,
        y1 = point1.y;
    let grad3 = ctx.createLinearGradient(x0, y0, x1, y1);
    grad3.addColorStop(0, getColor(0));
    grad3.addColorStop(1, getColor(1));
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, 400, 400);

    ctx.strokeStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(point0.x, point0.y, 4, 0, Math.PI * 2, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(point1.x, point1.y, 4, 0, Math.PI * 2, false);
    ctx.stroke();
};

render();

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

canvas.addEventListener('mousedown', e => {
    const rect = e.target.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    for (let i = 0; i < points.length; i++) {
        let dx = points[i].x - clickX;
        let dy = points[i].y - clickY;
        let d = dx * dx + dy * dy;
        if (d < 16) {
            active = points[i];
            break;
        }
    }
    down = true;
}, false);

canvas.addEventListener('mouseup', e => {
    down = false;
    active = null;
}, false);

canvas.addEventListener('mouseout', e => {
    down = false;
    active = null;
}, false);

canvas.addEventListener('mousemove', e => {
    const rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    if (down) {
        if (active) {
            active.x = mouseX;
            active.y = mouseY;
            render();
        }
    }
    e.stopPropagation();
}, false);
