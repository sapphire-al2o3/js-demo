'use strict';

let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

async function load(file) {
    const image = await createImageBitmap(file);
    ctx.drawImage(image, 0, 0);
    image.close();
}

canvas.addEventListener('drop', e => {
    let file = e.dataTransfer.files[0];

    load(file);

    e.preventDefault();
});

canvas.addEventListener('dragover', e => {
    e.preventDefault();
});


