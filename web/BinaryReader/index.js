
async function load(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    size.textContent = `${bytes.length} byte`;

    let lines = bytes.length / 16 ^ 0;
    let text = '';
    let index = 0;

    for (let j = 0; j < lines; j++) {
        for (let i = 0; i < 16; i++) {
            const b = bytes[index];
            text += (b >> 4 & 0xF).toString(16) + (b & 0xF).toString(16);
            index++;
            if (i == 7) text += ' ';
        }
        text += '\n';
    }

    content.textContent = text;
}

const content = document.getElementById('content');
const size = document.getElementById('size');


document.body.addEventListener('drop', (e) => {
    load(e.dataTransfer.files[0]);
    e.preventDefault();
}, false);

document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
}, false);
