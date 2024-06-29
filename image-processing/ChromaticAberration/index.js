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

    let offset = 4;

    function render() {
        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let or = j - offset;
                if (or < 0) or = 0;
                let ob = j + offset;
                if (ob >= w) ob = w - 1;

                let r = data[(i * w + or) * 4];
                let g = data[index + 1];
                let b = data[(i * w + ob) * 4 + 2];
                
                
                ret[index] = r;
                ret[index + 1] = g;
                ret[index + 2] = b;
                ret[index + 3] = 255
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    document.body.appendChild(createSlider('offset', 0.5, v => {
        offset = v * 8 ^ 0;
        render();
    }));
};
