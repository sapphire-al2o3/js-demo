const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
const num = document.getElementById('num');

const pixels = [];
let size = 24;
let sizeX = 5;
let sizeY = 6;

let w = sizeX * size;
let h = sizeY * size;

canvas.width = w;
canvas.height = h;

let history = [];
let historyId = [];

for (let i = 0; i < sizeY; i++) {
    pixels[i] = [];
    for (let j = 0; j < sizeX; j++) {
        pixels[i][j] = 0;
    }
}

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 400, 400);

// 0x1D18FE31
// 0x3D1F463E
// 0x1D18422E
// 0x3D18C63E
// 0x3F0F421F

function render() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#09F';
    let n = 0;
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            if (pixels[i][j]) {
                ctx.fillRect(j * size, i * size, size, size);
            }
            n = (n << 1) | pixels[i][j];
        }
    }
    ctx.fill();

    num.value = '0x' + n.toString(16).toUpperCase();
}

canvas.addEventListener('click', e => {
    let r = e.target.getBoundingClientRect(),
        x = (e.clientX - r.left) / size ^ 0,
        y = (e.clientY - r.top) / size ^ 0;
    if (x < sizeX && y < sizeY) {
        pixels[y][x] = 1 - pixels[y][x];
        render();
    }
});

render();

function decode() {
    let p = parseInt(num.value, 16);
    for (let i = sizeY - 1; i >= 0; i--) {
        for (let j = sizeX - 1; j >= 0; j--) {
            pixels[i][j] = p & 1;
            p = p >> 1;
        }
    }
    render();
}

document.getElementById('decode').addEventListener('click', e => {
    decode();
});


function save() {
    if (localStorage) {
        const str = JSON.stringify(history);
        localStorage.setItem('p2n', str);
    }
}

function load() {
    if (localStorage) {
        const str = localStorage.getItem('p2n');
        if (str) {
            history = JSON.parse(str); 
            historyId = [];
            for (let i = 0; i < history.length; i++) {
                historyId.push(i);
            }
            index = history.length;
        }
    }
}


function removeListItem(e) {
    const id = parseInt(e.target.getAttribute('index'), 10);
    const index = historyId.indexOf(id);
    historyId.splice(index, 1);
    history.splice(index, 1);
    document.getElementById('wrapper').removeChild(e.target.parentNode);
}

function clickListItem(e) {
    num.value = e.target.getAttribute('val');
    decode();
}

let index = 0;
document.getElementById('add').addEventListener('click', e => {
    const text = document.createElement('label');
    const item = document.createElement('div');
    const removeButton = document.createElement('span');
    text.setAttribute('val', num.value);
    text.textContent = num.value;
    text.addEventListener('click', clickListItem);
    removeButton.setAttribute('index', index);
    removeButton.innerText = '✖';
    removeButton.addEventListener('click', removeListItem);
    const id = 'item-' + index.toString();
    item.setAttribute('id', id);
    item.appendChild(text);
    item.appendChild(removeButton);
    document.getElementById('wrapper').appendChild(item);
    history.push(num.value);
    historyId.push(index);
    index++;
});

