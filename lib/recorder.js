
function CanvasRecorder(canvas) {
    let data = [];
    let stream = canvas.captureStream(30);
    data.length = 0;
    const recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    recorder.ondataavailable = event => data.push(event.data);
    recorder.onstop = stop;
    recorder.start();
}
