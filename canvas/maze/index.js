const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;
const TO_RAD = Math.PI / 180;
const ROT_60 = TO_RAD * 60;

const maze = [];
let n = 31;
let b = 8;

for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (j === 0 || i === 0 || j === n - 1 || i === n - 1) {
            maze.push(1);
        } else {
            maze.push(0);
        }
    }
}

for (let i = 2; i < n - 2; i += 2) {
    for (let j = 2; j < n - 2; j += 2) {
        let k = i * n + j;
        maze[k] = 1;
    }
}

function dir3(d) {
    switch(d) {
        case 0: return 1;
        case 1: return n;
        case 2: return -1;
    }
    return 0;
}

function dir4(d) {
    switch(d) {
        case 0: return 1;
        case 1: return n;
        case 2: return -n;
        case 3: return -1;
    }
    return 0;
}

for (let i = 2; i < n - 2; i += 2) {
    let k = 2 * n + i;
    let d = Math.random() * 4 ^ 0;
    let w = k + dir4(d);
    if (maze[w] === 0) {
        maze[w] = 1;
    } else {
        d = Math.random() * 3 ^ 0;
        w = k + dir4(d);
        maze[w] = 1;
    }
}

for (let i = 4; i < n - 2; i += 2) {
    for (let j = 2; j < n - 2; j += 2) {
        let k = i * n + j;
        let d = Math.random() * 3 ^ 0;
        let w = k + dir3(d);
        if (maze[w] === 0) {
            maze[w] = 1;
        } else {
            d = Math.random() * 2 ^ 0;
            w = k + dir3(d);
            maze[w] = 1;
        }
    }
}

function render() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#000'
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let k = i * n + j;
            if (maze[k] === 1) {
                ctx.fillRect(j * b, i * b, b, b);
            }
        }
    }
}

render();

const slider = createSlider('n', 1, v => {
});

document.body.appendChild(slider);
