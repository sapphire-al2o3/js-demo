const context = new window.AudioContext;
let time = 1;
let buffer = context.createBuffer(
    2,
    context.sampleRate * time,
    context.sampleRate
);

let freq = 3000;
let amp = 1;
let fade = true;
let ease = 0;

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
    }
}

function setup() {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        const b = buffer.getChannelData(i);
        const l = buffer.length;
        for (let j = 0; j < buffer.length; j++) {
            let t = j / l * time;
            let f = t * freq * Math.PI;
            let w = wind(j / l);
            b[j] = amp * w * Math.sin(f);
        }
    }
}

document.body.appendChild(createSlider('freq', (freq + 100) / 10000, v => {
    freq = v * 10000 + 100;
}));

document.body.appendChild(createSlider('amp', amp, v => {
    amp = v;
}));

document.body.appendChild(createRadio(['linear', 'quad', 'bounce', 'none'], (v, id, i) => {
    ease = i;
}));

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
    // source.loop = true;
    source.start();
    return source;
}

let playing = false;
let start = false;
let node = null;
const button = document.getElementById('play');
button.addEventListener('click', (e) => {
    if (node !== null) {
        node.stop();
        node.dis
    }
    context.suspend();
    node = play();
    context.resume();
    
});
