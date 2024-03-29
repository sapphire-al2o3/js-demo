(function() {
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');
    
    let gauss = false;

    document.getElementById('size').appendChild(createRadio(['256x256', '128x128', '64x64', '32x32', '16x16', '8x8'], (v, id, i) => {
        canvas.width = canvas.height = parseInt(id, 10);
        render();
    }));

    document.getElementById('colors').appendChild(createRadio(['256', '32', '16', '4', '3', '2'], (v, id, i) => {
        colorNum = parseInt(id, 10);
        render();
    }));

    document.getElementById('random').appendChild(createCheckbox('Gauss', v => {
        gauss = v;
        render();
    }));

    function randNormal() {
        let x = Math.random(),
            y = Math.random(),
            r = Math.sqrt(-2.0 * Math.log(x)) / 3.0,
            t = 2.0 * Math.PI * y;
        return {
            z: r * Math.cos(t),
            w: r * Math.sin(t)
        };
    }

    let x = 123456789,
        y = 362436069,
        z = 521288629,
        w = 88675123; 
    
    function xorshift() {
        let t = x ^ (x << 11);
        [x, y, z] = [y, z, w];
        return w = (w ^ (w >> 19)) ^ (t ^ (t >> 8));
    }

    function rand(l) {
        return Math.random() * (l + 1) ^ 0;
    }

    function clamp(x, min, max) {
        return x < min ? min : x > max ? max : x;
    }

    let colorNum = 256;

    function render() {
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height),
            data = image.data,
            table = new Uint8Array(image.width * image.height);

        if (gauss) {
            for(let i = 0, l = table.length; i < l; i += 2) {
                let r = randNormal();
                table[i] = clamp((r.z * 0.5 + 0.5) * 256 ^ 0, 0, 255);
                table[i + 1] = clamp((r.w * 0.5 + 0.5) * 256 ^ 0, 0, 255);
            }
        } else {
            for(let i = 0, l = table.length; i < l; i++) {
                table[i] = (colorNum * i / l ^ 0) * 255 / (colorNum - 1) ^ 0;
            }
            
            for(let i = table.length - 1; i > 0; i--) {
                let j = rand(i),
                    t = table[i];
                table[i] = table[j];
                table[j] = t;
            }
        }
        
        for(let i = 0, l = data.length; i < l; i += 4) {
            let v = table[i / 4];
            data[i] = data[i + 1] = data[i + 2] = v;
            data[i + 3] = 255;
        }

        ctx.putImageData(image, 0, 0);
    }

    render();
})();