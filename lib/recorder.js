
function createRecorder(canvas, time) {
    const wrapper = document.createElement('div');
    const btn = document.createElement('div');
    const anchor = document.createElement('a');
    let recording = false;
    wrapper.appendChild(btn);
    wrapper.appendChild(anchor);
    anchor.textContent = 'DL';
    btn.textContent = 'Rec';
    btn.addEventListener('click', () => {
        if (!recording) {
            btn.textContent = 'Stop';
            const chunks = [];
            const stream = canvas.captureStream();
            const recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            recorder.onstop = (event) => {
                const blob = new Blob(chunks, {type: event.data.type});
                anchor.href = window.URL.createObjectURL(blob);
                anchor.download = 'rec.webm';
            };
            recorder.start();
            recording = true;

            setTimeout(() => {
                recorder.stop();
            }, time);
        } else {
            recorder.stop();
            recording = false;
            btn.textContent = 'Rec';
        }
    }, false);

    return wrapper;
}
