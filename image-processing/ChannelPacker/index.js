const canvasR = document.getElementById('channel-r');
const canvasG = document.getElementById('channel-g');
const canvasB = document.getElementById('channel-b');
const canvasA = document.getElementById('channel-a');
const canvasResult = document.getElementById('result');
const ctxR = canvasR.getContext('2d', { willReadFrequently: true });
const ctxG = canvasG.getContext('2d', { willReadFrequently: true });
const ctxB = canvasB.getContext('2d', { willReadFrequently: true });
const ctxA = canvasA.getContext('2d', { willReadFrequently: true });
const ctxResult = canvasResult.getContext('2d', { willReadFrequently: true });
let w = canvasR.width;
let h = canvasR.height;
let fixSize = false;

function resize(width, height) {
    if (width === w && height === h) {
        return;
    }
    w = width;
    h = height;
    canvasR.width = canvasG.width = canvasB.width = canvasA.width = canvasResult.width = w;
    canvasR.height = canvasG.height = canvasB.height = canvasA.height = canvasResult.height = h;

    ctxR.fillStyle = '#FFF';
    ctxR.fillRect(0, 0, w, h);
    ctxG.fillStyle = '#FFF';
    ctxG.fillRect(0, 0, w, h);
    ctxB.fillStyle = '#FFF';
    ctxB.fillRect(0, 0, w, h);
    ctxA.fillStyle = '#FFF';
    ctxA.fillRect(0, 0, w, h);
}

function grayFilter(ctx) {
    const ret = ctx.getImageData(0, 0, w, h);
    const dst = ret.data;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const k = (i * w + j) * 4;
            y = dst[k];
            dst[k + 1] = y;
            dst[k + 2] = y;
            dst[k + 3] = 255;
        }
    }

    ctx.putImageData(ret, 0, 0);
}

async function load(ctx, file) {
    const image = await createImageBitmap(file);
    if (!fixSize) {
        resize(image.width, image.height);
    }
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, w, h);
    grayFilter(ctx);
    render();
}

async function loadResult(ctx, file) {
    const image = await createImageBitmap(file);
    resize(image.width, image.height);
    ctx.drawImage(image, 0, 0);
    split();
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

canvasResult.addEventListener('drop', e => {
    loadResult(ctxResult, e.dataTransfer.files[0]);
    e.preventDefault();
});
canvasResult.addEventListener('dragover', dragover);

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

document.getElementById('fill-g-255').addEventListener('click', e => {
    fill255(ctxG);
    render();
});
document.getElementById('fill-g-0').addEventListener('click', e => {
    fill0(ctxG);
    render();
});

document.getElementById('fill-b-255').addEventListener('click', e => {
    fill255(ctxB);
    render();
});
document.getElementById('fill-b-0').addEventListener('click', e => {
    fill0(ctxB);
    render();
});

document.getElementById('fill-a-255').addEventListener('click', e => {
    fill255(ctxA);
    render();
});
document.getElementById('fill-a-0').addEventListener('click', e => {
    fill0(ctxA);
    render();
});

function swap(ctx0, ctx1) {
    const img0 = ctx0.getImageData(0, 0, w, h);
    const img1 = ctx1.getImageData(0, 0, w, h);

    ctx0.putImageData(img1, 0, 0);
    ctx1.putImageData(img0, 0, 0);
}

document.getElementById('swap-rg').addEventListener('click', e => {
    swap(ctxR, ctxG);
    render();
});

document.getElementById('swap-gb').addEventListener('click', e => {
    swap(ctxG, ctxB);
    render();
});

document.getElementById('swap-ba').addEventListener('click', e => {
    swap(ctxB, ctxA);
    render();
});

document.getElementById('fix-size').addEventListener('change', e => {
    fixSize = e.target.checked;
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

function split() {
    const ret = ctxResult.getImageData(0, 0, w, h);
    const ir = ctxR.getImageData(0, 0, w, h);
    const ig = ctxG.getImageData(0, 0, w, h);
    const ib = ctxB.getImageData(0, 0, w, h);
    const ia = ctxA.getImageData(0, 0, w, h);

    const dst = ret.data;
    const sr = ir.data;
    const sg = ig.data;
    const sb = ib.data;
    const sa = ia.data;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const k = (i * w + j) * 4;
            sr[k] = sr[k + 1] = sr[k + 2] = dst[k];
            sg[k] = sg[k + 1] = sg[k + 2] = dst[k + 1];
            sb[k] = sb[k + 1] = sb[k + 2] = dst[k + 2];
            sa[k] = sa[k + 1] = sa[k + 2] = dst[k + 3];
            sr[k + 3] = sg[k + 3] = sb[k + 3] = sa[k + 3] = 255;
        }
    }

    ctxR.putImageData(ir, 0, 0);
    ctxG.putImageData(ig, 0, 0);
    ctxB.putImageData(ib, 0, 0);
    ctxA.putImageData(ia, 0, 0);
}

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
