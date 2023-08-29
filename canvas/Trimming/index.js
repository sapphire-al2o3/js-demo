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
    { x: 220, y: 220 },
    { x: 120, y: 120 }
];

const image = document.getElementById('image');

// ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
// ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

ctx.strokeStyle = '#000';
ctx.fillStyle = 'rgba(0,0,0,0.4)';

const drawRect = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image, 0, 0);
    ctx.fillRect(0, 0, canvas.width, rect.y);
    ctx.fillRect(0, corner[0].y, corner[0].x, rect.h);
    ctx.fillRect(corner[1].x, corner[1].y, canvas.width - corner[1].x, rect.h);
    ctx.fillRect(0, corner[2].y, canvas.width, canvas.height - corner[2].y);

    ctx.lineWidth = 1.0;
    ctx.beginPath();
    
    ctx.rect(rect.x + 0.5, rect.y + 0.5, rect.w, rect.h);
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

    let mx = (rect.x + rect.w / 2) ^ 0;
    let my = (rect.y + rect.h / 2) ^ 0;
    ctx.moveTo(mx - 20, my);
    ctx.lineTo(mx + 20, my);
    ctx.moveTo(mx, my - 20);
    ctx.lineTo(mx, my + 20);
    ctx.stroke();
};

function distance2(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    return dx * dx + dy * dy;
}

const min = 50;

function clamp(a, b) {
    let d = Math.abs(a - b);
    if (d < 50) 
    return 
}

canvas.addEventListener('mousedown', e => {
    const r = e.target.getBoundingClientRect();
    p.x = e.clientX - r.left;
    p.y = e.clientY - r.top;
    for (let i = 0; i < corner.length; i++) {
        if (distance2(corner[i], p) < 24 * 24) {
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
                if (min > corner[1].x - corner[0].x) corner[0].x = corner[1].x - min;
                if (min > corner[2].y - corner[0].y) corner[0].y = corner[2].y - min;
                corner[1].y = corner[0].y;
                corner[2].x = corner[0].x;
                break;
            case 1:
                if (min > corner[1].x - corner[0].x) corner[1].x = corner[0].x + min;
                if (min > corner[3].y - corner[1].y) corner[1].y = corner[3].y - min;
                corner[0].y = corner[1].y;
                corner[3].x = corner[1].x;
                break;
            case 2:
                if (min > corner[3].x - corner[2].x) corner[2].x = corner[3].x - min;
                if (min > corner[2].y - corner[0].y) corner[2].y = corner[0].y + min; 
                corner[0].x = corner[2].x;
                corner[3].y = corner[2].y;
                break;
            case 3:
                if (min > corner[3].x - corner[2].x) corner[3].x = corner[2].x + min;
                if (min > corner[3].y - corner[1].y) corner[3].y = corner[1].y + min; 
                corner[1].x = corner[3].x;
                corner[2].y = corner[3].y;
                break;
            case 4:
                let w2 = rect.w / 2 ^ 0;
                let h2 = rect.h / 2 ^ 0;
                corner[0].x = corner[2].x = corner[4].x - w2;
                corner[1].x = corner[3].x = corner[4].x + w2;
                corner[0].y = corner[1].y = corner[4].y - h2;
                corner[2].y = corner[3].y = corner[4].y + h2;
                break;
        }

        rect.x = corner[0].x ^ 0;
        rect.y = corner[0].y ^ 0;
        rect.w = corner[3].x - corner[0].x ^ 0;
        rect.h = corner[3].y - corner[0].y ^ 0;

        corner[4].x = corner[0].x + (rect.w / 2 ^ 0);
        corner[4].y = corner[0].y + (rect.h / 2 ^ 0);

        drawRect();
    }
}, false);

canvas.addEventListener('mouseup', e => {
    down = false;
}, false);

document.getElementById('trimming').addEventListener('click', e => {
    const result = document.getElementById('result');
    result.width = rect.w;
    result.height = rect.h;
    result.getContext('2d').drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
}, false);

drawRect();