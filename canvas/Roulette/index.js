const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;


let items = [
    'あ',
    'い',
    'う',
    'え',
    'お',
    'か',
    'き'
];

const reelLength = items.length * 120;

ctx.imageSmoothingEnabled = false;

function shuffle(array) {
    for(var i = 0, l = array.length; i < l; i++) {
        var j = Math.random() * l ^ 0,
            t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
}

window.onload = () => {

    ctx.font = 'bold 96px Meiryo';
    ctx.fillStyle = '#EEE';
    ctx.lineWidth = 8;

    // ctx.textBaseline = 'top';

    const grad0 = ctx.createLinearGradient(0, 0, 0, 50);
    grad0.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    grad0.addColorStop(1, 'rgba(0, 0, 0, 0)');

    const grad1 = ctx.createLinearGradient(0, height - 50, 0, height);
    grad1.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad1.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

    const button = document.getElementById('start');
    const font = document.getElementById('font');

    let randIndices = [];

    for (let i = 0; i < items.length; i++) {
        randIndices.push(i);
    }
    shuffle(randIndices);

    let index = 0;
    let elapsedTime = 0;
    let interval = 60;
    let state = 0;
    let time = 0;
    let counter = 0;
    let blink = false;
    let reelOffset = 0;
    let speed = 0.1;

    function start() {
        state = 1;
        index = Math.random() * images.length ^ 0;
        // button.textContent = 'STOP';
        button.classList.add('stop');
    }

    function stop() {
        state = 2;
        time = 10 + Math.random() * 3;
        button.classList.remove('stop');
        button.classList.add('disable');
    }

    function reset() {
        // button.textContent = 'START';
        button.classList.remove('disable');
        state = 4;
    }

    function drawText(index, x, y) {
        // let text = prefectures[k];
        // offscreenCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        // offscreenCtx.fillText(text, 0, 14);
        // ctx.drawImage(offscreen, 0, 0, offscreen.width * scale, offscreen.height * scale);

        // ctx.strokeText(text, 20, 60);
        // ctx.fillText(text, 20, 60);

        let text = yomi[index];
        let offset = 0;
        for (let i = 0; i < text.length; i++) {
            let c = text[i].charCodeAt() - 'a'.charCodeAt();
            let imageX = fontOffset[c];
            ctx.drawImage(font, imageX, 0, fontWidth[c], 12, x + offset * scale, y, fontWidth[c] * scale, 12 * scale);
            offset += fontWidth[c] + 1;
        }
    }

    let testOffset = 390;

    function draw() {
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = grad0;
        ctx.fillRect(0, 0, width, 100);
        ctx.fillStyle = grad1;
        ctx.fillRect(0, height - 100, width, 100);

        // reelOffset = testOffset;

        ctx.fillStyle = '#000';
        for (let i = 0; i < 4; i++) {
            
            let y = (i * 120 + reelOffset);// % 360 + 100;
            let k = i;// + ((reelOffset) / 120 ^ 0);
            if (y > height) {
                y -= height + 120;
                k = items.length - (4 - i);
            }
            
            // if (k < 0) k += items.length;
            const text = items[k % items.length];
            const tm = ctx.measureText(text);
            
            ctx.fillRect(0, y, width, 10);
            ctx.fillText(text, (width - tm.width) * 0.5, y + 96);
        }
    }

    function update(delta) {
        reelOffset += delta * speed;
        if (reelOffset > reelLength) {
            reelOffset -= reelLength;
        }
        
        draw();
    }

    update(0);

    setAnimationFrame(update, 1000 / 30);

    button.addEventListener('click', e => {
        if (state === 0) {
            start();
        } else if (state === 1) {
            stop();
        } else if (state === 4) {
            start();
        }
    }, false);
};
