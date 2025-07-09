const context = new window.AudioContext;
const time = 0.2;
const buffer = context.createBuffer(
    2,
    context.sampleRate * time,
    context.sampleRate
);

let freq = 3000;

function setup() {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        const b = buffer.getChannelData(i);
        const l = buffer.length;
        for (let j = 0; j < buffer.length; j++) {
            let t = j / l * time;
            let f = t * freq * Math.PI;
            let w = 1 - j / l;
            b[j] = w * Math.sin(f);
        }
    }
}

document.body.appendChild(createSlider('freq', (freq + 100) / 10000, v => {
    freq = v * 10000 + 100;
}));

function play() {
    setup();
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    // source.loop = true;
    source.start();
}

let playing = false;
let start = false;
const button = document.getElementById('play');
button.addEventListener('click', (e) => {
    context.suspend();
    play();
    context.resume();
    
});
