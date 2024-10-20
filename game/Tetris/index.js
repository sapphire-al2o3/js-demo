const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function loop(callback, interval) {
    let elapsed = 0,
        time = Date.now();

    const update = () => {
        const delta = Date.now() - time;
        time = Date.now();
        elapsed += delta;
        if(elapsed >= interval) {
            let n = elapsed / interval ^ 0;
            elapsed -= n * interval;
            callback(delta);
        }

        requestAnimationFrame(update);
    };

    update();
};

let keyState = [];
keyState['ArrowRight'] = 0;
keyState['ArrowLeft'] = 0;
keyState['ArrowUp'] = 0;
keyState['ArrowDown'] = 0;
keyState['Space'] = 0;
document.addEventListener('keydown', e => {
    if (e.code in keyState) {
        keyState[e.code] = 1;
        e.preventDefault();
    }
}, false);

document.addEventListener('keyup', e => {
    if (e.code in keyState) {
        keyState[e.code] = 0;
        e.preventDefault();
    }
}, false);

const W = canvas.width;
const H = canvas.height;
let x = 4;
let y = 0;

const blockSize = 4;
const stageW = 12;
const stageH = 21;

let stage = [];

function initStage() {
    for (let i = 0; i < stageH; i++) {
        stage[i] = [];
        for (let j = 0; j < stageW; j++) {
            stage[i][j] = 0;
        }
    }
    for (let j = 0; j < stageW; j++) {
        stage[stageH - 1][j] = 1;
    }
    for (let i = 0; i < stageH; i++) {
        stage[i][0] = 1;
        stage[i][stageW - 1] = 1;
    }
}

let blockType = 0;
let nextBlock = [];
let block = [];

for (let i = 0; i < 4; i++) {
    block.push({
        x: 0,
        y: 0
    });
}

function createNextBlocks() {
    for (let i = 0; i < 6; i++) {
        nextBlock[i] = i;
    }
    for (let i = 0; i < 5; i++) {
        let k = Math.random() * i ^ 0;
        let t = nextBlcok[i];
        nextBlock[i] = nextBlock[k];
        nextBlock[n] = t;
    }
}

function createBlock(t) {
    if (t === 0) {
        block[0].x = 0;
        block[0].y = -1;
        block[1].x = -1;
        block[1].y = 0;
        block[2].x = 0;
        block[2].y = 0;
        block[3].x = 1;
        block[3].y = 0;
    }
}

function rotateBlock() {
    for (let i = 0; i < block.length; i++) {
        let t = block[i].x;
        block[i].x = block[i].y;
        block[i].y = t;
    }
}

function isGround() {
    for (let i = 0; i < block.length; i++) {
        if (stage[y + block[i].y + 1][x + block[i].x] > 0) {
            return true;
        }
    }
    return false;
}

function checkLine() {
    for (let i = stageH - 2; i >= 0; i++) {
        let fill = true;
        for (let i = 1; i < stageW - 1; i++) {
            if (stage[i][j] === 0) {
                fill = false;
                break;
            }
        }
        if (fill) {

        }
    }
}

function drawBlock() {
    for (let i = 0; i < stageH; i++) {
        for (let j = 0; j < stageW; j++) {

        }
    }

    for (let i = 0; i < block.length; i++) {
        let bx = (x + block[i].x) * blockSize;
        let by = (y + block[i].y) * blockSize;
        ctx.fillRect(bx, by, blockSize, blockSize);
    }
}

let frame = 0;

createBlock(0);

loop((dt) => {

    const keyX = keyState['ArrowRight'] - keyState['ArrowLeft'];
    const keyY = keyState['ArrowDown'] - keyState['ArrowUp'];

    x += keyX * 4;
    // y += keyY * 4;

    if (frame % 20 === 0) {
        y += 1;

        // if (isGround()) {
        //     for (let i = 0; i < block.length; i++) {
        //         stage[block[i].y][block[i].x] = 1;
        //     }
        //     createBlock();
        // }
    }
    frame++;

    if (x <= 4) x = 4;
    if (y <= 4) y = 4;
    if (x >= W - 4) x = W - 4;
    if (y >= H - 4) y = H - 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(x - 4, y - 4, 8, 8);

    drawBlock();

}, 1000 / 30);
