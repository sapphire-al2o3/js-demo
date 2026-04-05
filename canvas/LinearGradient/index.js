const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
let time = 0;
function rgba(r, g, b, a) { return `rgb(${r} ${g} ${b}/${a})`; }

function rgb(r, g, b) {
    return `#${r.toString(16)}${g}${b}`;
}

function toHex(x) {
    return (x > 15 ? '' : '0') + x.toString(16);
}

function toColorCode(r, g, b) {
    const c = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return c.toUpperCase();
}

let color0 = [255, 0, 0];
let color1 = [0, 0, 0];
let colors = [color0, color1];
let point0 = { x: 100, y: 100 };
let point1 = { x: 300, y: 300 };
let points = [point0, point1];

let offsets = [0, 1];

let clickX = 0;
let clickY = 0;
let mouseX = 0;
let mouseY = 0;
let down = false;
let anchor = true;
let hover = false;

function getColor(i) {
    return rgba(...colors[i], 1);
}

function getPointColor(i) {
    let r = colors[i][0];
    let g = colors[i][1];
    let b = colors[i][2];
    let y = (r + g + b) / 3 ^ 0;
    return y >= 140 ? '#444' : '#FFF';
}

function lerpColor(x, y, t) {
    let r = colors[x][0] * (1 - t) + colors[y][0] * t;
    let g = colors[x][1] * (1 - t) + colors[y][1] * t;
    let b = colors[x][2] * (1 - t) + colors[y][2] * t;
    return [r ^ 0, g ^ 0, b ^ 0];
}

function render() {
    
    let x0 = point0.x,
        y0 = point0.y,
        x1 = point1.x,
        y1 = point1.y;
    let grad3 = ctx.createLinearGradient(x0, y0, x1, y1);
    for (let i = 0; i < colors.length; i++) {
        grad3.addColorStop(offsets[i], getColor(i));
    }
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, 400, 400);

    if (anchor || hover) {
        ctx.strokeStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(point0.x, point0.y);
        ctx.lineTo(point1.x, point1.y);
        ctx.stroke();
        for (let i = 0; i < points.length; i++) {
            ctx.strokeStyle = getPointColor(i);
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2, false);
            ctx.stroke();
        }
    }
};

render();

function changeColor(v, id) {
    let index = parseInt(document.getElementById(id).getAttribute('index'));
    colors[index] = v;
    render();
}

const colorsUI = document.getElementById('colors');

const colorUI0 = createColor('color0', '#FF0000', changeColor);
colorUI0.querySelector('#color0').setAttribute('index', '0');
colorsUI.appendChild(colorUI0);

const colorUI1 = createColor('color1', '#000000', changeColor);
colorUI1.querySelector('#color1').setAttribute('index', '1');
colorsUI.appendChild(colorUI1);

document.body.appendChild(createCheckbox('anchor', v => {
    anchor = v;
    render();
}, true));

document.getElementById('add').addEventListener('click', () => {
    let newOffset = (offsets[0] + offsets[1]) * 0.5;
    offsets.push(newOffset);

    let newColor = lerpColor(0, 1, 0.5);
    colors.push(newColor);

    let x = (points[0].x + points[1].x) * 0.5;
    let y = (points[0].y + points[1].y) * 0.5;
    points.push({x, y});

    let n = 2;
    let id = 'color' + n;
    const newColorUI = createColor(id, toColorCode(...colors[n]), changeColor);
    newColorUI.querySelector('#' + id).setAttribute('index', n);
    colorsUI.insertBefore(newColorUI, colorUI1);
}, false);

canvas.addEventListener('mousedown', e => {
    const rect = e.target.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    for (let i = 0; i < points.length; i++) {
        let dx = points[i].x - clickX;
        let dy = points[i].y - clickY;
        let d = dx * dx + dy * dy;
        if (d < 36) {
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
            hover = false;
            active.x = mouseX;
            active.y = mouseY;
            render();
        }
    } else {
        hover = true;
        render();
    }
    e.stopPropagation();
}, false);

canvas.addEventListener('mouseout', e => {
    hover = false;
    render();
}, false);
