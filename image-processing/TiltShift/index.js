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
    
    let s = 3;
    let os = 0.2;

    function gauss(sigma, x) {
        return Math.exp(-(x * x) / (2 * sigma * sigma)) / (Math.sqrt(2 * Math.PI) * sigma);
    }

    function mix(x, y, a) {
        return x * (a - 1) + y * a;
    }

    function hsv2rgb(h, s, v) {
        var f = h / 60,
            i = f ^ 0,
            m = v - v * s,
            k = v * s * (f - i),
            p = v - k,
            q = k + m;
        return [[v, p, m, m, q, v][i] * 255 ^ 0, [q, v, v, p, m, m][i] * 255 ^ 0, [m, m, q, v, v, p][i] * 255 ^ 0];
    }

    function rgb2hsv(r, g, b) {
        var m = Math.max(r, g, b),
            n = Math.min(r, g, b),
            c = m - n,
            h = 0;
        if(c === 0) return [0, 0, m / 255];
        if(m === r) h = (g - b) / c;
        else if(m === g) h = (b - r) / c + 2;
        else if(m === b) h = (r - g) / c + 4;
        if(h < 0) h += 6;
        return [h * 60 ^ 0, c / m, m / 255];
    }

    function clamp(x, min, max) {
        return x > max ? max : x < min ? min : x;
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
            }
        }

        src = data;
        dst = ret;

        for(let i = 0; i < h; i++) {
            for(let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let r = src[index];
                let g = src[index + 1];
                let b = src[index + 2];
                let blurR = dst[index];
                let blurG = dst[index + 1];
                let blurB = dst[index + 2];
                
                let a = Math.abs((i / h) * 2 - 1);
                r = (r * (1 - a) + blurR * a) ^ 0;
                g = (g * (1 - a) + blurG * a) ^ 0;
                b = (b * (1 - a) + blurB * a) ^ 0;

                let [hue, s, v] = rgb2hsv(r, g, b);
                s = clamp(s + os, 0, 1);
                [r, g, b] = hsv2rgb(hue, s, v);

                dst[index] = r;
                dst[index + 1] = g;
                dst[index + 2] = b;
                dst[index + 3] = 255
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    const max = 8;
    document.body.appendChild(createSlider('sigma', s / max, v => {
        s = v * max;
        render();
    }));

    document.body.appendChild(createSlider('saturation', os * 0.5 + 0.5, v => {
        os = v * 2.0 - 1.0;
        render();
    }));
};
