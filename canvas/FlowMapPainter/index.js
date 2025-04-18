const canvas = document.getElementsByTagName('canvas');
const ctx = canvas[0].getContext('2d');
let img = new Image(),
    down = false,
    px = 0,
    py = 0,
    power = 8,
    pdx = 0,
    pdy = 0,
    weight = 0.2,
    speed = 1.0,
    width = canvas[0].width,
    height = canvas[0].height,
    lineWidth = 32.0,
    rect,
    strokeColor = 'rgba(200, 200, 255, 1.0)',
    baseColor = 'rgb(128, 128, 0)';

const defaultWeight = 0.2;
const defaultPower = 8;
const defaultLineWidth = 32.0;

ctx.lineWidth = lineWidth;
ctx.strokeStyle = strokeColor;
ctx.fillStyle = strokeColor;
ctx.lineCap = 'round';

ctx.fillStyle = baseColor;
ctx.fillRect(0, 0, width, height);

// ctx.globalAlpha = 0.5;

canvas[0].addEventListener('mousedown', (e) => {
    rect = e.target.getBoundingClientRect();
    down = true;
    px = e.clientX - rect.left + 0.5;
    py = e.clientY - rect.top + 0.5;
    
    // ctx.beginPath();
    // ctx.moveTo(px, py);

    document.addEventListener('mousemove', mousemove, false);
    document.addEventListener('mouseup', mouseup, false);
}, false);

function clamp(x) {
    return x > 1.0 ? 1.0 : x < -1.0 ? -1.0 : x;
}

function vecColor(dx, dy) {
    
    dx = clamp(dx * power / width);
    dy = clamp(dy * power / height);

    dy *= -1;

    // normalize
    // let l = dx * dx + dy * dy;
    // dx /= l;
    // dy /= l;

    let r = (dx * 127 ^ 0) + 128;
    let g = (dy * 127 ^ 0) + 128;
    return `rgb(${r}, ${g}, 0)`;
}

function vecNormColor(dx, dy) {
    
    dx = clamp(dx * power / width);
    dy = clamp(dy * power / height);

    // normalize
    let l = dx * dx + dy * dy;
    if (l > 0) {
        dx /= l;
        dy /= l;
    }

    let r = (dx * 127 ^ 0) + 128;
    let g = (dy * 127 ^ 0) + 128;
    return `rgb(${r}, ${g}, 0)`;
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

function mousemove(e) {
    if (down) {
        let x = e.clientX - rect.left + 0.5,
            y = e.clientY - rect.top + 0.5;
        
        let dx = px - x,
            dy = py - y;
        
        dx = lerp(pdx, dx, weight);
        dy = lerp(pdy, dy, weight);

        ctx.strokeStyle = vecColor(dx, dy);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        px = x;
        py = y;
        pdx = dx;
        pdy = dy;
    }
}

function mouseup(e) {
    if (down) {
        down = false;
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);

        updateTex(canvas[0]);
    }
}

document.getElementById('clear').addEventListener('click', (e) => {
    clearCanvas();
}, false);

document.getElementById('size').addEventListener('change', (e) => {
    ctx.lineWidth = lineWidth = parseInt(e.target.value, 10);
}, false);

document.getElementById('power').addEventListener('change', (e) => {
    power = parseInt(e.target.value, 10);
}, false);

document.getElementById('weight').addEventListener('change', (e) => {
    weight = parseFloat(e.target.value);
}, false);

document.getElementById('tex-size').addEventListener('change', (e) => {
    let size = parseInt(e.target.value, 10);
    canvas[0].width = size;
    canvas[0].height = size;
    width = size;
    height = size;

    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);
}, false);

document.getElementById('reset').addEventListener('click', (e) => {
    weight = defaultWeight;
    power = defaultPower;
    lineWidth = defaultLineWidth;

    document.getElementById('power').value = power;
    document.getElementById('weight').value = weight;
    document.getElementById('size').value = lineWidth;

    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidth;
}, false);

