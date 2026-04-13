const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const maxSize = 128 * 1024;
const content = document.getElementById('content');

async function loadPng(buffer, x) {
    const blob = new Blob([buffer], { type: 'image/png' });
    const image = await createImageBitmap(blob);
    ctx.drawImage(image, x, 0);
    image.close();
}

function loadBmp(buffer, w, h, x) {
    const image = ctx.createImageData(w, h);
    const data  = image.data;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let k = (i * w + j) * 4;
            let l = ((h - i - 1) * w + j) * 4;
            data[k] = buffer[l + 2];
            data[k + 1] = buffer[l + 1];
            data[k + 2] = buffer[l + 0];
            data[k + 3] = buffer[l + 3];
        }
    }
    ctx.putImageData(image, x, 0);
}

async function load(file) {
    const buffer = await file.arrayBuffer();
    // const byteLength = buffer.byteLength > maxSize ? maxSize : buffer.byteLength;
    // const bytes = new Uint8Array(buffer, 0, byteLength);

    const dataView = new DataView(buffer);
    let offset = 0;

    let texts = [];

    dataView.getInt16(0, true);
    // リソースタイプ
    // 1:アイコン
    // 2:カーソル
    let type = dataView.getUint16(2, true);
    // アイコン数
    let count = dataView.getUint16(4, true);

    texts.push(`Count: ${count}`);
    texts.push('');

    // IconInfoHeader
    offset += 6;

    let files = [];

    for (let i = 0; i < count; i++) {
        let width = dataView.getUint8(offset, true);
        let height = dataView.getUint8(offset + 1, true);
        if (width === 0) width = 256;
        if (height === 0) height = 256;

        let colorCount = dataView.getUint8(offset + 2, true);
        // reserve(1)
        let x = dataView.getUint16(offset + 4, true);
        let y = dataView.getUint16(offset + 6, true);
        let dibSize = dataView.getUint32(offset + 8, true);
        let dibOffset = dataView.getUint32(offset + 12, true);

        offset += 16;

        texts.push(`Width: ${width}`);
        texts.push(`Height: ${height}`);
        texts.push(`ColorCount: ${colorCount}`);
        texts.push(`Size: ${dibSize}`);
        texts.push(`Offset: 0x${dibOffset.toString(16)}`);
        texts.push(``);

        files.push({
            size: dibSize,
            offset: dibOffset,
            width: width,
            height: height
        });
    }
    content.textContent = texts.join('\n');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let offsetX = 0;
    for (let i = 0; i < files.length; i++) {
        offset = files[i].offset;
        let s = dataView.getUint8(offset, true);
        if (s === 0x89) {
            // PNG
            console.log('PNG');
            console.log('0x' + offset.toString(16))
            loadPng(new Uint8Array(buffer, files[i].offset, files[i].size), offsetX);
        } else if (s === 40) {
            // BMP
            let biWidth = dataView.getInt32(offset + 4, true);
            let biHeight = dataView.getInt32(offset + 8, true);
            let biPlanes = dataView.getUint16(offset + 12, true);
            let biBitCount = dataView.getUint16(offset + 14, true);
            let biCompression = dataView.getUint16(offset + 16, true);
            let biSizeImage = dataView.getUint32(offset + 20, true);
            let biXPixPerMeter = dataView.getUint32(offset + 24, true);
            let biYPixPerMeter = dataView.getUint32(offset + 28, true);
            let biClrUsed = dataView.getUint32(offset + 32, true);
            let biClrImportant = dataView.getUint32(offset + 36, true);
            console.log('BMP');
            console.log('0x' + offset.toString(16));
            console.log(`${biWidth} ${biHeight} ${biPlanes} bitCount: ${biBitCount}`);
            console.log(`${biSizeImage}`);
            let stride = ((((biWidth * biBitCount) + 31) & ~31) >> 3);

            let w = files[i].width;
            let h = files[i].height;
            let bpp = biBitCount / 8;
            loadBmp(new Uint8Array(buffer, offset + 40, w * h * bpp), w, h, offsetX);
        }
        offsetX += files[i].width;
    }
}

document.body.addEventListener('drop', e => {
    let file = e.dataTransfer.files[0];

    load(file);

    e.preventDefault();
});

document.body.addEventListener('dragover', e => {
    e.preventDefault();
});
