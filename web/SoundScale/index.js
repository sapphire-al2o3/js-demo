const context = new AudioContext();
let time = 0.5;

let freq = 440;
let amp = 0.2;
let ease = 0;
let wave = 0;
let volume = 1;

function resize(length) {
    for (let i = 0; i < scaleLevel.length; i++) {
        buffers[i] = context.createBuffer(
            2,
            context.sampleRate * length,
            context.sampleRate
        );
    }
    for (let i = 0; i < scaleSubLevel.length; i++) {
        subBuffers[i] = context.createBuffer(
            2,
            context.sampleRate * length,
            context.sampleRate
        );
    }
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

function tone(t) {
    let c = 0;
    let a = 0.5;
    for (let i = 0; i < 6; i++) {
        c += Math.sin(t * 2 * Math.PI * (i + 1)) * a;
        a *= 0.5;
    }
    return c;
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
            return Math.sin(t * 2 * Math.PI);
        case 1:
            return tone(t);
        case 2:
            return square(t);
        case 3:
            return triangle(t);
        default:
            return 1;
    }
}

function setup(buffer, time, freq, amp) {
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

let buffers = [];
let subBuffers = [];
let scaleName = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
let scaleLevel = [-9, -7, -5, -4, -2, 0, 2, 3];
let keys = 'asdfghjk';
let scaleSubLevel = [-8, -6, -3, -1, 1];
let scaleSubLeft = [22, 56, 121, 155, 189];
let subKeys = 'wetyu';
const scaleButton = document.getElementById('scales');
const lengthInput = document.getElementById('length');
const keyboard = document.getElementById('keyboard');

lengthInput.value = time;

let playing = false;
let start = false;
let node = null;

function playScale(l, buffer) {
    freq = 440 * Math.pow(2, 1 / 12 * l);
    console.log(freq);
    
    if (node !== null) {
        // node.stop();
    }
    // context.suspend();
    node = play(buffer);
    // context.resume();
}

function clickPlayScale(e) {
    let l = parseInt(e.target.getAttribute('hz'));
    let i = parseInt(e.target.getAttribute('index'));
    playScale(l, buffers[i]);
}

for (let i = 0; i < scaleName.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = scaleName[i];
    btn.setAttribute('hz', scaleLevel[i]);
    btn.setAttribute('index', i);
    btn.addEventListener('click', clickPlayScale);
    scaleButton.appendChild(btn);

    const key = document.createElement('div');
    key.setAttribute('hz', scaleLevel[i]);
    key.setAttribute('index', i);
    key.addEventListener('click', clickPlayScale);
    keyboard.appendChild(key);

    let b = context.createBuffer(
        2,
        context.sampleRate * time,
        context.sampleRate
    );
    buffers.push(b);
    let f = 440 * Math.pow(2, 1 / 12 * scaleLevel[i]);
    setup(b, time, f, amp);
}

for (let i = 0; i < scaleSubLevel.length; i++) {
    const key = document.createElement('div');
    key.setAttribute('hz', scaleSubLevel[i]);
    key.setAttribute('index', i);
    key.classList.add('black');
    key.style.left = scaleSubLeft[i] + 'px';
    key.addEventListener('click', clickPlayScale);
    keyboard.appendChild(key);

    let b = context.createBuffer(
        2,
        context.sampleRate * time,
        context.sampleRate
    );
    subBuffers.push(b);
    let f = 440 * Math.pow(2, 1 / 12 * scaleSubLevel[i]);
    setup(b, time, f, amp);
}

function setupAll() {
    for (let i = 0; i < scaleLevel.length; i++) {
        let f = 440 * Math.pow(2, 1 / 12 * scaleLevel[i]);
        setup(buffers[i], time, f, amp);
    }
    for (let i = 0; i < scaleSubLevel.length; i++) {
        let f = 440 * Math.pow(2, 1 / 12 * scaleSubLevel[i]);
        setup(subBuffers[i], time, f, amp);
    }
}

const setting = document.getElementById('setting');

document.body.appendChild(createSlider('volume', volume / 2, v => {
    volume = v * 2;
}));

setting.appendChild(createRadio(['linear', 'quad', 'bounce', 'none'], (v, id, i) => {
    ease = i;
}));

setting.appendChild(createRadio(['sine', 'overtone', 'square', 'triangle'], (v, id, i) => {
    wave = i;
}));

document.getElementById('setup').addEventListener('click', e => {
    const length = parseFloat(lengthInput.value);
    if (time !== length) {
        time = length;
        resize(time);
    }
    setupAll();
});

document.body.addEventListener('keydown', e => {
    let key = keys.indexOf(e.key);
    if (key >= 0) {
        playScale(scaleLevel[key], buffers[key]);
    }
    key = subKeys.indexOf(e.key);
    if (key >= 0) {
        playScale(scaleSubLevel[key], subBuffers[key]);
    }
}, false);

function play(buffer) {
    const source = context.createBufferSource();
    const gainNode = context.createGain();
    gainNode.gain.value = volume;
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.start();
    return source;
}

