
function createRecorder(canvas, time) {
    const wrapper = document.createElement('div');
    const btn = document.createElement('button');
    const anchor = document.createElement('a');
    let recording = false;
    let recorder;
    wrapper.appendChild(btn);
    wrapper.appendChild(anchor);
    wrapper.classList.add('recorder');
    anchor.textContent = 'DL';
    anchor.style.display = 'none';
    btn.textContent = 'Rec';
    btn.addEventListener('click', () => {
        if (!recording) {
            btn.classList.add('recording');
            btn.textContent = 'Stop';
            anchor.style.display = 'none';
            const chunks = [];
            const stream = canvas.captureStream();
            recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            recorder.onstop = (event) => {
                const blob = new Blob(chunks, {type: recorder.mimeType});
                anchor.href = window.URL.createObjectURL(blob);
                anchor.download = 'rec.webm';
                anchor.style.display = 'inline';
            };
            recorder.start();
            recording = true;

            // setTimeout(() => {
            //     recorder.stop();
            // }, time);
        } else {
            recorder.stop();
            recording = false;
            btn.classList.remove('recording');
            btn.textContent = 'Rec';
        }
    }, false);

    return wrapper;
}
