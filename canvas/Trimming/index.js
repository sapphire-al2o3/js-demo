const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const rect = { x: 20, y: 20, w: 200, h: 200 };

ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
// ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

ctx.strokeStyle = '#000';

const drawRect = () => {
    ctx.beginPath();
    
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.stroke();

    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(rect.x + 20, rect.y);
    ctx.lineTo(rect.x, rect.y);
    ctx.lineTo(rect.x, rect.y + 20);

    ctx.moveTo(rect.x + rect.w - 20, rect.y);
    ctx.lineTo(rect.x + rect.w, rect.y);
    ctx.lineTo(rect.x + rect.w, rect.y + 20);

    ctx.moveTo(rect.x + 20, rect.y + rect.h);
    ctx.lineTo(rect.x, rect.y + rect.h);
    ctx.lineTo(rect.x, rect.y + rect.h - 20);

    ctx.moveTo(rect.x + rect.w - 20, rect.y + rect.h);
    ctx.lineTo(rect.x + rect.w, rect.y + rect.h);
    ctx.lineTo(rect.x + rect.w, rect.y + rect.h - 20);
    ctx.stroke();

};

drawRect();