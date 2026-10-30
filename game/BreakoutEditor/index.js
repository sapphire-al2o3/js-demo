const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const hard = document.getElementById('hard');
const size = 16;

let down = false;
let start = {
    x: 0,
    y: 0
};

let end = {
    x: 0,
    y: 0
};

let rect = {
    x: 0,
    y: 0,
    w: size,
    h: size
};

function removeBlock(x, y) {
        const k = y * stageW + x;
        const b = map[k];
        
        for (let i = 0; i < b.h; i++) {
            for (let j = 0; j < b.w; j++) {
                let k2 = (b.y + i) * stageW + (b.x + j);
                map[k2] = null;
            }
        }
        const i = block.indexOf(b);
        block.splice(i, 1);
}

canvas.addEventListener('mousedown', e => {
    const r = e.target.getBoundingClientRect();
    const x = (e.clientX - r.left) / size ^ 0;
    const y = (e.clientY - r.top) / size ^ 0;

    start.x = x;
    start.y = y;

    const k = y * stageW + x;

    if (map[k] === null) {
        // const b = {
        //     x: x,
        //     y: y,
        //     w: 1,
        //     h: 1,
        //     s: hard.checked ? -1 : 1
        // };
        // map[k] = b;
        // block.push(b);

        rect.x = start.x * size;
        rect.y = start.y * size;
        rect.w = size;
        rect.h = size;

        down = true;
    } else {
        removeBlock(x, y);
    }

    
    draw();

}, false);

canvas.addEventListener('mouseup', e => {
    if (down) {
        const r = e.target.getBoundingClientRect();
        const x = (e.clientX - r.left) / size ^ 0;
        const y = (e.clientY - r.top) / size ^ 0;

        const minX = Math.min(start.x, x);
        const minY = Math.min(start.y, y);
        const maxX = Math.max(start.x, x);
        const maxY = Math.max(start.y, y);

        const b = {
            x: minX,
            y: minY,
            w: maxX - minX + 1,
            h: maxY - minY + 1,
            s: hard.checked ? -1 : 1
        };
        for (let i = 0; i < b.h; i++) {
            for (let j = 0; j < b.w; j++) {
                let k = (b.y + i) * stageW + (b.x + j);
                if (map[k] === null) {
                    map[k] = b;
                } else {
                    removeBlock(b.x + j, b.y + i);
                }
            }
        }
        block.push(b);

        draw();
    }
    down = false;
}, false);

canvas.addEventListener('mousemove', e => {
    if (down) {
        const r = e.target.getBoundingClientRect();
        const x = (e.clientX - r.left) / size ^ 0;
        const y = (e.clientY - r.top) / size ^ 0;

        end.x = x;
        end.y = y;

        const minX = Math.min(start.x, x);
        const minY = Math.min(start.y, y);
        const maxX = Math.max(start.x, x);
        const maxY = Math.max(start.y, y);

        rect.x = minX * size;
        rect.y = minY * size;
        rect.w = (maxX - minX + 1) * size;
        rect.h = (maxY - minY + 1) * size;

        draw();
        drawRect();
    }
}, false);


const W = canvas.width;
const H = canvas.height;
const T = 8;

const padW = 24;
let x = 80;
let y = 120;

const blockSize = 8;
const stageW = 20;
const stageH = 22;

const offsetX = 8;
const offsetY = -24;


let stage0 = [
    [1,0,0,2,1],[1,2,0,2,1],[1,4,0,2,1],

];
let block = [];
let map = [];

const blockNumX = 8;
const blockNumY = 8;
const blockSizeW = 32;
const blockSizeH = 16;
function initStage() {
    block = [];
    for (let j = 0; j < blockNumY; j++) {
        for (let i = 0; i < blockNumX; i++) {
            const b = {
                x: i * 2 + 2,
                y: j * 1 + 1,
                w: 2,
                h: 1,
                s: 1
            };
            block.push(b);
            const k = b.y * stageW + b.x;
            map[k] = b;
            map[k + 1] = b;
        }
    }
    // block.push({
    //     x: 16,
    //     y: 8 * blockSizeH + 24,
    //     w: blockSizeW * 8,
    //     h: blockSizeH,
    //     s: -1
    // });
}


