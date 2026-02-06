const context = new AudioContext();
let time = 1;
let buffer = context.createBuffer(
    2,
    context.sampleRate * time,
    context.sampleRate
);

let freq = 440;
let amp = 0.1;
let ease = 0;
let wave = 0;
let octove = false;

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

function pulse(t) {
    return t - Math.floor(t) > 0.75 ? 1 : -1;
}

const noiseBuffer = [];
for (let i = 0; i < 100; i++) {
    noiseBuffer.push(Math.random() * 2 - 1);
}


function noise(t) {
    let k = (t - Math.floor(t)) * 100 ^ 0;
    return noiseBuffer[k];
}

function waveform(t) {
    switch (wave) {
        case 0:
            return Math.sin(2 * t * Math.PI);
        case 1:
            return saw(t);
        case 2:
            return square(t);
        case 3:
            return triangle(t);
        case 4:
            return pulse(t);
        case 5:
            return noise(t);
        default:
            return 1;
    }
}

function overtone(wave, t, n) {
    let a = 1;
    let s = 0;
    let f = 0;
    for (let i = 0; i < n; i++) {
        f += wave(t * (i + 1)) * a;
        s += a;
        a /= 2;
    }
    return f / s;
}

function setup() {
    const b = buffer.getChannelData(0);
    const l = buffer.length;
    for (let j = 0; j < buffer.length; j++) {
        let t = j / l * time * freq;
        let f = octove ? overtone(waveform, t, 8) : waveform(t);
        let w = wind(j / l);
        b[j] = amp * w * f;
    }

    const b2 = buffer.getChannelData(1);
    for (let j = 0; j < buffer.length; j++) {
        b2[j] = b[j];
    }
    document.getElementById('File').disabled = false;
}

document.body.appendChild(createSlider('freq', (freq + 100) / 5000, v => {
    freq = v * 5000 + 100;
}));

document.body.appendChild(createSlider('amp', amp, v => {
    amp = v;
}));

document.body.appendChild(createRadio(['linear', 'quad', 'bounce', 'none'], (v, id, i) => {
    ease = i;
}));

document.body.appendChild(createRadio(['sine', 'saw', 'square', 'triangle', 'pulse', 'noise'], (v, id, i) => {
    wave = i;
}));

document.body.appendChild(createCheckbox('overtone', v => {
    octove = v;
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
    }
    context.suspend();
    node = play();
    context.resume();
    
});

function encodeWave(audioBuffer) {
    const sampleRate = audioBuffer.sampleRate;
    const bytesPerSample = 2;
    const buffer = audioBuffer.getChannelData(0);
    const dataLength = buffer.length * bytesPerSample;
    const arrayBuffer = new ArrayBuffer(44 + dataLength);
    const dataView = new DataView(arrayBuffer);

    dataView.setUint8(0, 'R'.charCodeAt(0));
    dataView.setUint8(1, 'I'.charCodeAt(0));
    dataView.setUint8(2, 'F'.charCodeAt(0));
    dataView.setUint8(3, 'F'.charCodeAt(0));
    dataView.setUint32(4, 36 + dataLength, true); // RIFF chunk size
    dataView.setUint8(8, 'W'.charCodeAt(0));
    dataView.setUint8(9, 'A'.charCodeAt(0));
    dataView.setUint8(10, 'V'.charCodeAt(0));
    dataView.setUint8(11, 'E'.charCodeAt(0));

    dataView.setUint8(12, 'f'.charCodeAt(0));
    dataView.setUint8(13, 'm'.charCodeAt(0));
    dataView.setUint8(14, 't'.charCodeAt(0));
    dataView.setUint8(15, ' '.charCodeAt(0));
    dataView.setUint32(16, 16, true); // chunk size
    dataView.setUint16(20, 1, true);  // format
    dataView.setUint16(22, 1, true);  // channels
    dataView.setUint32(24, sampleRate, true);   // サンプリング周波数
    dataView.setUint32(28, sampleRate * bytesPerSample, true);
    dataView.setUint16(32, bytesPerSample, true);
    dataView.setUint16(34, 8 * bytesPerSample, true);
    
    dataView.setUint8(36, 'd'.charCodeAt(0));
    dataView.setUint8(37, 'a'.charCodeAt(0));
    dataView.setUint8(38, 't'.charCodeAt(0));
    dataView.setUint8(39, 'a'.charCodeAt(0));
    dataView.setUint32(40, dataLength, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        let f = buffer[i];
        dataView.setInt16(offset, (f > 0 ? f * 0x7FFF : f * 0x8000) ^ 0, true);
        offset += bytesPerSample;
    }

    return new Blob([dataView], {type: 'audio/wav'})
}

const fileButton = createButton('File', v => {
    const blob = encodeWave(buffer);
    let anchor = document.createElement('a');
    anchor.download = 'sound.wav';
    anchor.href = URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.click();
});

document.body.appendChild(fileButton);
document.getElementById('File').disabled = true;
