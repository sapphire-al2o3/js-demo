window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    const img = document.getElementById('image');
    canvas.width = img.width;
    canvas.height = img.height;

    let w = canvas.width;
    let h = canvas.height;

    ctx.drawImage(img, 0, 0, w, h);

    let image = ctx.getImageData(0, 0, w, h);
    let result = ctx.createImageData(w, h);
    let data = image.data;
    let ret = result.data;
    let buffer = new Uint8Array(w * h);

    let block = 8;
    let radius = 4;

    const PI2 = Math.PI * 2;

    function drawCircle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, PI2, false);
        ctx.fill();
    }

    function render() {

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let k = (i * w + j) * 4;
                let l = i * w + j;
                let r = data[k];
                let g = data[k + 1];
                let b = data[k + 2];
                let y = (r * 0.299 + g * 0.587 + b * 0.114) ^ 0;
                buffer[l] = y;
            }
        }

        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#444';
        const b = block;
        for (let i = b / 2; i < h; i += b) {
            for (let j = b / 2; j < w; j += b) {
                let k = i * w + j;
                let r = ((255 - buffer[k]) / 255) * radius;
                drawCircle(j, i, r);
            }
        }
    }

    render();

    function dropImage(img, cb) {
        document.body.addEventListener('dragover', e => {
            e.preventDefault();
        }, false);

        document.body.addEventListener('drop', e => {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onload = e => {
                img.src = reader.result;
                img.onload = cb;
            };
            reader.readAsDataURL(file);
            e.preventDefault();
        }, false);
    }

    dropImage(img, () => {
        w = canvas.width = img.width;
        h = canvas.height = img.height;
        ctx.drawImage(img, 0, 0, w, h);
        render(data, b);
    });
};