document.getElementById('speed').addEventListener('change', (e) => {
    speed = parseFloat(e.target.value);
}, false);

function smooth() {
    let src = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height);
    let dst = ctx.createImageData(width, height);

    let sd = src.data;
    let dd = dst.data;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let p = (i * width + j) * 4;
            let r = 0,
                g = 0,
                b = 0,
                count = 0;
            let top = i - 1 < 0 ? 0 : i - 1;
            let bottom = i + 1 >= height ? height - 1 : i + 1;
            let left = j - 1 < 0 ? 0 : j - 1;
            let right = j + 1 >= width ? width - 1 : j + 1;
            for (let k = top; k <= bottom; k++) {
                for (let l = left; l <= right; l++) {
                    let q = (k * width + l) * 4;
                    r += sd[q];
                    g += sd[q + 1];
                    b += sd[q + 2];
                    count++;
                }
            }
            dd[p] = r / count ^ 0;
            dd[p + 1] = g / count ^ 0;
            dd[p + 2] = b / count ^ 0;
            dd[p + 3] = 255;
        }
    }

    ctx.putImageData(dst, 0, 0);
}

document.getElementById('smooth').addEventListener('click', (e) => {
    smooth();
    updateTex(canvas[0]);
}, false);

function radial(invert, fade, radius) {
    let dst = ctx.createImageData(width, height);
    let cx = width / 2,
        cy = height / 2;
    let dd = dst.data;
    let f = 0.2;
    let inv = invert ? -1 : 1;
    let gear = false;
    let t = -15 / 180 * Math.PI;
    let c = Math.cos(t),
        s = Math.sin(t);

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let p = (i * width + j) * 4;
            let x = j + 0.5,
                y = i + 0.5;
            
            let dx = cx - x,
                dy = cy - y;

            dx *= inv;
            dy *= inv;

            let l = Math.sqrt(dx * dx + dy * dy);
            if (l > 0) {
                dx /= l;
                dy /= l;

                // x = dx * c - dy * s;
                // y = dx * s + dy * c;
                // dx = x;
                // dy = y;

                if (gear) {
                    let g = Math.cos(dx * 30) * 0.5 + 0.5;
                    g += Math.cos(dy * 50) * 0.5 + 0.5;
                    dx *= g * 0.5 + 1;
                    dy *= g * 0.5 + 1;
                }

                if (fade) {
                    let m = l / radius;
                    m = m > 1 ? 1 : m;
                    m = (1 - m * m);
                    dx *= m;
                    dy *= m;
                }

                dx *= f;
                dy *= -f;
            }

            dd[p] = (dx * 127 ^ 0) + 128;
            dd[p + 1] = (dy * 127 ^ 0) + 128;
            dd[p + 2] = 0;
            dd[p + 3] = 255;
        }
    }

    ctx.putImageData(dst, 0, 0);
}

document.getElementById('radial').addEventListener('click', (e) => {
    const invert = document.getElementById('invert').checked;
    const fade = document.getElementById('fade').checked;
    radial(invert, fade, width / 2 * 1.2);
    updateTex(canvas[0]);
}, false);

function spiral(ccw) {
    let dst = ctx.createImageData(width, height);
    let cx = width / 2,
        cy = height / 2;
    let dd = dst.data;
    let inv = ccw ? -1 : 1;
    let r = 0.2;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let p = (i * width + j) * 4;
            let x = j + 0.5,
                y = i + 0.5;

            let dx = y - cy;
                dy = cx - x;

            dx *= inv;
            dy *= inv;

            let l = length(dx, dy);
            if (l > 0) {
                dx /= l;
                dy /= l;

                dx = dx * r;
                dy = dy * -r;
            }

            dd[p] = (dx * 127 ^ 0) + 128;
            dd[p + 1] = (dy * 127 ^ 0) + 128;
            dd[p + 2] = 0;
            dd[p + 3] = 255;
        }
    }

    ctx.putImageData(dst, 0, 0);
}

