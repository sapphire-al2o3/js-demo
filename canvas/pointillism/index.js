window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    const img = document.getElementById('image');
    canvas.width = img.width;
    canvas.height = img.height;

    let w = canvas.width;
    let h = canvas.height;

    ctx.drawImage(img, 0, 0, w, h);

    let block = 8;
    let radius = 4.5;

    let image = ctx.getImageData(0, 0, w, h);
    let data = image.data;
    let buffer = new Uint8Array(w * h / (block * block) ^ 0);

    const PI2 = Math.PI * 2;

    function drawCircle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, PI2, false);
        ctx.fill();
    }

    function accum() {
        let l = 0;
        for (let i = 0; i < h; i += block) {
            for (let j = 0; j < w; j += block) {
                let ave = 0;
                for (let y = 0; y < block; y++) {
                    for (let x = 0; x < block; x++) {
                        let k = ((i + y) * w + (j + x)) * 4;
                        let r = data[k];
                        let g = data[k + 1];
                        let b = data[k + 2];
                        ave += (r * 0.299 + g * 0.587 + b * 0.114) ^ 0;
                    }
                }
                
                buffer[l] = ave / (block * block);
                l++;
            }
        }
    }

    function render() {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#444';
        const b = block;
        let l = 0;
        for (let i = b / 2; i < h; i += b) {
            for (let j = b / 2; j < w; j += b) {
                let r = ((255 - buffer[l]) / 255) * radius;
                l++;
                drawCircle(j, i, r);
            }
        }
    }

    accum();
    render();

    document.body.appendChild(createSlider('radius', radius / block, v => {
        radius = v * block;
        render();
    }));

    document.body.appendChild(createRadio(['4', '8', '12'], (v, id, i) => {
        block = parseInt(id);
        buffer = new Uint8Array(w * h / (block * block));
        accum();
        render();
    }, 1));

    function dropImage(img, cb) {
        document.body.addEventListener('dragover', e => {
            e.preventDefault();
        }, false);

        document.body.addEventListener('drop', e => {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onload = e => {
                img.src = reader.result;
                img.onload = cb;
            };
            reader.readAsDataURL(file);
            e.preventDefault();
        }, false);
    }

    dropImage(img, () => {
        w = canvas.width = img.width;
        h = canvas.height = img.height;
        ctx.drawImage(img, 0, 0, w, h);
        image = ctx.getImageData(0, 0, w, h);
        data = image.data;
        buffer = new Uint8Array(w * h / (block * block) ^ 0);
        accum();
        render();
    });
};
