
function createRecorder(canvas, time = 0) {
    const wrapper = document.createElement('div');
    const btn = document.createElement('button');
    const anchor = document.createElement('a');
    let recording = false;
    let timer;
    const stream = canvas.captureStream();
    let recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    wrapper.appendChild(btn);
    wrapper.appendChild(anchor);
    wrapper.classList.add('recorder');
    anchor.textContent = 'DL';
    anchor.style.display = 'none';
    btn.textContent = 'REC';
    btn.addEventListener('click', () => {
        if (!recording) {
            btn.classList.add('recording');
            // btn.textContent = 'STOP';
            anchor.style.display = 'none';
            const chunks = [];
            
            
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

            if (time > 0) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    recorder.stop();
                    recording = false;
                    btn.classList.remove('recording');
                }, time);
            }
        } else {
            clearTimeout(timer);
            recorder.stop();
            recording = false;
            btn.classList.remove('recording');
            btn.textContent = 'REC';
        }
    }, false);

    return wrapper;
}
