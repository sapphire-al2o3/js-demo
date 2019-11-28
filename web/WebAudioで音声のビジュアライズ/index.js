// forked from sapphire_al2o3's "Web Audioで音声再生 その2" http://jsdo.it/sapphire_al2o3/8uD2
(function() {
    var context = new (window.AudioContext || window.webkitAudioContext)(),
        source,
        timer,
        audio = new Audio(),
        analyser = context.createAnalyser(),
        timeDomain = new Uint8Array(1024);
    var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');
    function render() {
        analyser.getByteTimeDomainData(timeDomain);
        
        var r = Math.abs(timeDomain[0] - 128),
            x = canvas.width / 2,
            y = canvas.height / 2;
        
        for(var i = 1; i < timeDomain.length; i++) {
            var t = Math.abs(timeDomain[i] - 128);
            r += t;
        }
        
        r /= timeDomain.length;
        var a = 0.3;
        //radius = radius * a + r * (1 - a);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2.0, false);
        ctx.strokeStyle = '#2985e3';
        ctx.lineWidth = 5;
        ctx.stroke();
    }
    
    function play() {
        var source = context.createMediaElementSource(audio),
            filter = context.createBiquadFilter();
        source.connect(analyser);
        analyser.connect(context.destination);
        audio.play();
        return source;
    }
    
    function load(file) {
        var f = new FileReader();
        f.onload = function(e) {
            document.getElementById('text').style.display = 'none';
            canvas.style.display = 'block';
            var blob = new Blob([e.target.result], {"type": file.type});
			audio.src = window.URL.createObjectURL(blob);
			play();
            audio.play();
            timer = setInterval(render, 1000 / 30);
        };
        f.readAsArrayBuffer(file);
        
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
    canvas.addEventListener('click', function(e) {
        if(!playing) {
            audio.play();
        } else {
            audio.pause();
        }
        playing = !playing;
    });
})();