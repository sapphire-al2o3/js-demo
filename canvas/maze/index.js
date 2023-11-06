const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let maze = [];
let n = 41;
let b = 8;
let blockSize = 16;
let pb = 12;
let wb = blockSize - pb;
let wh = 8;

canvas.width = n * b;
canvas.height = n * b;

let w = canvas.width;
let h = canvas.height;

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

function boutaoshi() {
    maze = [];

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
}

function anahori() {
    maze = [];

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (j === 0 || i === 0 || j === n - 1 || i === n - 1) {
                maze.push(0);
            } else {
                maze.push(1);
            }
        }
    }

    const path = [];

    let x = (Math.random() * (n / 2 ^ 0) ^ 0) * 2 + 1;
    let y = (Math.random() * (n / 2 ^ 0) ^ 0) * 2 + 1;

    let k = y * n + x;
    maze[k] = 0;

    while (true) {
        while (true) {

            let dir = [];

            for (let i = 0; i < 4; i++) {
                let d = dir4(i);
                if (maze[k + d] === 1 && maze[k + d * 2] === 1) {
                    dir.push(d);
                }
            }

            if (dir.length === 0) {
                break;
            }
            let r = Math.random() * dir.length ^ 0;
            maze[k + dir[r]] = 0;
            maze[k + dir[r] * 2] = 0;
            k = k + dir[r] * 2;

            path.push(k);
        }

        if (path.length === 0) {
            break;
        }

        let p = Math.random() * path.length ^ 0;
        k = path[p];
        path[p] = path[path.length - 1];
        path.pop();
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (j === 0 || i === 0 || j === n - 1 || i === n - 1) {
                maze[i * n + j] = 1;
            }
        }
    }
}

function kabenobashi() {
    maze = [];

    const wall = [];

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (j === 0 || i === 0 || j === n - 1 || i === n - 1) {
                maze.push(1);

                if (i % 2 === 0 && j % 2 === 0) {
                    wall.push(i * n + j);
                }
            } else {
                maze.push(0);
            }
        }
    }

    for (let i = 0; i < wall.length; i++) {
        let p = Math.random() * wall.length ^ 0;
        let t = wall[p];
        wall[p] = wall[i];
        wall[i] = t;
    }

    let k = wall.pop();

    while (true) {
        while (true) {

            let dir = [];

            for (let i = 0; i < 4; i++) {
                let d = dir4(i);
                if (maze[k + d] === 0 && maze[k + d * 2] === 0) {
                    dir.push(d);
                }
            }

            if (dir.length === 0) {
                break;
            }
            let r = Math.random() * dir.length ^ 0;
            maze[k + dir[r]] = 1;
            maze[k + dir[r] * 2] = 1;
            k = k + dir[r] * 2;
            wall.unshift(k);
        }

        if (wall.length === 0) {
            break;
        }

        k = wall.pop();
    }
}

function render() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, w, h);

    let x = 0;
    let y = 0;

    ctx.fillStyle = '#DDD';
    y = 0;
    for (let i = 0; i < n - 1; i++) {
        let yb = i % 2 === 0 ? wb : pb;
        if (i % 2 === 0) {
            x = 0;
            for (let j = 0; j < n; j++) {
                let xb = j % 2 === 0 ? wb : pb;
                let k = i * n + j;
                if (maze[k] === 1) {
                    ctx.fillRect(x, y, xb, yb + wh);
                }
                x += xb;
            }
        }
        y += yb;
    }

    ctx.fillStyle = '#000';
    y = 0;
    for (let i = 0; i < n; i++) {
        let yb = i % 2 === 0 ? wb : pb;
        x = 0;
        for (let j = 0; j < n; j++) {
            let xb = j % 2 === 0 ? wb : pb;
            let k = i * n + j;
            if (maze[k] === 1) {
                ctx.fillRect(x, y, xb, yb);
            }
            x += xb;
        }
        y += yb;
    }
}

function generate(i) {
    switch (i) {
        case 0:
            boutaoshi();
            break;
        case 1:
            anahori();
            break;
        case 2:
            kabenobashi();
            break;
    }
}

generate(0);
render();

let selected = 0;
const sizeElement = document.getElementById('size');
const sizeValues = sizeElement.options;

document.getElementById('generate').addEventListener('click', e => {
    n = parseInt(sizeValues[sizeElement.selectedIndex].value);
    w = canvas.width = n * b;
    h = canvas.height = n * b;

    generate(selected);
    render();
});

const radio = createRadio(['boutaoshi', 'anahori', 'kabenobashi'], (v, id, i) => {
    selected = i;
    generate(i);
    render();
});
document.body.appendChild(radio);

// document.body.appendChild(createSlider('block', 1, v => {
//     let t = (v * 14 ^ 0) + 2;
//     if (t === blockSize) {
//         return;
//     }
//     let r = blockSize / pb;
//     blockSize = t;
//     pb = blockSize * r ^ 0;
//     wb = blockSize - pb;
//     render();
// }));

document.body.appendChild(createSlider('tickness', 0.5, v => {
    let t = blockSize * v ^ 0;
    if (t === pb) {
        return;
    }
    pb = t;
    wb = blockSize - pb;
    render();
    console.log('t');
}));

document.body.appendChild(createSlider('kabe', 0.5, v => {
    let t = blockSize * v ^ 0;
    if (t === wh) {
        return;
    }
    wh = t;
    render();
}));