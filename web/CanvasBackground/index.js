const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#AAA';
ctx.fillRect(0, 0, canvas.width, canvas.height);

document.getElementById('load').addEventListener('click', e => {
    canvas.style.backgroundImage = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundImage = 'url(penguin.jpg)';
}, false);


document.getElementById('refresh').addEventListener('click', e => {
    canvas.width += 1;
    canvas.width += -1;
}, false);
