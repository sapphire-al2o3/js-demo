const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width;
let h = canvas.height;

let sizeW = 100;
let sizeH = 100;

const minSizeRoom = 32;
const minSplit = 0.4;
const maxSplit = 1 - minSplit;
const aspect = 1.2;
const s = 4;

const area = true;

function rand(min, max) {
    return Math.random() * (max - min + 1) + min ^ 0;
}

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}

ctx.fillStyle = area ? '#FFF' : '#000';
ctx.fillRect(0, 0, w, h);

let root = {};

function split(n, x, y, w, h) {

    if (n === 0) {
        if (area) {
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 1, y + 1, w - 1, h - 1);
        }
        return {x, y, w, h};
    }

    let dir = Math.random() * 2 ^ 0;

    if (w / h > aspect) {
        dir = 0;
    } else if (h / w > aspect) {
        dir = 1;
    }

    let node = {x, y, w, h, dir};

    if (dir === 0) {
        let p = rand(w * minSplit ^ 0, w * maxSplit ^ 0);
        node.left = split(n - 1, x, y, p, h);
        node.right = split(n - 1, x + p, y, w - p, h);
        return node;
    } else {
        let p = rand(h * minSplit ^ 0, h * maxSplit ^ 0);
        node.left = split(n - 1, x, y, w, p);
        node.right = split(n - 1, x, y + p, w, h - p);
        return node;
    }
}

root = split(3, 0, 0, w, h);

function room(node) {

    if (node.left && node.right) {
        room(node.left);
        room(node.right);
        return;
    }

    // let x = node.x + rand(10, node.w - 10);
    // let y = node.y + rand(10, node.h - 10);
    let w = rand(minSizeRoom, node.w - minSizeRoom);
    let h = rand(minSizeRoom, node.h - minSizeRoom);

    let x = (node.w - w) / 2 ^ 0;
    let y = (node.h - h) / 2 ^ 0;

    x += rand(-w, w);
    x = clamp(x, 10, node.w - w - 10);
    x += node.x;

    y += rand(-h, h);
    y = clamp(y, 10, node.h - h - 10);
    y += node.y;

    // console.log(w, h);
    ctx.fillStyle = '#F0F';
    ctx.fillRect(x, y, w, h);

    node.rect = {x, y, w, h};

    return;
}

room(root);

function getNearestNode(node, dir, v) {
    if (node.left && node.right) {
        let left = getNearestNode(node.left, dir, v);
        let right = getNearestNode(node.right, dir, v);

        if (dir === 0) {
            let d0 = Math.abs(left.rect.x - v);
            let d1 = Math.abs(right.rect.x - v);
            return d0 < d1 ? left : right;
        } else {
            let d0 = Math.abs(left.rect.y - v);
            let d1 = Math.abs(right.rect.y - v);
            return d0 < d1 ? left : right;
        }
    }
    return node;
}

function corridor(node, dir) {
    if (node.left && node.right) {
        if (node.dir === 0) {
            let p0 = corridor(node.left, 2);
            let p1 = corridor(node.right, 4);
            if (p0 && p1) {
                if (p0.y < p1.y) {
                    ctx.fillStyle = '#F0F';
                    ctx.fillRect(node.right.x - s / 2, p0.y, s, (p1.y - p0.y) + s);
                } else {
                    ctx.fillStyle = '#F0F';
                    ctx.fillRect(node.right.x - s / 2, p1.y, s, (p0.y - p1.y) + s);
                }
            }
        } else {
            let p0 = corridor(node.left, 1);
            let p1 = corridor(node.right, 3);
            if (p0 && p1) {
                if (p0.x < p1.x) {
                    ctx.fillStyle = '#F0F';
                    ctx.fillRect(p0.x, node.right.y - s / 2, (p1.x - p0.x) + s, s);
                } else {
                    ctx.fillStyle = '#F0F';
                    ctx.fillRect(p1.x, node.right.y - s / 2, (p0.x - p1.x) + s, s);
                }
            }
        }

        switch (dir) {
            case 1:
                node = getNearestNode(node, 1, node.y + node.h);
                break;
            case 2:
                node = getNearestNode(node, 0, node.x + node.w);
                break;
            case 3:
                node = getNearestNode(node, 1, node.y);
                break;
            case 4:
                node = getNearestNode(node, 0, node.x);
                break;
        }
    }

    let x = 0;
    let y = 0;

    switch (dir) {
        case 1:
            x = rand(s, node.rect.w - s);
            x += node.rect.x;
            y = node.rect.y + node.rect.h;
            ctx.fillStyle = '#F0F';
            ctx.fillRect(x, y, s, node.y + node.h - y);
            break;
        case 2:
            y = rand(s, node.rect.h - s);
            y += node.rect.y;
            x = node.rect.x + node.rect.w;
            ctx.fillStyle = '#F0F';
            ctx.fillRect(x, y, node.x + node.w - x, s);
            break;
        case 3:
            x = rand(s, node.rect.w - s);
            x += node.rect.x;
            ctx.fillStyle = '#F0F';
            ctx.fillRect(x, node.y, s, node.rect.y - node.y);
            break;
        case 4:
            y = rand(s, node.rect.h - s);
            y += node.rect.y;
            ctx.fillStyle = '#F0F';
            ctx.fillRect(node.x, y, node.rect.x - node.x, s);
            break;
    }

    return {x, y};
}

corridor(root, 0);

function render() {
}

render();

function createButton(id, callback) {
    const wrapper = document.createElement('div'),
        button = document.createElement('button');
    
    wrapper.classList.add('button');
    button.setAttribute('for', id);
    button.textContent = id;button

    button.addEventListener('click', e => {
        if(callback) {
            callback();
        }
    }, false);
    
    wrapper.appendChild(button);
    
    return wrapper;
}

document.body.appendChild(createButton('generate', () => {
    ctx.fillStyle = area ? '#FFF' : '#000';
    ctx.fillRect(0, 0, w, h);
    
    root = split(3, 0, 0, w, h);
    room(root);
    corridor(root, 0);
    render();
}, false));
