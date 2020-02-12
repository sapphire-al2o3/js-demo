function createCapture(id, canvas) {
    let wrapper = document.createElement('div'),
        play = document.createElement('button'),
        download = document.createElement('button');
    
    wrapper.appendChild(play);
    wrapper.appendChild(download);

    let stream = canvas.captureStream(30);
    let data = [];
    let recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
    recorder.ondataavailable = event => data.push(event.data);
    recorder.onstop = () => {

    };

    play.addEventListener('click', () => {
        if(recorder.state === 'recording') {
            recorder.stop();
            play.textContent = 'Record';
        } else {
            data.length = 0;
            recorder.start(100);
            play.textContent = 'Stop';
        }
    }, false);

    download.addEventListener('click', () => {
        const blob = new Blob(data, { type: "video/webm" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'record.webm';
        link.click();
    });

    play.textContent = 'Record';
    download.textContent = 'Download';

    return wrapper;
}