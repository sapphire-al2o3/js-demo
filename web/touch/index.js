const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    const touches = e.touches;
    ctx.moveTo(touches[0].pageX, touches[0].pageY);
    for (let i = 1; i < touches.length; i++) {
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
    }
    ctx.fill();
}, false);
