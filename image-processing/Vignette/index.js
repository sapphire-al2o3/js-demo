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
    
    let range = 1.0;
    let color = [0, 0, 0];

    function render() {

        src = data;
        dst = ret;

        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let r = src[index];
                let g = src[index + 1];
                let b = src[index + 2];

                let x = (j / w - 0.5) * range;
                let y = (i / h - 0.5) * range;
                let t = x * x + y * y;
                if (t > 1) {
                    t = 1;
                }
                r = (r * (1 - t) + color[0] * t) ^ 0;
                g = (g * (1 - t) + color[1] * t) ^ 0;
                b = (b * (1 - t) + color[2] * t) ^ 0;
                
                dst[index] = r;
                dst[index + 1] = g;
                dst[index + 2] = b;
                dst[index + 3] = 255
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    document.body.appendChild(createSlider('range', range / 2, v => {
        range = v * 2;
        render();
    }));

    document.body.appendChild(createColor('color', '#000000', v => {
        color = v;
        render();
    }));
};
