const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#AAA';

document.getElementById('fill').addEventListener('click', e => {
    ctx.fillStyle = '#AAA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}, false);

document.getElementById('fill-half').addEventListener('click', e => {
    ctx.fillStyle = '#AAA';
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
}, false);

document.getElementById('line').addEventListener('click', e => {
    ctx.strokeStyle = '#00A';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
}, false);

document.getElementById('clear').addEventListener('click', e => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}, false);

document.getElementById('load').addEventListener('click', e => {
    canvas.style.backgroundImage = 'url(penguin.jpg)';
}, false);

document.getElementById('none').addEventListener('click', e => {
    canvas.style.backgroundImage = 'none';
}, false);


document.getElementById('reset').addEventListener('click', e => {
    canvas.width += 1;
    canvas.width += -1;
}, false);
