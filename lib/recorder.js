
function createRecorder(canvas, time) {
    const wrapper = document.createElement('div');
    const btn = document.createElement('a');
    let recording = false;
    wrapper.appendChild(btn);
    btn.textContent = 'Rec';

    btn.addEventListener('click', () => {
        if (!recording) {
            btn.textContent = 'Stop';

            const stream = canvas.captureStream();
            const recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
            recorder.ondataavailable = (event) => {
                const blob = new Blob([event.data], {type: event.data.type});
                window.URL.createObjectURL(blob);
            };
            recorder.onstop = stop;
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
