// forked from sapphire_al2o3's "WebAudioで音声再生" http://jsdo.it/sapphire_al2o3/o9el
window.onload = () => {
    let loading = document.getElementById('loading'),
        source,
        audio = new Audio();
    
    function play() {
        let context = new AudioContext();
        let source = context.createMediaElementSource(audio),
            filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        source.connect(filter);
        filter.connect(context.destination);
        audio.play();
        return source;
    }
    
    function load(file) {
        let f = new FileReader();
        f.onload = function(e) {
            loading.textContent = '100%';
            document.getElementById('play').style.display = 'inline';
            var blob = new Blob([e.target.result], {"type": file.type});
            audio.src = window.URL.createObjectURL(blob);
            document.getElementById('play').style.display = 'inline';
            source = play();
            audio.play();
        };
        f.readAsArrayBuffer(file);
        f.onprogress = function(e) {
            if(e.lengthComputable) {
                var percentLoaded = Math.round((e.loaded / e.total) * 100);
                loading.textContent = percentLoaded + '%';
            }
        };
        
    }
    
    document.addEventListener('dragover', function(e) {
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
        e.stopPropagation();
    });
    
    document.addEventListener('drop', function(e) {
        if(source) source.stop(0);
        load(e.dataTransfer.files[0]);
        e.preventDefault();
        e.stopPropagation();
    });
    var playing = true;
    document.getElementById('play').addEventListener('click', function(e) {
        if(!playing) {
            audio.play();
        } else {
            audio.pause();
        }
        e.target.textContent = playing ? 'Play' : 'Stop';
        playing = !playing;
    });
};