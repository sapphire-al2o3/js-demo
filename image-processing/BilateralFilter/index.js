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

   

    document.body.appendChild(createSlider('color-sigma', 0.5, v => {
        csigma = v * 96;
    }));

    document.body.appendChild(createSlider('space-sigma', 0.5, v => {
        ssigma = v * 4;
        render();
    }));

    let radius = 3,
        ssigma = 2,
        csigma = 48;

    let width = image.width,
        height = image.height;

    const weight = [];
    const indices = [];
    const size = width * height;

    function render() {

        let cs = -0.5 / (csigma * csigma);
        let ss = -0.5 / (ssigma * ssigma);

        weight.length = 0;
        indices.length = 0;

        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                weight.push(Math.exp((i * i + j * j) * ss));
                indices.push(i * width + j);
            }
        }

        for(let i = 0; i < size; i++) {
                
                let index = i * 4;
                let r = data[index];
                let g = data[index + 1];
                let b = data[index + 2];

                let sr, sg, sb, sw;
                sr = sg = sb = sw = 0;

                for(let k = 0; k < indices.length; k++) {
                    let t = index + indices[k] * 4;
                    if(t < 0 || t >= size * 4) continue;
                    let rr = data[t];
                    let gg = data[t + 1];
                    let bb = data[t + 2];
                    let dr = rr - r;
                    let dg = gg - g;
                    let db = bb - b;
                    let w = weight[k] * Math.exp((dr * dr + dg * dg + db * db) * cs);
                    sr += rr * w;
                    sg += gg * w;
                    sb += bb * w;
                    sw += w;
                }

                ret[index] = sr / sw ^ 0;
                ret[index + 1] = sg / sw ^ 0;
                ret[index + 2] = sb / sw ^ 0;
                ret[index + 3] = 255;
            
        }

        ctx.putImageData(result, 0, 0);
    }

    render();
};
