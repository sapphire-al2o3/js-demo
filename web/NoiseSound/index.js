const context = new window.AudioContext;
const buffer = context.createBuffer(
    2,
    context.sampleRate * 3,
    context.sampleRate
);

for (let i = 0; i < buffer.numberOfChannels; i++) {
    const b = buffer.getChannelData(i);
    for (let j = 0; j < buffer.length; j++) {
        b[j] = Math.random() * 2 - 1;
    }
}


function play() {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.loop = true;
    source.start();
}

let playing = false;
let start = false;
const button = document.getElementById('play');
button.addEventListener('click', (e) => {
    if (!start) {
        start = true;
        play();
    }
    
    if (!playing) {
        context.resume();
        button.textContent = 'Pause'
    } else {
        // source.stop();
        context.suspend();
        button.textContent = 'Play'
    }
    
    playing = !playing;
});
