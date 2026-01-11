

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;


let items = [
    'あいう',
    'い',
    'う',
    'え',
    'お'
];

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

    const offscreen = new OffscreenCanvas(128, 64);
    const offscreenCtx = offscreen.getContext('2d');
    ctx.font = 'bold 96px Meiryo';
    offscreenCtx.font = 'bold 14px MS UI Gothic';
    ctx.fillStyle = '#EEE';
    ctx.lineWidth = 8;

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

    function draw() {
        
        ctx.clearRect(0, 0, width, height);
        // ctx.fillStyle = 'rgb(0 0 0 / 0.2)';
        ctx.fillStyle = grad0;
        ctx.fillRect(0, 0, width, 100);
        ctx.fillStyle = grad1;
        ctx.fillRect(0, height - 100, width, 100);

        ctx.fillStyle = '#000';
        for (let i = 0; i < 4; i++) {
            const k = i % items.length;
            const tm = ctx.measureText(items[k]);
            let y = i * 120 + 100 + reelOffset;
            ctx.fillText(items[k], (width - tm.width) * 0.5, y);
        }
    }

    setAnimationFrame((delta) => {

        if (state === 1) {
            elapsedTime += delta;

            if (elapsedTime > interval) {
                if (elapsedTime > interval * 2) {
                    elapsedTime = 0;
                } else {
                    elapsedTime -= interval;
                }
                index = (index + 1) % images.length;
            }
        } else if (state === 2) {
            elapsedTime += delta;
            let i = interval;
            
            if (time < 4) {
                i = i * 30.0 ^ 0;
            } else if (time < 6) {
                i = i * 15.0 ^ 0;
            } else if (time < 8) {
                i = i * 5.0 ^ 0;
            } else if (time < 10) {
                i = i * 2.0 ^ 0;
            }

            if (elapsedTime > i) {
                if (elapsedTime > i * 2) {
                    elapsedTime = 0;
                } else {
                    elapsedTime -= i;
                }
                index = (index + 1) % images.length;
            }

            time -= delta * 0.001;
            if (time < 0) {
                counter = 6;
                state = 3;
                time = 0.5;
                blink = false;
            }
        } else if (state === 3) {
            time -= delta * 0.001;
            if (time < 0) {
                time = 0.3;
                counter--;
            }
            if (counter < 0) {
                reset();
            }
        }

        reelOffset += delta * speed;
        if (reelOffset > height) {
            reelOffset = -height;
        }

        draw();

    }, 1000 / 30);

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
