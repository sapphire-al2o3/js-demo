window.onload = () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const palette = document.getElementById('palette');

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

    canvas.addEventListener('click', e => {
        const x = (e.offsetX / block ^ 0);
        const y = (e.offsetY / block ^ 0);
        const k = y * sizeX + x;
        map[k] = 1;
        ctx.fillStyle = '#0EE';
        ctx.fillRect(x * block, y * block, block, block);
    });

    render();
};
