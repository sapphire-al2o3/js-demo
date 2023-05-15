const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#AAA';
ctx.fillRect(0, 0, canvas.width, canvas.height);

document.getElementById('test').addEventListener('click', e => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundImage = 'url(penguin.jpg)';
}, false);


document.getElementById('test2').addEventListener('click', e => {
    canvas.width += 1;
    canvas.width += -1;
}, false);
