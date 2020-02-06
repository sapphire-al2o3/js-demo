const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = "#9BF";
ctx.strokeStyle = "#9BF";
ctx.lineWidth = 2;

let x = 0;
let y = 0;
let time = 0;
let d = 0;

setAnimationFrame((dt) => {
    time += dt;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
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
        ctx.lineTo(i * 20 + 300 + d, 300);
        ctx.stroke();
    }

    // ctx.strokeRect(x, y, 100, 100);
}, 1000 / 30);

document.getElementById('capture').addEventListener('click', e => {
    // let stream = canvas.captureStream(30);
    // let recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    // let data = [];
    // recorder.ondataavailable = event => data.push(event.data);
    document.getElementById('capture').disabled = true;
}, false);

document.getElementById('stop').addEventListener('click', e => {
    // let stream = canvas.captureStream(30);
    // let recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    // let data = [];
    // recorder.ondataavailable = event => data.push(event.data);
    document.getElementById('capture').disabled = false;
}, false);
