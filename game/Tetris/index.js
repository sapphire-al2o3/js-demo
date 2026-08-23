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
keyState['Enter'] = 0;
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

function resetKey() {
    for (let key in keyState) {
        keyState[key] = 0;
    }
}

const W = canvas.width;
const H = canvas.height;
let x = 6;
let y = 1;

const blockSize = 8;
const stageW = 12;
const stageH = 22;

const offsetX = 8;
const offsetY = -24;

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


let nextBlock = [];
let block = [];
let rotBlock = [];

for (let i = 0; i < 4; i++) {
    block.push({
        x: 0,
        y: 0
    });
    rotBlock.push({
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
        // T
        // 010
        // 111
        block[0].x = 0;
        block[0].y = 1;
        block[1].x = -1;
        block[1].y = 0;
        block[2].x = 0;
        block[2].y = 0;
        block[3].x = 1;
        block[3].y = 0;
    } else if (t === 1) {
        // S
        // 011
        // 110
        block[0].x = 0;
        block[0].y = -1;
        block[1].x = -1;
        block[1].y = 0;
        block[2].x = 0;
        block[2].y = 0;
        block[3].x = 1;
        block[3].y = -1;
    } else if (t === 2) {
        // Z
        // 110
        // 011
        block[0].x = 0;
        block[0].y = -1;
        block[1].x = -1;
        block[1].y = -1;
        block[2].x = 0;
        block[2].y = 0;
        block[3].x = 1;
        block[3].y = 0;
    } else if (t === 3) {
        // O
        // 110
        // 110
        block[0].x = 0;
        block[0].y = -1;
        block[1].x = -1;
        block[1].y = -1;
        block[2].x = 0;
        block[2].y = 0;
        block[3].x = -1;
        block[3].y = 0;
    } else if (t === 4) {
        // J
        // 100
        // 111
        block[0].x = 0;
        block[0].y = 0;
        block[1].x = -1;
        block[1].y = 0;
        block[2].x = -1;
        block[2].y = 1;
        block[3].x = 1;
        block[3].y = 0;
    } else if (t === 5) {
        // L
        // 001
        // 111
        block[0].x = 0;
        block[0].y = 0;
        block[1].x = -1;
        block[1].y = 0;
        block[2].x = 1;
        block[2].y = 1;
        block[3].x = 1;
        block[3].y = 0;
    } else if (t === 6) {
        // I
        // 1111
        block[0].x = -2;
        block[0].y = -1;
        block[1].x = -1;
        block[1].y = -1;
        block[2].x = 0;
        block[2].y = -1;
        block[3].x = 1;
        block[3].y = -1;
    }
}

let frame = 0;
let pause = false;
let blockType = 3;
let score = 0;
let lineScores = [
    0, 100, 300, 500, 800
];

initStage();
createBlock(blockType);

function rotateBlock(b, r) {

    if (blockType === 3) {
        for (let i = 0; i < b.length; i++) {
            r[i].x = b[i].x;
            r[i].y = b[i].y;
        }
        return;
    }

    let dx = 0;
    let dy = 0;

    if (blockType === 6) {
        dx = 0.5;
        dy = 0.5;
    }
    for (let i = 0; i < b.length; i++) {
        let x = b[i].x + dx;
        let y = b[i].y + dy;
        r[i].x = -y - dx ^ 0;
        r[i].y = x - dy ^ 0;
    }
}

function isGround() {
    return hitBlock(x, y + 1, block);
}

function hitBlock(x, y, b) {
    for (let i = 0; i < b.length; i++) {
        if (stage[y + b[i].y][x + b[i].x] > 0) {
            return true;
        }
    }
    return false;
}

function shiftStage(k) {
    for (let i = k - 1; i >= 0; i--) {
        for (let j = 1; j < stageW - 1; j++) {
            stage[i + 1][j] = stage[i][j];
        }
    }
}

function checkLine(y) {
    let count = 0;
    for (let i = stageH - 2; i >= 0; i--) {
        let fill = true;
        for (let j = 1; j < stageW - 1; j++) {
            if (stage[i][j] === 0) {
                fill = false;
                break;
            }
        }
        if (fill) {
            count++;
            shiftStage(i);
            i++;
        }
    }
    score += lineScores[count];
}

const colors = [
    '#598000',
    '#003000',
    '#75ac57'
];

const numPatterns4x6 = [
    0x699996,
    0x622222,
    0x69124F,
    0xE16196,
    0x6AAAF2,
    0xF8E11E,
    0x68E996,
    0xF12244,
    0x696996,
    0x699716,
];

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

function fillNum(n, x, y, size) {
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

function draw() {
    ctx.fillStyle = '#598000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.fillStyle = '#75ac57';
    // for (let i = 0; i < stageH; i++) {
    //     for (let j = 0; j < stageW; j++) {
    //         if (j % 2 === 0) {
    //             let bx = j * blockSize + offsetX;
    //             let by = i * blockSize + offsetY;
    //             ctx.fillRect(bx, by, blockSize, blockSize);
    //         }
    //     }
    // }

    ctx.fillStyle = '#003000';

    for (let i = 0; i < stageH; i++) {
        for (let j = 0; j < stageW; j++) {
            if (stage[i][j] === 1) {
                let bx = j * blockSize + offsetX;
                let by = i * blockSize + offsetY;
                ctx.fillRect(bx, by, blockSize, blockSize);
            }
        }
    }

    for (let i = 0; i < block.length; i++) {
        let bx = (x + block[i].x) * blockSize + offsetX;
        let by = (y + block[i].y) * blockSize + offsetY;
        ctx.fillRect(bx, by, blockSize, blockSize);
    }

    fillNum(score, 144, 10, 1);
}

let speed = 20;
let fallCount = 0;

loop((dt) => {

    let dx = keyState['ArrowRight'] - keyState['ArrowLeft'];
    let up = keyState['ArrowUp'];
    let down = keyState['ArrowDown'];

    if (keyState['Enter']) {
        pause = !pause;
    }

    if (pause) {
        resetKey();
        return;
    }

    if (keyState['Space']) {
        rotateBlock(block, rotBlock);

        if (!hitBlock(x, y, rotBlock)) {
            for (let i = 0; i < block.length; i++) {
                block[i].x = rotBlock[i].x;
                block[i].y = rotBlock[i].y;
            }
        }
    }

    if (down) {
        frame += 10;
        if (frame > speed) frame = speed;
    }

    if (up) {
        for (let i = y; i < stageH; i++) {
            if (hitBlock(x, i + 1, block)) {
                y = i;
                break;
            }
        }
    }

    resetKey();

    if (hitBlock(x + dx, y, block)) {
        dx = 0;
    }

    x += dx;
    // y += keyY * 4;

    if (frame % speed === 0) {
        frame = 0;

        if (isGround()) {
            for (let i = 0; i < block.length; i++) {
                stage[block[i].y + y][block[i].x + x] = 1;
            }
            
            checkLine();
            
            blockType = Math.random() * 7 ^ 0;
            createBlock(blockType);
            x = 6;
            y = 1;
            
        } else {

            y += 1;
        }
    }
    frame++;

    if (x <= 0) x = 0;
    if (y <= 4) y = 4;
    if (x >= stageW - 1) x = stageW - 1;
    if (y >= stageH - 1) y = stageH - 1;

    draw();

}, 1000 / 30);
