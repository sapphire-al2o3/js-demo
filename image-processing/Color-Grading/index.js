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

    let a = 1,
        freqR = 1,
        freqG = 1,
        freqB = 1,
        phaseR = 0,
        phaseG = 0,
        phaseB = 0;

    function clamp(v) {
        return v < 0 ? 0 : v > 255 ? 255 : v;
    }

    function curve(v, f, p) {
        return clamp((Math.sin(v / 255 * Math.PI * f + p) * a + 1) / 2 * 255 ^ 0);
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
                ret[index] = curve(r, freqR, phaseR);
                ret[index + 1] = curve(g, freqG, phaseG);
                ret[index + 2] = curve(b, freqB, phaseB);
                ret[index + 3] = a;
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    document.body.appendChild(createSlider('a', 0.5, v => {
        freqR = freqG = freqB = v * 2;
        render();
    }));

    document.body.appendChild(createSlider('phase-r', 0, v => {
        phaseR = v * Math.PI * 2;
        render();
    }));

    document.body.appendChild(createSlider('phase-g', 0, v => {
        phaseG = v * Math.PI * 2;
        render();
    }));

    document.body.appendChild(createSlider('phase-b', 0, v => {
        phaseB = v * Math.PI * 2;
        render();
    }));
};
