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


    let w = 3;

    let width = image.width,
        height = image.height;

    function minVariance(x1, x2, y1, y2, mv, mr, mg, mb) {
        let count = 0;
        let rr, gg, bb, r2, g2, b2;
        rr = gg = bb = r2 = g2 = b2 = 0;
        for(let k = y1; k <= y2; k++) {
            if(k < 0 || k >= height) continue;
            for(let l = x1; l <= x2; l++) {
                if(l < 0 || l >= width) continue;
                let index = (k * width + l) * 4;
                let r = data[index],
                    g = data[index + 1],
                    b = data[index + 2];
                
                rr += r;
                gg += g;
                bb += b;
                r2 += r * r;
                g2 += g * g;
                b2 += b * b;
                
                count++;
            }
        }
        let ar = rr / count;
        let ag = gg / count;
        let ab = bb / count;
        r2 = r2 / count;
        g2 = g2 / count;
        b2 = b2 / count;

        let vr = r2 - (ar * ar);
        let vg = g2 - (ag * ag);
        let vb = b2 - (ab * ab);

        let v = vr + vg + vb;

        if(v < mv) {
            mv = v;
            mr = ar;
            mg = ag;
            mb = ab;
        }
        return [mv, mr, mg, mb];
    }
    
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            let v = 10000, r, g, b;
            if (i - w >= 0 && j - w >= 0) {
                [v, r, g, b] = minVariance(j - w, j, i - w, i, v, r, g, b);
            }
            if (i - w >= 0 && j + w <= height) {
                [v, r, g, b] = minVariance(j, j + w, i - w, i, v, r, g, b);
            }
            if (i + w <= width && j - w >= 0) {
                [v, r, g, b] = minVariance(j - w, j, i, i + w, v, r, g, b);
            }
            if (i + w <= width && j + w <= height) {
                [v, r, g, b] = minVariance(j, j + w, i, i + w, v, r, g, b);
            }
            let index = (i * width + j) * 4;
            ret[index] = r;
            ret[index + 1] = g;
            ret[index + 2] = b;
            ret[index + 3] = 255;
        }
    }

    ctx.putImageData(result, 0, 0);
};
