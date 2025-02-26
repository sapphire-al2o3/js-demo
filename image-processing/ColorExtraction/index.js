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

    let angle = 0.98,
        length = 200,
        color = [0, 0, 0];

    function clamp(v) {
        return v < 0 ? 0 : v > 255 ? 255 : v;
    }

    function extract(r, g, b, sr, sg, sb) {
        let c = r * sr + g * sg + b * sb;
        if (c === 0) {
            return false;
        }
        let l0 = Math.sqrt(r * r + g * g + b * b);
        let l1 = Math.sqrt(sr * sr + sg * sg + sb * sb);
        c = c / (l0 * l1)
        return c > angle && Math.abs(l0 - l1) < length;
    }

    function render() {
        let width = image.width,
            height = image.height;

        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                let index = (i * width + j) * 4;
                let r = data[index],
                    g = data[index + 1],
                    b = data[index + 2],
                    a = data[index + 3];
                if (!extract(r, g, b, color[0], color[1], color[2])) {
                    r = 0;
                    g = 0;
                    b = 0;
                }
                ret[index] = r;
                ret[index + 1] = g;
                ret[index + 2] = b;
                ret[index + 3] = a;
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    img.addEventListener('click', e => {
        let x = e.offsetX;
        let y = e.offsetY;
        let index = (y * image.width + x) * 4;
        let r = data[index],
            g = data[index + 1],
            b = data[index + 2];
        color = [r, g, b];
        console.log(r, g, b);
        render();
    }, false);

    document.body.appendChild(createColor('color', '#000000', v => {
        if (v[0] !== color[0] || v[1] !== color[1] || v[2] !== color[2]) {
            color = v;
            console.log(v);
            render();
        }
    }));

    document.body.appendChild(createSlider('angle', 0, v => {
        angle = v * Math.PI * 2;
        render();
    }));

    document.body.appendChild(createSlider('length', 0, v => {
        length = v;
        render();
    }));
};
