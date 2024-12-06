window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const img = document.getElementById('image');

    canvas.width = img.width;
    canvas.height = img.height;

    let width = canvas.width,
        height = canvas.height;

    ctx.drawImage(img, 0, 0, img.width, img.height);
    // createChecker();

    function createChecker() {
        let d = 8;
        let s = width / d ^ 0;
        for (let i = 0; i < d; i++) {
            for (let j = 0; j < d; j++) {
                ctx.fillStyle = (i + j) & 1 ? '#CCC' : '#555';
                ctx.fillRect(i * s, j * s, s, s);
            }
        }
    }

    let image = ctx.getImageData(0, 0, width, height);
    const result = ctx.createImageData(width, height);
    let data = image.data;
    const ret = result.data;
    let interporation = true;
    let checkerboard = false;

    function bilinear(d, x, y, w, h) {
        let ix = x ^ 0;
        let iy = y ^ 0;
        let fx = x - ix;
        let fy = y - iy;
        let ix1 = ix + 1 >= w ? w - 1 : ix + 1;
        let iy1 = iy + 1 >= h ? h - 1 : iy + 1;
        let k00 = (iy * w + ix) * 4;
        let k10 = (iy1 * w + ix) * 4;
        let k01 = (iy * w + ix1) * 4;
        let k11 = (iy1 * w + ix1) * 4;
        let w00 = (1 - fx) * (1 - fy);
        let w10 = fx * (1 - fy);
        let w01 = (1 - fx) * fy;
        let w11 = fx * fy;
        let r = w00 * d[k00    ] + w01 * d[k10    ] + w10 * d[k01    ] + w11 * d[k11];
        let g = w00 * d[k00 + 1] + w01 * d[k10 + 1] + w10 * d[k01 + 1] + w11 * d[k11 + 1];
        let b = w00 * d[k00 + 2] + w01 * d[k10 + 2] + w10 * d[k01 + 2] + w11 * d[k11 + 2];
        return [r ^ 0, g ^ 0, b ^ 0];
    }

    function render() {
        let src = data;
        let dst = ret;

        let cx = width / 2 ^ 0;
        let cy = height / 2 ^ 0;
        let m = Math.sqrt(cx * cx + cy * cy);

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let index = (i * width + j) * 4;
                
                let th = (j) / width * Math.PI * 2;
                let radius = i;
                let x = radius * Math.cos(th) + cx;
                let y = radius * Math.sin(th) + cy;

                let dx = j - cx;
                let dy = i - cy;

                th = Math.atan2(dy, dx);
                if (th >= 0) {
                    x = th / (Math.PI * 2) * width;
                } else {
                    x = (th + Math.PI * 2) / (Math.PI * 2) * width;
                }
                y = Math.sqrt(dx * dx + dy * dy) / m * height;

                let r, g, b;
                if (interporation) {
                    [r, g, b] = bilinear(src, x, y, width, height);

                } else {
                    x = x ^ 0;
                    y = y ^ 0;
                    let k = (y * width + x) * 4;

                    r = src[k];
                    g = src[k + 1];
                    b = src[k + 2];
                }

                dst[index] = r;
                dst[index + 1] = g;
                dst[index + 2] = b;
                dst[index + 3] = 255
            }
        }

        ctx.putImageData(result, 0, 0);
    }

    render();

    document.body.appendChild(createCheckbox('interporation', v => {
        interporation = v;
        render();
    }, true));

    document.body.appendChild(createCheckbox('checkerboard', v => {
        checkerboard = v;
        if (checkerboard) {
            createChecker();
        } else {
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }
        image = ctx.getImageData(0, 0, width, height);
        data = image.data;
        render();
    }, false));

    function createButton(id, callback) {
        const wrapper = document.createElement('div'),
            button = document.createElement('button');
        
        wrapper.classList.add('button');
        button.setAttribute('for', id);
        button.textContent = id;button
    
        button.addEventListener('click', e => {
            if(callback) {
                callback();
            }
        }, false);
        
        wrapper.appendChild(button);
        
        return wrapper;
    }

    document.body.appendChild(createButton('apply', () => {
        image = ctx.getImageData(0, 0, width, height);
        data = image.data;
        render();
    }), false);
};
