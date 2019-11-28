(function() {
    var context = new (window.AudioContext || window.webkitAudioContext)(),
        loading = document.getElementById('loading'),
        source,
        buffer;
    
    function play() {
        var source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(0);
        return source;
    }
    
    function load(name) {
        var f = new FileReader();
        f.onload = function(e) {
            loading.textContent = '100%';
            context.decodeAudioData(
                e.target.result,
                function(b) {
                    document.getElementById('play').style.display = 'inline';
                    buffer = b;
                    source = play();
                },
                function(error) {
                    console.error(error);
                }
            );
        };
        f.readAsArrayBuffer(name);
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
            source = play();
        } else {
            source.stop(0);
        }
        e.target.textContent = playing ? 'Play' : 'Stop';
        playing = !playing;
    });
})();