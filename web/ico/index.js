
const maxSize = 128 * 1024;
const content = document.getElementById('content');

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
    }
    content.textContent = texts.join('\n');
}

document.body.addEventListener('drop', e => {
    let file = e.dataTransfer.files[0];

    load(file);

    e.preventDefault();
});

document.body.addEventListener('dragover', e => {
    e.preventDefault();
});
