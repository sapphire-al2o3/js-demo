const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h = canvas.height;
const PI2 = Math.PI * 2;
const F = 32;
let pr = 0;
let pg = Math.PI * 2 / 3;
let pb = Math.PI * 4 / 3;
let fr = 6;
let fg = 6;
let fb = 6;
let linkp = false;
let linkf = false;

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

    plot();
}

const sliderr = createSlider('pr', pr / PI2, v => {
    if (linkp) {
        const d = v * PI2 - pr;
        pg = clamp(pg + d, 0, PI2);
        pb = clamp(pb + d, 0, PI2);
        setThumb(thumbg, pg / PI2);
        setThumb(thumbb, pb / PI2);
    }
    pr = v * PI2;
    render();
});

const sliderg = createSlider('pg', pg / PI2, v => {
    if (linkp) {
        const d = v * PI2 - pg;
        pr = clamp(pr + d, 0, PI2);
        pb = clamp(pb + d, 0, PI2);
        setThumb(thumbr, pr / PI2);
        setThumb(thumbb, pb / PI2);
    }
    pg = v * PI2;
    render();
});

const sliderb = createSlider('pb', pb / PI2, v => {
    if (linkp) {
        const d = v * PI2 - pb;
        pr = clamp(pr + d, 0, PI2);
        pg = clamp(pg + d, 0, PI2);
        setThumb(thumbr, pr / PI2);
        setThumb(thumbg, pg / PI2);
    }
    pb = v * PI2;
    render();
});

document.body.appendChild(sliderr);
document.body.appendChild(sliderg);
document.body.appendChild(sliderb);

const thumbr = sliderr.querySelector('span');
const thumbg = sliderg.querySelector('span');
const thumbb = sliderb.querySelector('span');

const checkbox = createCheckbox('linkphase', v => {
    linkp = v;
});
document.body.appendChild(checkbox);

function setThumb(t, v) {
    t.style.left = v * (120 - 12) + 'px';
}

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

const graph = document.getElementById('graph');
const graphCtx = graph.getContext('2d');

function plot2D(ctx, f, w, h, itr) {
    itr = itr === undefined ? 100 : itr;
    ctx.beginPath();
    let x = -1;
    let y = f(x);
    ctx.moveTo(x * w, h - y * h);
    
    for (var i = 1 - itr; i <= itr; i++) {
        x = i / itr;
        y = f(x);
        ctx.lineTo(x * w, h - y * h);
    }
    ctx.stroke();
}

function plot() {
    graphCtx.clearRect(0, 0, graph.width, graph.height);
    graphCtx.strokeStyle = '#F00';
    plot2D(graphCtx, x => cos(x * fr + pr), graph.width, graph.height, 100);
    graphCtx.strokeStyle = '#0F0';
    plot2D(graphCtx, x => cos(x * fg + pg), graph.width, graph.height, 100);
    graphCtx.strokeStyle = '#00F';
    plot2D(graphCtx, x => cos(x * fb + pb), graph.width, graph.height, 100);
}

render();
