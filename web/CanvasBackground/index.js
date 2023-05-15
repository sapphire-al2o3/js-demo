const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

document.getElementById('test').addEventListener('click', e => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundImage = 'url(penguin.jpg)';
}, false);
