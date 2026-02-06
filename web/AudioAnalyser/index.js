
let context = new window.AudioContext(),
    source,
    timer;
const audio = new Audio('sound.wav');
const analyser = context.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const timeDomain = new Uint8Array(bufferLength);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function render() {
    analyser.getByteTimeDomainData(timeDomain);
    
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 0, 0)";

    ctx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = timeDomain[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    if (!audio.ended) {
        requestAnimationFrame(render);
    } else {
        playButton.disabled = false;
    }
}

function play() {
    let source = context.createMediaElementSource(audio);
    source.connect(analyser);
    // analyser.connect(context.destination);
    source.connect(context.destination);
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

playButton.addEventListener('click', (e) => {
    play();
    render();
    playButton.disabled = true;
});
