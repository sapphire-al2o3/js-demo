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

    let colored = false;
    let method = 0;

    let bayer = [
        0, 8, 2, 10,
        12, 4, 14, 6,
        3, 11, 1, 9,
        15, 7, 13, 5
    ];

    bayer = bayer.map(v => v * 16 + 8);

    let screw = [
        15, 4, 8, 12,
        11, 0, 1, 5,
        7, 3, 2, 9,
        14, 10, 6, 13
    ];

    const error = [];
    for (let i = 0; i < w * h * 4; i++) {
        error[i] = 0;
    }

    // Floyd–Steinberg dithering
    function diffusion() {
        let src = data;
        let dst = ret;

        const thr = 127;

        for (let i = 0; i < error.length; i++) {
            error[i] = 0;
        }

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let r = src[index];
                let g = src[index + 1];
                let b = src[index + 2];

                if (colored) {
                    r += error[index];
                    g += error[index + 1];
                    b += error[index + 2];
                    let rr = r > thr ? 255 : 0;
                    let gg = g > thr ? 255 : 0;
                    let bb = b > thr ? 255 : 0;
                    dst[index] = rr;
                    dst[index + 1] = gg;
                    dst[index + 2] = bb;
                    dst[index + 3] = 255;
                    if (j < w - 1) {
                        error[index + 4] += (r - rr) * 7 / 16 ^ 0;
                        error[index + 5] += (g - gg) * 7 / 16 ^ 0;
                        error[index + 6] += (b - bb) * 7 / 16 ^ 0;
                    }
                    if (j > 0 && i < h - 1) {
                        error[index + w * 4 - 4] += (r - rr) * 3 / 16 ^ 0;
                        error[index + w * 4 - 3] += (g - gg) * 3 / 16 ^ 0;
                        error[index + w * 4 - 2] += (b - bb) * 3 / 16 ^ 0;
                    }
                    if (i < h - 1) {
                        error[index + w * 4] += (r - rr) * 5 / 16 ^ 0;
                        error[index + w * 4 + 1] += (g - gg) * 5 / 16 ^ 0;
                        error[index + w * 4 + 2] += (b - bb) * 5 / 16 ^ 0;
                    }
                    if (j < w - 1 && i < h - 1) {
                        error[index + w * 4 + 4] += (r - rr) / 16 ^ 0;
                        error[index + w * 4 + 5] += (g - gg) / 16 ^ 0;
                        error[index + w * 4 + 6] += (b - bb) / 16 ^ 0;
                    }
                } else {
                    let y = (r + g + b) / 3 ^ 0;
                    y += error[i * w + j];
                    let o = y;
                    if (y > thr) {
                        y = 255;
                    } else {
                        y = 0;
                    }
                    dst[index] = y;
                    dst[index + 1] = y;
                    dst[index + 2] = y;
                    dst[index + 3] = 255;

                    let err = o - y;
                    if (j < w - 1) {
                        error[i * w + j + 1] += err * 7 / 16 ^ 0;
                    }
                    if (j > 0 && i < h - 1) {
                        error[(i + 1) * w + j - 1] += err * 3 / 16 ^ 0;
                    }
                    if (i < h - 1) {
                        error[(i + 1) * w + j] += err * 5 / 16 ^ 0;
                    }
                    if (j < w - 1 && i < h - 1) {
                        error[(i + 1) * w + j + 1] += err / 16 ^ 0;
                    }
                }
            }
        }
        ctx.putImageData(result, 0, 0);
    }

    function ordered() {

        let src = data;
        let dst = ret;

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let r = src[index];
                let g = src[index + 1];
                let b = src[index + 2];

                if (colored) {
                    let th = bayer[(i % 4) * 4 + (j % 4)];
                    dst[index] = th <= r ? 255 : 0;
                    dst[index + 1] = th <= g ? 255 : 0;
                    dst[index + 2] = th <= b ? 255 : 0;
                    dst[index + 3] = 255;
                } else {
                    let y = (r + g + b) / 3 ^ 0;
                    if (bayer[(i % 4) * 4 + (j % 4)] <= y) {
                        y = 255;
                    } else {
                        y = 0;
                    }
                    dst[index] = y;
                    dst[index + 1] = y;
                    dst[index + 2] = y;
                    dst[index + 3] = 255;
                }
            }
        }
        ctx.putImageData(result, 0, 0);
    }

    function render() {
        if (method === 0) {
            ordered();
        } else if (method === 1) {
            diffusion();
        }
    }

    render();

    document.body.appendChild(createCheckbox('colored', v => {
        colored = v;
        render();
    }));

    document.body.appendChild(createRadio(['ordered', 'dissufion'], (v, id, i) => {
        method = i;
        render();
    }, 0, ['配列(Bayer)', '誤差拡散']));
};