document.getElementById('spiral').addEventListener('click', (e) => {
    const ccw = document.getElementById('ccw').checked;
    spiral(ccw);
    updateTex(canvas[0]);
}, false);

function length(x, y) {
    return Math.sqrt(x * x + y * y);
}

function octave(t, f, a = 1, p = 0) {
    let c = 0;
    for (let i = 0; i < 4; i++) {
        c += Math.cos(t * f + p) * a;
        a *= 0.5;
        f *= 2;
        p *= 1.5;
    }
    return c;
}

function wave(dirX, dirY, fade, freq = 8) {
    let dst = ctx.createImageData(width, height);
    let dd = dst.data;
    let cx = width / 2,
        cy = height / 2;
    let r = length(cx, cy);
    let v = 0.2;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let p = (i * width + j) * 4;

            let x = j - cx + 0.5,
                y = i - cy + 0.5;
            let n = dirX * x + dirY * y;
            let nx = n * dirX,
                ny = n * dirY;
            // let c = dirX * y - dirY * x;
            let px = x - nx,
                py = y - ny;

            let l = length(px, py);

            let t = l * Math.PI;
            // let d = Math.cos(t * 0.06 + 0.1) +
            //         0.5 * Math.cos(t * 0.01 + 1.4) +
            //         0.25 * Math.cos(t * 0.1) +
            //         0.125 * Math.cos(t * 0.05);
            let d = octave(t / r, freq, 0.8, 0.9);

            d = Math.abs(d);
            let dx = dirX * d;
            let dy = dirY * d;

            if (fade && n < 0) {
                let f = (r + n) / r;
                f = f * f;
                dx *= f;
                dy *= f;
            }

            dx *= v;
            dy *= -v;

            dd[p] = (dx * 127 ^ 0) + 128;
            dd[p + 1] = (dy * 127 ^ 0) + 128;
            dd[p + 2] = 0;
            dd[p + 3] = 255;
        }
    }

    ctx.putImageData(dst, 0, 0);
}

function wave2(dirX, dirY) {
    let dst = ctx.createImageData(width, height);
    let dd = dst.data;
    let cx = width / 2,
        cy = height / 2;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let p = (i * width + j) * 4;

            let x = j - cx + 0.5,
                y = i - cy + 0.5;
            
            let t = j / width;
            let c = octave(t) + 2;
            let dx = c < 0 ? 0 : c;
            let dy = 0;

            dx = dx * 0.1;
            dy = dy * 0.2;

            // let f = (height - i) / height;
            // dy *= f;

            dd[p] = (dx * 127 ^ 0) + 128;
            dd[p + 1] = (dy * 127 ^ 0) + 128;
            dd[p + 2] = 0;
            dd[p + 3] = 255;
        }
    }

    ctx.putImageData(dst, 0, 0);
}

document.getElementById('angle').addEventListener('input', (e) => {
    const angle = parseInt(e.target.value, 10);
    document.getElementById('angle-view').style.backgroundImage = `conic-gradient(#0075FF 0deg ${angle}deg, #BBB ${angle}deg 360deg)`;
});

document.getElementById('wave').addEventListener('click', (e) => {
    const angle = parseInt(document.getElementById('angle').value, 10);
    const rad = (angle + 90) / 180 * Math.PI;
    const x = -Math.cos(rad);
    const y = -Math.sin(rad);
    const fade = document.getElementById('wave-fade').checked;
    const freq = parseFloat(document.getElementById('freq').value);
    wave(x, y, fade, freq);
    updateTex(canvas[0]);
}, false);

const PI = Math.PI;
const PI2 = Math.PI * 2;

function cos(x) {
    x = x - (((x + PI) / PI2) ^ 0) * PI2;
    const x2 = x * x;
    const x4 = x2 * x2;
    return 1 - 0.5 * x2 + (1 / 24 * x4) - (1 / 720 * x4 * x2)
}

