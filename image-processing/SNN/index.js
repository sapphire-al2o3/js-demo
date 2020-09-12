window.onload = () => {

    function sqdist(r0, g0, b0, r1, g1, b1) {
        return (r0 - r1) * (r0 - r1) + (g0 - g1) * (g0 - g1) + (b0 - b1) * (b0 - b1);
    }

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

    let w = 3;

    let width = image.width,
        height = image.height;

    for(let i = w; i < height - w; i++) {
        for(let j = w; j < width - w; j++) {
            let index = (i * width + j) * 4;
            let r = data[index],
                g = data[index + 1],
                b = data[index + 2],
                a = data[index + 3],
                count = 0;
            let rr, gg, bb;
            rr = gg = bb = 0;
            for(let k = -w; k < w; k++) {
                let y0 = i + k,
                    y1 = i + (w - k);
                for(let l = -w; l < w; l++) {
                    let x0 = j + l,
                        x1 = j + (w - l);
                    let index0 = (y0 * width + x0) * 4,
                        index1 = (y1 * width + x1) * 4;
                    let r0 = data[index0],
                        g0 = data[index0 + 1],
                        b0 = data[index0 + 2],
                        r1 = data[index1],
                        g1 = data[index1+ 1],
                        b1 = data[index1 + 2];
                    if(sqdist(r0, g0, b0, r, g, b) < sqdist(r1, g1, b1, r, g, b)) {
                        rr += r0;
                        gg += g0;
                        bb += b0;
                    } else {
                        rr += r1;
                        gg += g1;
                        bb += b1;
                    }
                    
                    count++;
                }
            }
            rr = rr / count ^ 0;
            gg = gg / count ^ 0;
            bb = bb / count ^ 0;
            ret[index] = rr;
            ret[index + 1] = gg;
            ret[index + 2] = bb;
            ret[index + 3] = a;
        }
    }

    ctx.putImageData(result, 0, 0);
};
