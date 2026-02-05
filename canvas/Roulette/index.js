const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
const itemHeight = 120;
const dispItemNum = height / 120 + 1 ^ 0;

const audio = new Audio('se.wav');

let items = [
    'あ',
    'い',
    'う',
    'え',
    'お',
    // 'か',
    // 'き',
    // 'く',
    // 'け',
    // 'こ',
];

items = items.reverse();

const reelLength = items.length * itemHeight;

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
    let reelOffset = itemHeight * 1.5;
    let speed = 0;
    let goal = 0;

    function start() {
        state = 1;
        // index = Math.random() * images.length ^ 0;
        button.textContent = 'STOP';
        button.classList.add('stop');
        speed = 2;
        reelOffset = (reelOffset / itemHeight ^ 0) * itemHeight + itemHeight * 0.5 ^ 0;
    }

    function stop() {
        // state = 2;
        // time = 10 + Math.random() * 3;
        button.classList.remove('stop');
        button.classList.add('disable');
        
        state = 2;
        // speed = 0.0;
        time = 3;
    }

    function reset() {
        // button.textContent = 'START';
        button.classList.remove('disable');
        button.textContent = 'START';
        state = 0;
    }

    let testOffset = 0;

    function getText(k) {
        if (k < 0) k += items.length;
        return items[k % items.length];
    }

    function draw() {
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = grad0;
        ctx.fillRect(0, 0, width, 100);
        ctx.fillStyle = grad1;
        ctx.fillRect(0, height - 100, width, 100);

        // reelOffset = testOffset;

        let itemOffset = reelOffset % itemHeight;
        let itemIndex = reelOffset / itemHeight ^ 0;

        ctx.fillStyle = '#000';
        for (let i = 0; i < dispItemNum; i++) {
            
            let y = (i * itemHeight + itemOffset);// % 360 + 100;
            let k = i - itemIndex;// + ((reelOffset) / 120 ^ 0);
            if (y > height) {
                y -= height + itemHeight;
                k = items.length - (dispItemNum - i + itemIndex);
            }
            // if (y > height) {
            //     y -= height + itemHeight;
            //     k = i - 1;
            // }
            
            // if (k < 0) k += items.length;
            const text = getText(k);
            const tm = ctx.measureText(text);
            
            ctx.fillRect(0, y, width, 10);
            ctx.fillText(text, (width - tm.width) * 0.5, y + 96);
        }
    }

    let prevSE = 0;
    let intervalSE = 0;
    function update(delta) {
        reelOffset += delta * speed;
        if (reelOffset > reelLength) {
            reelOffset -= reelLength;
        }

        intervalSE += delta;
        if (state === 1 || state === 2) {
            let se = reelOffset / itemHeight ^ 0;
            if (intervalSE > 80 && se != prevSE) {
                audio.currentTime = 0;
                audio.play();
                prevSE = se;
                intervalSE = 0;
            }
        }

        if (state === 2) {
            if (time > 0 && goal === 0) {
                speed = time / 2;
                time -= delta * 0.001;
                if (speed < 0.1) {
                    goal = ((reelOffset / itemHeight) ^ 0) * itemHeight + itemHeight / 2;
                    if (reelOffset % itemHeight > itemHeight / 2) {
                        goal += itemHeight;
                    }
                    console.log(goal, reelOffset);
                }
            } else if (goal > 0) {
                let d = goal - reelOffset;
                if (d < 1) {
                    state = 0;
                    speed = 0;
                    goal = 0;
                    reset();
                }
            }
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
        } else if (state === 2) {
            start();
        }
    }, false);

    // document.body.appendChild(createSlider('speed', speed / 3, v => {
    //     speed = v * 3;
    // }));

    // document.body.appendChild(createSlider('offset', 0, v => {
    //     testOffset = v * reelLength;
    //     draw();
    // }));

    // document.body.appendChild(createButton('draw', () => {
    //     draw();
    // }));

    function setup() {
        items.length = 0;
        let list = document.querySelectorAll('.list-item');
        for (let i = 0; i < list.length; i++) {
            items.push(list[i].value);
        }
    }

    document.body.appendChild(createButton('setup', () => {
        setup();
        draw();
    }));
};

function removeListItem(e) {
    document.getElementById('wrapper').removeChild(e.target.parentNode);
}

let index = 0;
document.getElementById('add').addEventListener('click', e => {
    let input = document.createElement('input');
    let item = document.createElement('div');
    let removeButton = document.createElement('span');
    input.setAttribute('type', 'text');
    input.classList.add('list-item')
    removeButton.innerText = '✖';
    removeButton.addEventListener('click', removeListItem);
    item.setAttribute('id', 'item-' + index.toString())
    item.appendChild(input);
    item.appendChild(removeButton);
    document.getElementById('wrapper').appendChild(item);
    index++;
});

