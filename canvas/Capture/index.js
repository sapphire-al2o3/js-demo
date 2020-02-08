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
    // for(let i = 0; i < 20; i++) {
    //     ctx.beginPath();
    //     ctx.moveTo(i * 20 + d, 0);
    //     ctx.lineTo(i * 20 + 300 + d, 300);
    //     ctx.stroke();
    // }

    for(let i = -20; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 20 + d);
        ctx.lineTo(i * 20 + 320 + d, 320);
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
