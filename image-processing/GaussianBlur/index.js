window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const img = document.getElementById('image');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);

    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const temp = ctx.createImageData(canvas.width, canvas.height);
    const result = ctx.createImageData(canvas.width, canvas.height);
    const data = image.data;
    const tempData = temp.data;
    const ret = result.data;

    let w = image.width,
        h = image.height;
    
    let s = 2;

    function gauss(sigma, x) {
        return Math.exp(-(x * x) / (2 * sigma * sigma)) / (Math.sqrt(2 * Math.PI) * sigma);
    }

    function render() {

        let gf = [];
        let range = (s * 3 ^ 0);
        let t = 0;

        console.log(`sigma ${s} range ${range}`);

        if (s < 0.4) {
            ctx.putImageData(image, 0, 0);
            return;
        }

        for (let i = 0; i <= range; i++) {
            let g = gauss(s, i);
            gf[range + i] = g;
            gf[range - i] = g;
        }

        for (let i = 0; i < gf.length; i++) {
            t += gf[i];
            console.log(i, gf[i]);
        }
        console.log(t);

        let src = data;
        let dst = tempData;

        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let r = 0;
                let g = 0;
                let b = 0;
                let sum = 0;
                let min = j - range < 0 ? -j : -range;
                let max = j + range >= w ? w - j - 1 : range;
                for (let x = min; x <= max; x++) {
                    let gw = gf[x + range]
                    let k = (i * w + j + x) * 4;
                    r += src[k] * gw;
                    g += src[k + 1] * gw;
                    b += src[k + 2] * gw;
                    sum += gw;
                }
                let n = t / sum;
                dst[index] = r * n ^ 0;
                dst[index + 1] = g * n ^ 0;
                dst[index + 2] = b * n ^ 0;
                dst[index + 3] = 255
            }
        }

        src = tempData;
        dst = ret;

        for(let i = 0; i < h; i++) {
            let min = i - range < 0 ? -i : -range;
            let max = i + range >= h ? h - i - 1 : range;
            for(let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let r = 0;
                let g = 0;
                let b = 0;
                let sum = 0;
                for (let y = min; y <= max; y++) {
                    let gw = gf[y + range]
                    let k = ((i + y) * w + j) * 4;
                    r += src[k] * gw;
                    g += src[k + 1] * gw;
                    b += src[k + 2] * gw;
                    sum += gw;
                }
                let n = t / sum;
                dst[index] = r * n ^ 0;
                dst[index + 1] = g * n ^ 0;
                dst[index + 2] = b * n ^ 0;
                dst[index + 3] = 255
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    const max = 8;
    document.body.appendChild(createSlider('s', s / max, v => {
        s = v * max;
        render();
    }));
};