let frame = 0;
let pause = false;
let gameover = false;
let score = 0;
let life = 1;

const numPatterns5x6 = [
    0x1DBDEF6E,
    0x1C6318C6,
    0x1DB1999F,
    0x1DB30F6E,
    0x0EFDEFE3,
    0x3F8F0C7E,
    0x1D8F6F6E,
    0x3FB198C6,
    0x1DB76F6E,
    0x1DBDBC6E
];
const numW = 5;
const numH = 6;

function fillNum(n, x, y, size = 1) {
    let d = n;
    let charSize = size * (numW + 1);
    let k = 0;
    do {
        let p = numPatterns5x6[d % 10];
        let b = numW * numH - 1;
        for (let i = 0; i < numH; i++) {
            for (let j = 0; j < numW; j++) {
                if ((p >> b) & 1) {
                    ctx.fillRect(j * size + x - charSize * k, i * size + y, size, size);
                }
                b--;
            }
        }
        d = d / 10 ^ 0;
        k++;
    } while (d > 0)
}

const charPatterns5x6 = [
    0x1DBDFF7B,
    0x3DBF6F7E,
    0x1DBC636E,
    0x3DBDEF7E,
    0x3F8F631F,
    0x3F8F6318,
    0x1D8C6F6E,
    0x37BFEF7B,
    0x0C6318C6,
    0x0631EF6E,
    0x37BF6F7B,
    0x318C631F,
    0x23BFFF7B,
    0x27BFFF79,
    0x1DBDEF6E,
    0x3DBDEFD8,
    0x1DBDFF6F,
    0x3DBDFB7B,
    0x1F8E38FE,
    0x3E6318C6,
    0x37BDEF6E,
    0x37BDEDC4,
    0x37BFFF71,
    0x37B76F7B,
    0x37B78CC6,
    0x3E33331F
];

function fillText(s, x, y, size = 1) {
    let charSize = size * 6;

    for (let k = 0; k < s.length; k++) {
        let d = s[k].charCodeAt(0) - 'A'.charCodeAt(0);
        let p = charPatterns5x6[d];
        let b = 0;
        for (let i = 6 - 1; i >= 0; i--) {
            for (let j = 5 - 1; j >= 0; j--) {
                if ((p >> b) & 1) {
                    ctx.fillRect(j * size + x + charSize * k, i * size + y, size, size);
                }
                b++;
            }
        }
    }
}

const colors = [
    '#598000',
    '#003000',
    '#26560a'
];

function drawBall() {
    const x = ball.x ^ 0;
    const y = ball.y ^ 0;
    ctx.fillStyle = colors[2];
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawBlock() {
    ctx.fillStyle = colors[1];
    for (let i = 0; i < block.length; i++) {
        if (block[i].s > 0) {
            ctx.fillRect(block[i].x * size, block[i].y * size, block[i].w * size, block[i].h * size);
        }
    }
    ctx.fillStyle = colors[2];
    for (let i = 0; i < block.length; i++) {
        if (block[i].s > 0) {
            ctx.fillRect(block[i].x * size, block[i].y * size, block[i].w * size - 1, block[i].h * size - 1);
        }
    }

    ctx.fillStyle = colors[1];
    for (let i = 0; i < block.length; i++) {
        if (block[i].s === -1) {
            ctx.fillRect(block[i].x * size, block[i].y * size, block[i].w * size, block[i].h * size);
        }
    }
}

function drawRect() {
    ctx.strokeStyle = '#F00';
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}

function draw() {
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.fillStyle = colors[2];
    // ctx.fillRect(0, 0, W, T);

    ctx.fillStyle = colors[1];

    drawBlock();
}

function reset() {
    for (let i = 0; i < stageW; i++) {
        for (let j = 0; j < 16; j++) {
            map[i * stageW + j] = null;
        }
    }


    initStage();
}


reset();

draw();
