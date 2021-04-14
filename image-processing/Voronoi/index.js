window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    const img = document.getElementById('image');
    canvas.width = img.width;
    canvas.height = img.height;

    let w = canvas.width;
    let h = canvas.height;

    ctx.drawImage(img, 0, 0, w, h);

    let image = ctx.getImageData(0, 0, w, h);
    let result = ctx.createImageData(w, h);
    let data = image.data;
    let ret = result.data;

    function buffer(w, h) {
        image = ctx.getImageData(0, 0, w, h);
        result = ctx.createImageData(w, h);
        data = image.data;
        ret = result.data;
    }

    function dist2(sx, sy, ex, ey) {
        let dx = ex - sx;
        let dy = ey - sy;
        return dx * dx + dy * dy;
    }

    function clamp(x, min, max) {
        return x < min ? min : x > max ? max : x;
    }

    let b = 12;
    let maxd = b * b * 2;
    let bw = w / b ^ 0;
    let bh = h / b ^ 0;
    let randx = [];
    let randy = [];
    let randr = [];
    let randg = [];
    let randb = [];
    let randc = [];
    let average = false;
    let fix = false;

    function table(size) {
        let update = b !== size || !fix;
        b = size;
        maxd = b * b * 2;
        bw = w / b ^ 0;
        bh = h / b ^ 0;
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                let k = y * bw + x;
                if (update) {
                    randx[k] = Math.random() * b;
                    randy[k] = Math.random() * b;
                }
                randr[k] = randg[k] = randb[k] = randc[k] = 0;
            }
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

    function accum(x, y) {
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
                    c = k;
                }
            }
        }
        return c;
    }

    function render(data, size) {
        console.time('noise');

        table(size);
        if (average) {
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    let k = (i * w + j) * 4;
                    let y = accum(j, i);
                    randr[y] += data[k];
                    randg[y] += data[k + 1];
                    randb[y] += data[k + 2];
                    randc[y]++;
                }
            }
            for (let i = 0; i < randc.length; i++) {
                randr[i] = randr[i] / randc[i] ^ 0;
                randg[i] = randg[i] / randc[i] ^ 0;
                randb[i] = randb[i] / randc[i] ^ 0;
            }
        }

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let k = (i * w + j) * 4;
                if (average) {
                    let y = accum(j, i);
                    ret[k] = randr[y];
                    ret[k + 1] = randg[y];
                    ret[k + 2] = randb[y];
                    ret[k + 3] = 255;
                } else {
                    let y = cell(j, i) * 4;
                    ret[k] = data[y];
                    ret[k + 1] = data[y + 1]; 
                    ret[k + 2] = data[y + 2];
                    ret[k + 3] = 255;
                }
            }
        }
        
        ctx.putImageData(result, 0, 0);
        console.timeEnd('noise');
    }

    render(data, b);

    document.body.appendChild(createRadio(['32', '24', '16', '12', '8', '6'], (v, id, i) => {
        render(data, parseInt(id, 10));
    }, 3));

    document.body.appendChild(createCheckbox('average', v => {
        average = v;
        render(data, b);
    }, 3));

    document.body.appendChild(createCheckbox('fix', v => {
        fix = v;
    }, 3));

    document.body.addEventListener('dragover', e => {
        e.preventDefault();
    }, false);

    document.body.addEventListener('drop', e => {
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            img.src = reader.result;
            img.onload = () => {
                w = canvas.width = img.width;
                h = canvas.height = img.height;
                ctx.drawImage(img, 0, 0, w, h);
                buffer(w, h);
                table(b);
                render(data, b);
            };
        };
        reader.readAsDataURL(file);
        e.preventDefault();
    }, false);
};
