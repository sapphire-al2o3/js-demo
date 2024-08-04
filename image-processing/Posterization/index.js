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

    let level = 4;
    let step = 256 / level ^ 0;

    function render() {

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let r = data[index];
                let g = data[index + 1];
                let b = data[index + 2];
                
                r = (r / step ^ 0) * step;
                g = (g / step ^ 0) * step;
                b = (b / step ^ 0) * step;

                r = r > 255 ? 255 : r;
                g = g > 255 ? 255 : g;
                b = b > 255 ? 255 : b;

                ret[index] = r;
                ret[index + 1] = g;
                ret[index + 2] = b;
                ret[index + 3] = 255
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    document.body.appendChild(createSlider('level', level / 8, v => {
        level = (v * 8 ^ 0) + 2;
        step = 255 / level ^ 0;
        render();
    }));
};
