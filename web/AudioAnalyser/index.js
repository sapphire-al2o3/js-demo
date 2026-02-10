
let context = new window.AudioContext(),
    source = null,
    timer;
const audio = new Audio('sound.wav');
const analyser = context.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const timeDomain = new Uint8Array(bufferLength);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let frame = 0;

function render() {
    analyser.getByteTimeDomainData(timeDomain);
    
    // ctx.fillStyle = "#FFF";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";

    let min = 1000;
    let max = 0;
    let r = 0;
    for(let i = 0; i < timeDomain.length; i++) {
        let d = timeDomain[i] - 128;
        let t = Math.abs(timeDomain[i] - 128);
        r += t;
        if (d < min) min = d;
        if (d > max) max = d;
    }
    r /= timeDomain.length;

    // console.log(r);

    ctx.fillStyle = 'rgb(0 0 0)';
    ctx.fillRect(frame, canvas.height * 0.5 - max, 1, min);

    // ctx.beginPath();

    // const sliceWidth = (canvas.width * 1.0) / bufferLength;
    // let x = 0;

    // for (let i = 0; i < bufferLength; i++) {
    //     const v = timeDomain[i] / 128.0;
    //     const y = (v * canvas.height) / 2;

    //     if (i === 0) {
    //         ctx.moveTo(x, y);
    //     } else {
    //         ctx.lineTo(x, y);
    //     }

    //     x += sliceWidth;
    // }

    // ctx.lineTo(canvas.width, canvas.height / 2);
    // ctx.stroke();

    frame++;
    if (frame > 400) {
        reset();
    }

    if (!audio.ended) {
        requestAnimationFrame(render);
    } else {
        playButton.disabled = false;
        source.disconnect();
        console.log(frame);
    }
}

function play() {
    if (source === null) {
        source = context.createMediaElementSource(audio);
    }
    source.connect(analyser);
    analyser.connect(context.destination);
    // source.connect(context.destination);
    if (context.state === 'suspended') {
        context.resume();
    }
    audio.play();
    return source;
}

function load(file) {
    const f = new FileReader();
    f.onload = (e) => {
        document.getElementById('text').style.display = 'none';
        canvas.style.display = 'block';
        let blob = new Blob([e.target.result], {"type": file.type});
        audio.src = window.URL.createObjectURL(blob);
        audio.addEventListener('canplaythrough', (e) => {
            play();
        });
    };
    f.readAsArrayBuffer(file);
    
}

document.addEventListener('dragover', (e) => {
    e.dataTransfer.dropEffect = 'copy';
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('drop', (e) => {
    if(source) source.stop(0);
    load(e.dataTransfer.files[0]);
    e.preventDefault();
    e.stopPropagation();
});

let playing = false;
const playButton = document.getElementById('play');

function reset() {
    frame = 0;
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

playButton.addEventListener('click', (e) => {
    reset();
    play();
    render();
    playButton.disabled = true;
});