function ripple(freq = 0.2, amp = 1.0) {
    let dst = ctx.createImageData(width, height);
    let cx = width / 2,
        cy = height / 2;
    let dd = new Uint32Array(dst.data.buffer);
    let f = 0.1;
    let k = 0;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            // let p = (i * width + j) * 4;
            let x = j + 0.5,
                y = i + 0.5;
            
            let dx = cx - x,
                dy = cy - y;

            let l = Math.sqrt(dx * dx + dy * dy);
            if (l > 0) {
                let r = amp * Math.cos(l * freq) * 0.5 + 1.5 - f;
                
                dx /= l;
                dy /= l;

                dx *= r;
                dy *= r;
                
                dx *= f * r;
                dy *= -f * r;
            }

            dd[k++] = (255 << 24) | (((dy * 127 ^ 0) + 128) << 8) | ((dx * 127 ^ 0) + 128);

            // dd[p] = (dx * 127 ^ 0) + 128;
            // dd[p + 1] = (dy * 127 ^ 0) + 128;
            // dd[p + 2] = 0;
            // dd[p + 3] = 255;
        }
    }

    ctx.putImageData(dst, 0, 0);
}

document.getElementById('ripple').addEventListener('click', (e) => {
    const freq = parseFloat(document.getElementById('ripple-freq').value);
    const amp = parseFloat(document.getElementById('ripple-amp').value);
    ripple(freq, amp);
    updateTex(canvas[0]);
}, false);

function blend(src, t) {
    let dst = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height);

    let sd = src.data;
    let dd = dst.data;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let p = (i * width + j) * 4;

            dd[p] = lerp(dd[p], sd[p], t) ^ 0;
            dd[p + 1] = lerp(dd[p + 1], sd[p + 1], t) ^ 0;
        }
    }
    ctx.putImageData(dst, 0, 0);
}

function circle(x, y, r) {
    ctx[3].arc(x, y, r, 0, Math.PI * 2.0, false);
}

function line(x, y, ex, ey) {
    let seg = 20.0;
    let dx = (ex - x) / seg,
        dy = (ey - y) / seg;
    ctx[3].beginPath();
    for (let i = 0; i < seg; i++) {
        circle(dx * i + x, dy * i + y, 1.5);
    }
    ctx[3].fill();
}

function clearCanvas() {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    updateTex(canvas[0]);
}

function setCap(e) {
    ctx.lineCap = e.checked ? 'round' : 'butt';
}

function setJoin(e) {
    ctx.lineJoin = e.checked ? 'round' : 'miter';
}

const gl = initContext('preview', { preserveDrawingBuffer : true });
const preview = gl.canvas;
const program = initShader(gl, 'shader-vs', 'shader-fs');
const vbo = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

const s = 1;
const buffer = new Float32Array([
    s, s,
    -s, s,
    s, -s,
    -s, -s
]);

gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

const loc = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

const locTime = gl.getUniformLocation(program, 'time');

const flowTex = initTexture(gl, canvas[0]);
gl.bindTexture(gl.TEXTURE_2D, flowTex);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

const pixels = new Uint8Array(width * height * 4);
const size = 16;
let k = 0;
for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        let y = ((i / size ^ 0) + (j / size ^ 0)) % 2 == 0 ? 100 : 200;
        pixels[k] = pixels[k + 1] = pixels[k + 2] = y;
        pixels[k + 3] = 255;
        k += 4;
    }
}

gl.activeTexture(gl.TEXTURE1);
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.uniform1i(gl.getUniformLocation(program, 'tex'), 1);

gl.useProgram(program);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

function updateTex(img) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, flowTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
}

let time = 0;

function render(delta) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(locTime, time * speed / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();

    time += delta;
}

let timer = setAnimationFrame(render, 1000 / 30);

preview.addEventListener('click', () => {
    timer.toggle();
});
