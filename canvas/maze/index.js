const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;
const TO_RAD = Math.PI / 180;
const ROT_60 = TO_RAD * 60;

const maze = [];
let n = 15; 

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
        case 2: return -1;
        case 3: return -n;
    }
    return 0;
}

for (let i = 2; i < n - 2; i += 2) {
    let k = 2 * n + i;
    let d = Math.random() * 4 ^ 0;
    for (let x = 0; x < 4; x++) {
        let w = k + dir4((d + x) % 4);
        if (maze[w] === 0) {
            maze[w] = 1;
            break;
        }
    }
}

for (let i = 4; i < n - 2; i += 2) {
    for (let j = 2; j < n - 2; j += 2) {
        let k = i * n + j;
        let d = Math.random() * 3 ^ 0;
        for (let x = 0; x < 3; x++) {
            let w = k + dir3((d + x) % 3);
            if (maze[w] === 0) {
                maze[w] = 1;
                break;
            }
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
                ctx.fillRect(j * 10, i * 10, 10, 10);
            }
        }
    }
}

render();

const slider = createSlider('n', 1, v => {
});

document.body.appendChild(slider);
