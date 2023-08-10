const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const rect = { x: 20, y: 20, w: 200, h: 200 };
let down = false;
let selectedIndex = 0;
let p = { x: 0, y: 0 };
let corner = [
    { x: 20, y: 20 },
    { x: 220, y: 20 },
    { x: 20, y: 220 },
    { x: 220, y: 220 }
];

ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
// ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

ctx.strokeStyle = '#000';

const drawRect = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1.0;
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

function distance2(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    return dx * dx + dy * dy;
}

canvas.addEventListener('mousedown', e => {
    const r = e.target.getBoundingClientRect();
    p.x = e.clientX - r.left;
    p.y = e.clientY - r.top;
    for (let i = 0; i < 4; i++) {
        if (distance2(corner[i], p) < 16 * 16) {
            console.log('hit');
            selectedIndex = i;
            down = true;
            break;
        }
    }

}, false);

canvas.addEventListener('mousemove', e => {
    if (down) {
        const r = e.target.getBoundingClientRect();
        corner[selectedIndex].x = e.clientX - r.left;
        corner[selectedIndex].y = e.clientY - r.top;
        
        switch (selectedIndex) {
            case 0:
                corner[1].y = corner[0].y;
                corner[2].x = corner[0].x;
                break;
            case 1:
                corner[0].y = corner[1].y;
                corner[3].x = corner[1].x;
                break;
            case 2:
                corner[0].x = corner[2].y;
                corner[3].y = corner[2].y;
                break;
            case 3:
                corner[1].x = corner[3].x;
                corner[2].y = corner[3].y;
                break;
        }

        rect.x = corner[0].x;
        rect.y = corner[0].y;
        rect.w = corner[3].x - corner[0].x;
        rect.h = corner[3].y - corner[0].y;

        drawRect();
    }
}, false);

canvas.addEventListener('mouseup', e => {
    down = false;
}, false);

drawRect();