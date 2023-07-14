const target = document.getElementById('paste');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function load(file) {
    const image = await createImageBitmap(file);
    ctx.drawImage(image, 0, 0);
}

target.addEventListener('paste', e => {
    const files = e.clipboardData.files;
    if (files.length > 0) {
        if (files[0].type == 'image/png') {
            load(files[0]);
        }
    }
});