
async function load(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    console.log(bytes.length);

    let lines = bytes.length / 16 ^ 0;
    let text = '';
    let index = 0;

    for (let j = 0; j < lines; j++) {
        for (let i = 0; i < 16; i++) {
            text += bytes[index].toString(16);
            index++;
        }
        text += '\n';
    }

    content.textContent = text;
}

const content = document.getElementById('content');


document.body.addEventListener('drop', (e) => {
    load(e.dataTransfer.files[0]);
    e.preventDefault();
}, false);

document.body.addEventListener('dragover', (e) => {
    e.preventDefault();
}, false);
