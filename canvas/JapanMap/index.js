const prefectures = [
    '北海道',
    '青森',
    '岩手',
    '宮城',
    '秋田',
    '山形',
    '福島',
    '茨城',
    '栃木',
    '群馬',     // 10
    '埼玉',
    '千葉',
    '東京',
    '神奈川',
    '新潟',
    '富山',
    '石川',
    '福井',
    '山梨',
    '長野',     // 20
    '岐阜',
    '静岡',
    '愛知',
    '三重',
    '滋賀',
    '京都',
    '大阪',
    '兵庫',
    '奈良',
    '和歌山',   // 30
    '鳥取',
    '島根',
    '岡山',
    '広島',
    '山口',
    '徳島',
    '香川',
    '愛媛',
    '高知',
    '福岡',     // 40
    '佐賀',
    '長崎',
    '熊本',
    '大分',
    '宮崎',
    '鹿児島',
    '沖縄'
];

const yomi = [
    'hokkaido',
    'aomori',
    'iwate',
    'miyagi',
    'akita',
    'yamagata',
    'fukushima',
    'ibaraki',
    'tochigi',
    'gunma',
    'saitama',
    'chiba',
    'tokyo',
    'kanagawa',
    'niigata',
    'toyama',
    'ishikawa',
    'fukui',
    'yamanashi',
    'nagano',
    'gifu',
    'shizuoka',
    'aichi',
    'mie',
    'shiga',
    'kyoto',
    'osaka',
    'hyogo',
    'nara',
    'wakayama',
    'tottori',
    'shimane',
    'okayama',
    'hiroshima',
    'yamaguchi',
    'tokushima',
    'kagawa',
    'ehime',
    'kochi',
    'fukuoka',
    'saga',
    'nagasaki',
    'kumamoto',
    'oita',
    'miyazaki',
    'kagoshima',
    'okinawa'
];

const pos = [
    118, 6,
    119, 36,
    124, 46,
    123, 56,
    117, 45,
    116, 55,
    116, 64,
    120, 72,
    118, 69,
    111, 70,
    113, 76,
    121, 79,
    114, 80,
    114, 82,
    106, 59,
    99, 69,
    95, 65,
    91, 75,
    110, 79,
    104, 71,
    97, 74,
    105, 82,
    98, 82,
    92, 82,
    93, 80,
    88, 77,
    87, 82,
    83, 78,
    90, 85,
    87, 87,
    77, 78,
    67, 72,
    77, 80,
    70, 81,
    61, 82,
    77, 88,
    77, 87,
    68, 89,
    70, 91,
    57, 89,
    55, 92,
    48, 83,
    56, 94,
    61, 91,
    60, 97,
    43, 102,
    14, 139
];

const fontWidth = [
    8, // A
    8, // B
    8, // C
    8, // D,
    8, // E,
    8, // F,
    8, // G,
    8, // H,
    6, // I,
    8, // J,
    9, // K,
    8, // L,
    9, // M,
    8, // N,
    8, // O,
    8, // P,
    9, // Q,
    8, // R,
    7, // S,
    8, // T,
    8, // U,
    8, // V,
    10, // W,
    8, // X,
    8, // Y,
    8, // Z,
];

const fontOffset = [];
let offsetX = 0;
for (let i = 0; i < fontWidth.length; i++) {
    fontOffset.push(offsetX);
    offsetX += fontWidth[i];
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const audio = new Audio('se.wav');
const audio2 = new Audio('se2.wav');

let scale = 3;

canvas.width = 160 * scale;
canvas.height = 160 * scale;

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
    const frame = document.getElementById('map_frame');
    const images = [];

    for (let i = 0; i < prefectures.length; i++) {
        images.push(document.getElementById(`p${i + 1}`));;
    }

    for (let i = 0; i < images.length; i++) {
        let x = pos[i * 2] * scale;
        let y = pos[i * 2 + 1] * scale;
        ctx.drawImage(images[i], x, y, images[i].width * scale, images[i].height * scale)
    }

    const offscreen = new OffscreenCanvas(128, 64);
    const offscreenCtx = offscreen.getContext('2d');
    ctx.font = 'bold 42px Meiryo';
    offscreenCtx.font = 'bold 14px MS UI Gothic';
    ctx.fillStyle = '#EEE';
    ctx.lineWidth = 8;

    const button = document.getElementById('start');
    const font = document.getElementById('font');

    let randIndices = [];

    for (let i = 0; i < images.length; i++) {
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

        if (state === 0) {
            ctx.drawImage(frame, 0, 0, frame.width * scale, frame.height * scale);
            for (let i = 0; i < images.length; i++) {
                let x = pos[i * 2] * scale;
                let y = pos[i * 2 + 1] * scale;
                ctx.drawImage(images[i], x, y, images[i].width * scale, images[i].height * scale)
            }
        } else if (state === 1) {
            // let k = randIndices[index];
            let k = index;

            ctx.drawImage(frame, 0, 0, frame.width * scale, frame.height * scale);
            let x = pos[k * 2] * scale;
            let y = pos[k * 2 + 1] * scale;
            ctx.drawImage(images[k], x, y, images[k].width * scale, images[k].height * scale);
            drawText(k, 40, 60);
        } else if (state === 2) {
            // let k = randIndices[index];
            let k = index;
            ctx.drawImage(frame, 0, 0, frame.width * scale, frame.height * scale);
            let x = pos[k * 2] * scale;
            let y = pos[k * 2 + 1] * scale;
            ctx.drawImage(images[k], x, y, images[k].width * scale, images[k].height * scale);

            drawText(k, 40, 60);
        } else if (state === 3) {
            let k = index;
            ctx.drawImage(frame, 0, 0, frame.width * scale, frame.height * scale);
            if ((counter & 1) > 0) {
                let x = pos[k * 2] * scale;
                let y = pos[k * 2 + 1] * scale;
                ctx.drawImage(images[k], x, y, images[k].width * scale, images[k].height * scale);
            }
            drawText(k, 40, 60);
        } else if (state === 4) {
            let k = index;
            ctx.drawImage(frame, 0, 0, frame.width * scale, frame.height * scale);
            let x = pos[k * 2] * scale;
            let y = pos[k * 2 + 1] * scale;
            ctx.drawImage(images[k], x, y, images[k].width * scale, images[k].height * scale);

            drawText(k, 40, 60);
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
                audio.currentTime = 0;
                audio.play();
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
                audio.currentTime = 0;
                audio.play();
            }

            time -= delta * 0.001;
            if (time < 0) {
                counter = 6;
                state = 3;
                time = 0.5;
                blink = false;
                audio2.currentTime = 0;
                audio2.play();
            }
        } else if (state === 3) {
            time -= delta * 0.001;
            if (time < 0) {
                time = 0.3;
                counter--;
                audio2.currentTime = 0;
                audio2.play();
            }
            if (counter < 0) {
                reset();
            }
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
