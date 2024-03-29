const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = "#FFF";
ctx.strokeStyle = "#9BF";
ctx.lineWidth = 2;

let x = 0;
let y = 0;
let time = 0;
let d = 0;

setAnimationFrame((dt) => {
    time += dt;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    x = Math.cos(time * 0.01);
    y = Math.sin(time * 0.01);
    d += dt * 0.1;
    d = d % 40;
    const s = 20;
    for(let i = -20; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * s - d, 0);
        ctx.lineTo(320, i * s + 320 - d);
        ctx.stroke();
    }

    for(let i = -20; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * s + d);
        ctx.lineTo(i * s + 320 + d, 320);
        ctx.stroke();
    }
}, 1000 / 30);

const video = document.getElementById('video');
let data = [];
let recorder;

function stop() {
    recorder.stop();
    const buffer = new Blob(data, {type: 'video/webm'});
    video.src = window.URL.createObjectURL(buffer);
    video.controls = true;
    document.getElementById('capture').disabled = false;
}

document.getElementById('capture').addEventListener('click', e => {
    let stream = canvas.captureStream(30);
    data.length = 0;
    recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    recorder.ondataavailable = event => data.push(event.data);
    recorder.onstop = stop;
    recorder.start(100);
    document.getElementById('capture').disabled = true;
}, false);

document.getElementById('stop').addEventListener('click', e => {
    stop();
}, false);

const types = [
    "video/webm",
    "audio/webm",
    "video/webm;codecs=vp8",
    "video/webm;codecs=daala",
    "video/webm;codecs=h264",
    "audio/webm;codecs=opus",
    "video/mpeg",
    "video/mp4"
  ];
  
for (const type of types) {
    console.log(`${type}:${MediaRecorder.isTypeSupported(type)}`);
}
