const canvasR = document.getElementById('channel-r');
const canvasG = document.getElementById('channel-g');
const canvasB = document.getElementById('channel-b');
const canvasA = document.getElementById('channel-a');
const canvasResult = document.getElementById('result');
const ctxR = canvasR.getContext('2d');
const ctxG = canvasG.getContext('2d');
const ctxB = canvasB.getContext('2d');
const ctxA = canvasA.getContext('2d');
const ctxResult = canvasResult.getContext('2d');
let w = canvasR.width;
let h = canvasR.height;

function resize(width, height) {
    if (width === w && height === h) {
        return;
    }
    w = width;
    h = height;
    canvasR.width = canvasG.width = canvasB.width = canvasA.width = canvasResult.width = w;
    canvasR.height = canvasG.height = canvasB.height = canvasA.height = canvasResult.height = h;
}

async function load(ctx, file) {
    const image = await createImageBitmap(file);
    resize(image.width, image.height);
    ctx.drawImage(image, 0, 0);
    render();
}

function dragover(e) {
    e.preventDefault();
}

canvasR.addEventListener('drop', e => {
    load(ctxR, e.dataTransfer.files[0]);
    e.preventDefault();
});
canvasR.addEventListener('dragover', dragover);

canvasG.addEventListener('drop', e => {
    load(ctxG, e.dataTransfer.files[0]);
    e.preventDefault();
});
canvasG.addEventListener('dragover', dragover);

canvasB.addEventListener('drop', e => {
    load(ctxB, e.dataTransfer.files[0]);
    e.preventDefault();
});
canvasB.addEventListener('dragover', dragover);

canvasB.addEventListener('drop', e => {
    load(ctxB, e.dataTransfer.files[0]);
    e.preventDefault();
});
canvasB.addEventListener('dragover', dragover);

canvasA.addEventListener('drop', e => {
    load(ctxA, e.dataTransfer.files[0]);
    e.preventDefault();
});
canvasA.addEventListener('dragover', dragover);

function fill0(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
}

function fill255(ctx) {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, w, h);
}

document.getElementById('fill-r-255').addEventListener('click', e => {
    fill255(ctxR);
    render();
});
document.getElementById('fill-r-0').addEventListener('click', e => {
    fill0(ctxR);
    render();
});

ctxR.fillStyle = '#FFF';
ctxR.fillRect(0, 0, w, h);
ctxR.fillStyle = '#000';
ctxR.fillRect(0, 0, 100, 100);

ctxG.fillStyle = '#FFF';
ctxG.fillRect(0, 0, w, h);
ctxG.fillStyle = '#000';
ctxG.fillRect(100, 100, 100, 100);

ctxB.fillStyle = '#FFF';
ctxB.fillRect(0, 0, w, h);
ctxB.fillStyle = '#000';
ctxB.fillRect(50, 50, 200, 200);

ctxA.fillStyle = '#FFF';
ctxA.fillRect(0, 0, w, h);
ctxA.fillStyle = '#000';
ctxA.fillRect(200, 200, 50, 50);

function render() {
    const ret = ctxResult.getImageData(0, 0, w, h);
    const sr = ctxR.getImageData(0, 0, w, h).data;
    const sg = ctxG.getImageData(0, 0, w, h).data;
    const sb = ctxB.getImageData(0, 0, w, h).data;
    const sa = ctxA.getImageData(0, 0, w, h).data;

    const dst = ret.data;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const k = (i * w + j) * 4;
            dst[k] = sr[k];
            dst[k + 1] = sg[k];
            dst[k + 2] = sb[k];
            dst[k + 3] = sa[k];
        }
    }

    ctxResult.putImageData(ret, 0, 0);
}

render();
