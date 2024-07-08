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

    let width = image.width,
        height = image.height;
    
    let oh = 0,
        os = 0,
        ov = 0;

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
        let src = data;
        let dst = ret;

        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                let index = (i * width + j) * 4;

                let r = src[index];
                let g = src[index + 1];
                let b = src[index + 2];
                
                let [h, s, v] = rgb2hsv(r, g, b);
                h = (h + oh) % 360;
                s = clamp(s + os, 0, 1);
                v = clamp(v + ov, 0, 1);
                [r, g, b] = hsv2rgb(h, s, v);

                dst[index] = r;
                dst[index + 1] = g;
                dst[index + 2] = b;
                dst[index + 3] = 255
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    document.body.appendChild(createSlider('heu', oh, v => {
        oh = v * 359;
        render();
    }));

    document.body.appendChild(createSlider('saturation', os * 0.5 + 0.5, v => {
        os = v * 2.0 - 1.0;
        render();
    }));

    document.body.appendChild(createSlider('saturation', ov * 0.5 + 0.5, v => {
        ov = v * 2.0 - 1.0;
        render();
    }));
};
