const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const parrot = document.getElementById('parrot');

const w = parrot.clientWidth;
const h = parrot.clientHeight;
const cw = canvas.width;
const ch = canvas.height;

ctx.drawImage(parrot, 0, 0);
const imageData = ctx.getImageData(0, 0, w, h);
const result = ctx.createImageData(cw, ch);

ctx.clearRect(0, 0, cw, ch);

console.log(w, h);

let offsetX = ((cw - w) / 2 ^ 0) % w - w;
let offsetY = ((ch - h) / 2 ^ 0) % h - h;
let shiftX = false;
let shiftY = false;

const src = new Uint32Array(imageData.data.buffer);
const dst = new Uint32Array(result.data.buffer);

function render() {
    ctx.clearRect(0, 0, cw, ch);
    let y = 0;
    for (let i = offsetY; i < ch + h / 2 ^ 0; i += h) {
        let ox = 0;
        if (shiftX) {
            ox = (y & 1) * w / 2 ^ 0;
        }
        let x = 0;
        for (let j = offsetX; j < cw + ox; j += w) {
            let oy = 0;
            if (shiftY) {
                oy = (x & 1) * h / 2 ^ 0;
            }
            ctx.drawImage(parrot, j - ox, i - oy);
            x++;
        }
        y++;
    }
}

const check = createCheckbox('center', v => {
    if (v) {
        offsetX = ((cw - w) / 2 ^ 0) % w - w;
        offsetY = ((ch - h) / 2 ^ 0) % h - h;
    } else {
        offsetX = 0;
        offsetY = 0;
    }
    render();
});

check.querySelector('input').checked = true;
document.body.appendChild(check);

document.body.appendChild(createCheckbox('shiftX', v => {
    shiftX = v;
    render();
}));

document.body.appendChild(createCheckbox('shiftY', v => {
    shiftY = v;
    render();
}));

// ctx.putImageData(result, 0, 0);


function blit(src, sw, sh, dst, dw, dh, x, y) {
    for (let i = 0; i < sh; i++) {
        const dy = i + y;
        if (dy < 0 || dy >= dh) {
            continue;
        }
        for (let j = 0; j < sw; j++) {
            const dx = j + x;
            if (dx < 0 || dx >= dw) {
                continue;
            }
            const dk = dy * dw + dx;
            const sk = i * sw + j;
            dst[dk] = src[sk];
        }
    }
}

function blitLine(src, sh, sw, dst, dw, dh, y, offsetX, offsetY) {
    const sy = (y - offsetY) % sh * sw;
    for (let i = 0; i < dw; i++) {
        const dk = y * dw + i;
        const sx = (i - offsetX) % sw;
        const sk = sy + sx;
        dst[dk] = src[sk];
    }
}


console.time('tiling 2');

// 1ラインずつ描画
for (let i = 0; i < ch; i++) {
    blitLine(src, w, h, dst, cw, ch, i, offsetX, offsetY);
    // const sy = (i - offsetY) % h * w;
    // for (let j = 0; j < cw; j++) {
    //     const dk = i * cw + j;
    //     const sx = (j - offsetX) % w;
    //     const sk = sy + sx; 
    //     dst[dk] = src[sk];
    // }
}

console.timeEnd('tiling 2');

console.time('tiling 1');

// 1画像ずつ描画
for (let i = offsetY; i < ch; i += h) {
    for (let j = offsetX; j < cw; j += w) {
        // ctx.drawImage(parrot, j, i);
        blit(src, w, h, dst, cw, ch, j, i);
    }
}

console.timeEnd('tiling 1');

ctx.putImageData(result, 0, 0);
