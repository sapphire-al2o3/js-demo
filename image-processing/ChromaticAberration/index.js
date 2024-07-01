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
    let selected = 1;
    let f = false;

    function render() {

        let offsetR = 0;
        let offsetG = 0;
        let offsetB = 0;

        if (selected === 0) {
            offsetR = -offset;
            offsetG = offset;
        } else if (selected === 1) {
            offsetR = -offset;
            offsetB = offset;
        } else if (selected === 2) {
            offsetG = -offset;
            offsetB = offset;
        }

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let index = (i * w + j) * 4;

                let or = offsetR;
                let og = offsetG;
                let ob = offsetB;

                if (f > 0) {
                    let dx = w / 2 - j;
                    let dy = h / 2 - i;
                    let l = Math.sqrt(dx * dx + dy * dy);
                    let s = l / (w / 2);
                    s = s > 1 ? 1 : s;
                    
                    or = or * s ^ 0;
                    og = og * s ^ 0;
                    ob = ob * s ^ 0;
                }

                let xr = j + or;
                if (xr < 0) xr = 0; else if (xr >= w) xr = w - 1;
                let xg = j + og;
                if (xg < 0) xg = 0; else if (xg >= w) xg = w - 1;
                let xb = j + ob;
                if (xb < 0) xb = 0; else if (xb >= w) xb = w - 1;

                let r = data[(i * w + xr) * 4];
                let g = data[(i * w + xg) * 4 + 1];
                let b = data[(i * w + xb) * 4 + 2];
                
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

    document.body.appendChild(createRadio(['RG', 'RB', 'GB'], (v, id, i) => {
        selected = i;
        render();
    }, 1));

    document.body.appendChild(createSlider('f', 0.0, v => {
        f = v;
        render();
    }));
};
