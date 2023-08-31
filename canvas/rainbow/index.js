const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
const PI2 = Math.PI * 2;
const F = 32;
let pr = 0;
let pg = Math.PI * 2 / 3;
let pb = Math.PI * 4 / 3;
let fr = 1;
let fg = 1;
let fb = 1;

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}

function sin(x) {
    return clamp(Math.sin(x) * 2, 0, 1);
}

function cos(x) {
    return clamp(Math.cos(x) * 0.5 + 0.5, 0, 1);
}

function render() {

    for (let i = 0; i < w; i++) {
        let t = i / w;
        let r = cos(t * fr + pr) * 255;
        let g = cos(t * fg + pg) * 255;
        let b = cos(t * fb + pb) * 255;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(i, 0, i + 1, h);
    }
}

const sliderr = createSlider('pr', pr / PI2, v => {
    pr = v * PI2;
    render();
});

const sliderg = createSlider('pg', pg / PI2, v => {
    pg = v * PI2;
    render();
});

const sliderb = createSlider('pb', pb / PI2, v => {
    pb = v * PI2;
    render();
});

document.body.appendChild(sliderr);
document.body.appendChild(sliderg);
document.body.appendChild(sliderb);

const sliderfr = createSlider('fr', fr / F, v => {
    fr = v * F;
    render();
});

const sliderfg = createSlider('fg', fg / F, v => {
    fg = v * F;
    render();
});

const sliderfb = createSlider('fb', fb / F, v => {
    fb = v * F;
    render();
});

document.body.appendChild(sliderfr);
document.body.appendChild(sliderfg);
document.body.appendChild(sliderfb);

render();
