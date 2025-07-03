const context = new window.AudioContext;
const buffer = context.createBuffer(
    2,
    context.sampleRate * 3,
    context.sampleRate
);

function randNormal() {
    let x = Math.random(),
        y = Math.random(),
        r = Math.sqrt(-2.0 * Math.log(x)) / 3.0,
        t = 2.0 * Math.PI * y;
    return {
        z: r * Math.cos(t),
        w: r * Math.sin(t)
    };
}

function setup(r) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        const b = buffer.getChannelData(i);
        for (let j = 0; j < buffer.length; j++) {
            if (r) {
                b[j] = Math.random() * 2 - 1;
            } else {
                b[j] = randNormal().z;
            }
        }
    }
}


function play(r) {
    setup(r);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.loop = true;
    source.start();
}

let type = 0;
let playing = false;
let start = false;
const button = document.getElementById('play_rand');
button.addEventListener('click', (e) => {
    if (type === 1) {
        start = false;
        playing = false;
        buttonN.textContent = 'Play'
    }
    if (!start) {
        start = true;
        play(true);
    }
    
    if (!playing) {
        type = 0;
        context.resume();
        button.textContent = 'Pause'
    } else {
        context.suspend();
        button.textContent = 'Play'
    }
    
    playing = !playing;
});

const buttonN = document.getElementById('play_normal');
buttonN.addEventListener('click', (e) => {
    if (type === 0) {
        start = false;
        playing = false;
        button.textContent = 'Play'
    }

    if (!start) {
        start = true;
        play(false);
    }
    
    if (!playing) {
        type = 1;
        context.resume();
        buttonN.textContent = 'Pause'
    } else {
        context.suspend();
        buttonN.textContent = 'Play'
    }
    
    playing = !playing;
});
