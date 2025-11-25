const context = new window.AudioContext;
let time = 0.5;
let buffer = context.createBuffer(
    2,
    context.sampleRate * time,
    context.sampleRate
);

let freq = 440;
let amp = 0.1;
let ease = 0;
let wave = 0;

function resize(length) {
    buffer = context.createBuffer(
        2,
        context.sampleRate * length,
        context.sampleRate
    );
}

function linear(x) {
    return 1 - x;
}

function quad(x) {
    return 1 - x * x;
}

function bounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return 1 - (n1 * x * x);
    } else if (x < 2 / d1) {
        return 1 - (n1 * (x -= 1.5 / d1) * x + 0.75);
    } else if (x < 2.5 / d1) {
        return 1 - (n1 * (x -= 2.25 / d1) * x + 0.9375);
    } else {
        return 1 - (n1 * (x -= 2.625 / d1) * x + 0.984375);
    }
}

function wind(x) {
    switch (ease) {
        case 0:
            return linear(x);
        case 1:
            return quad(x);
        case 2:
            return bounce(x);
        case 3:
            return 1;
        default:
            return 1;
    }
}

function saw(t) {
    return (t - Math.floor(t)) * 2 - 1;
}

function square(t) {
    return t - Math.floor(t) > 0.5 ? 1 : -1;
}

function triangle(t) {
    return Math.abs(t - Math.floor(t) - 0.5) * 4 - 1;
}

function waveform(t) {
    switch (wave) {
        case 0:
            return Math.sin(t * Math.PI);
        case 1:
            return saw(t);
        case 2:
            return square(t);
        case 3:
            return triangle(t);
        default:
            return 1;
    }
}

function setup() {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        const b = buffer.getChannelData(i);
        const l = buffer.length;
        for (let j = 0; j < buffer.length; j++) {
            let t = j / l * time * freq;
            let f = waveform(t);
            let w = wind(j / l);
            b[j] = amp * w * f;
        }
    }
}

let scaleName = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let scaleLevel = [-9, -7, -5, -4, -2, 0, 2, 3]
let keys = 'asdfghjk';
const scaleButton = document.getElementById('scales');

let playing = false;
let start = false;
let node = null;

function playScale(l) {
    freq = 440 * Math.pow(2, 1 / 12 * l);
    console.log(freq);
    
    if (node !== null) {
        node.stop();
    }
    context.suspend();
    node = play();
    context.resume();
}

function clickPlayScale(e) {
    let l = parseInt(e.target.getAttribute('hz'));
    playScale(l);
}

for (let i = 0; i < scaleName.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = scaleName[i];
    let f = Math.pow();
    btn.setAttribute('hz', scaleLevel[i]);
    btn.addEventListener('click', clickPlayScale);
    scaleButton.appendChild(btn);
}

document.body.appendChild(createSlider('amp', amp, v => {
    amp = v;
}));

document.body.appendChild(createRadio(['linear', 'quad', 'bounce', 'none'], (v, id, i) => {
    ease = i;
}));

document.body.appendChild(createRadio(['sine', 'saw', 'square', 'triangle'], (v, id, i) => {
    wave = i;
}));

document.body.addEventListener('keydown', e => {
    let key = keys.indexOf(e.key);
    if (key >= 0) {
        playScale(scaleLevel[key]);
    }
}, false);

function play() {
    const length = parseFloat(document.getElementById('length').value);
    if (time !== length) {
        time = length;
        resize(time);
    }
    setup();
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
    return source;
}

