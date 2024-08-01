window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const img = document.getElementById('image');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = ctx.createImageData(canvas.width, canvas.height);
    const data = image.data;
    const ret = result.data;

    let w = image.width,
        h = image.height;

    function render() {

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let r = data[index];
                let g = data[index + 1];
                let b = data[index + 2];
                
                const step = 64;
                r = (r / step ^ 0) * step;
                g = (g / step ^ 0) * step;
                b = (b / step ^ 0) * step;

                ret[index] = r;
                ret[index + 1] = g;
                ret[index + 2] = b;
                ret[index + 3] = 255
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();
};
