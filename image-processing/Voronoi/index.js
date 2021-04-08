window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    const img = document.getElementById('image');
    canvas.width = img.width;
    canvas.height = img.height;

    const w = canvas.width;
    const h = canvas.height;

    ctx.drawImage(img, 0, 0, w, h);

    const image = ctx.getImageData(0, 0, w, h);
    const result = ctx.createImageData(w, h);
    const data = image.data;
    const ret = result.data;

    function dist2(sx, sy, ex, ey) {
        let dx = ex - sx;
        let dy = ey - sy;
        return dx * dx + dy * dy;
    }

    function clamp(x, min, max) {
        return x < min ? min : x > max ? max : x;
    }

    const min = (a, b) => Math.min(a, b);

    const b = 8;
    const maxd = b * b + 1;
    const bw = w / b ^ 0;
    const bh = h / b ^ 0;
    const randx = [];
    const randy = [];
    const randc = [];
    let voronoi = false;
    let point = false;

    for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
            let k = y * bw + x;
            randx[k] = Math.random() * b;
            randy[k] = Math.random() * b;
            let cx = randx[k] + x * b ^ 0;
            let cy = randy[k] + y * b ^ 0;
        }
    }

    function cell(x, y) {
        let ix = x / b ^ 0;
        let iy = y / b ^ 0;
        let distance = maxd;
        let c = 0;
        for (let i = -1; i <= 1; i++) {
            let ry = (iy + i + bh) % bh;
            let by = (iy + i) * b;
            for (let j = -1; j <= 1; j++) {

                let rx = (ix + j + bw) % bw;
                
                let k = ry * bw + rx;
                
                let cx = randx[k] + (ix + j) * b;
                let cy = randy[k] + by;

                let d = dist2(cx, cy, x, y);
                if (d < distance) {
                    distance = d;
                    c = (cy ^ 0) * w + (cx ^ 0);
                }
            }
        }
        return clamp(c, 0, w * h);
    }

    function render(data) {
        console.time('noise');
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let k = (i * w + j) * 4;
                let y = cell(j, i) * 4;
                ret[k] = data[y];
                ret[k + 1] = data[y + 1]; 
                ret[k + 2] = data[y + 2];
                ret[k + 3] = 255;
                // ret[k] = y;
                // ret[k + 1] = y;
                // ret[k + 2] = 0;
                // ret[k + 3] = 255;
            }
        }
        
        ctx.putImageData(result, 0, 0);
        console.timeEnd('noise');
    }

    render(data);
};
