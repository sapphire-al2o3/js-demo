const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;

let grid = true;

function render() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#7F7F7F';
    ctx.lineWidth = 5.0;

    const s = 38;
    const ox = 16;
    const oy = 16;

    if (grid) {

        for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.moveTo(i * s + ox, 0);
            ctx.lineTo(i * s + ox, h);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * s + oy);
            ctx.lineTo(w, i * s + oy);
            ctx.stroke();
        }

        for (let i = -10; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 2 * s + ox, oy - s * 2);
            ctx.lineTo((i * 2 + 12) * s + ox, s * 10 + oy);
            ctx.stroke();
        }

        for (let i = -10; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo((i * 2 + 12) * s + ox, oy - s * 2);
            ctx.lineTo(i * 2 * s + ox, s * 10 + oy);
            ctx.stroke();
        }
    }

    ctx.fillStyle = '#DDD';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.beginPath();
            ctx.arc(i * s * 4 + ox, j * s * 4 + oy, 5, 0, Math.PI * 2, false);
            ctx.fill();
        }
    }

    ctx.fillStyle = '#000';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.beginPath();
            ctx.arc(i * s * 4 + ox, j * s * 4 + oy, 3.5, 0, Math.PI * 2, false);
            ctx.fill();
        }
    }
}

document.body.appendChild(createCheckbox('grid', (v, id) => {
    grid = v;
    render();
}, true), false);

render();
