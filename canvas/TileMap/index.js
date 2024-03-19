window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const palette = document.getElementById('palette');
    const maptip = document.getElementById('maptip');
    const maptipCursor = document.getElementById('maptip-cursor');

    const output = document.getElementById('output');


    let w = canvas.width;
    let h = canvas.height;

    let block = 16;

    let sizeX = 16;
    let sizeY = 16;

    let image = ctx.getImageData(0, 0, w, h);
    let data = image.data;
    let buffer = new Uint8Array(w * h / (block * block) ^ 0);

    let map = [];
    let selectedMaptip = 0;

    for (let i = 0; i < sizeY * sizeX; i++) {
        map.push(0);
    }

    function render() {
        ctx.fillStyle = '#AAA';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#444';
        const b = block;
        for (let i = 0; i < sizeY; i++) {
            for (let j = 0; j < sizeX; j++) {
                let k = i + j;
                let x = j * block;
                let y = i * block;
                if (k % 2 === 0) {
                    ctx.fillStyle = '#DDD';
                } else {
                    ctx.fillStyle = '#AAA';
                }
                ctx.fillRect(x, y, block, block);
            }
        }
    }

    function dump() {
        const text = [];
        for (let i = 0; i < sizeY; i++) {
            let line = [];
            for (let j = 0; j < sizeX; j++) {
                let k = i * block + j;
                line.push(map[k]);
            }
            text.push(line.join(','));
        }
        output.value = text.join('\n');
    }

    canvas.addEventListener('click', e => {
        const x = (e.offsetX / block ^ 0);
        const y = (e.offsetY / block ^ 0);
        const k = y * sizeX + x;
        map[k] = selectedMaptip;
        ctx.fillStyle = '#0EE';
        ctx.drawImage(maptip, maptipX * block, maptipY * block, block, block, x * block, y * block, block, block);
        // ctx.fillRect(x * block, y * block, block, block);
    });

    let maptipX = 0;
    let maptipY = 0;
    maptip.addEventListener('click', e => {
        const x = (e.offsetX / block ^ 0);
        const y = (e.offsetY / block ^ 0);
        const k = y * sizeX + x;
        selectedMaptip = k;
        maptipX = x;
        maptipY = y;
        maptipCursor.style.left = (x * block) + 'px';
        maptipCursor.style.top = (y * block) + 'px';
    });

    render();
    dump();

    document.getElementById('load').addEventListener('click', e => {
        const text = output.value;
        const lines = text.split('\n');
        let k = 0;
        for (let i = 0; i < lines.length; i++) {
            const values = lines[i].split(',');
            for (let i = 0; i < values.length; i++) {
                map[k] = parseInt(values[i], 10);
                k++;
            }
        }
        render();

        const b = block;
        for (let i = 0; i < sizeY; i++) {
            for (let j = 0; j < sizeX; j++) {
                let k = i * sizeX + j;
                let m = map[k];
                if (m > 0) {
                    let x = (m - 1);
                    let y = 0;
                    ctx.drawImage(maptip, x * block, y * block, block, block, j * block, i * block, block, block);
                }
            }
        }
    });
};
