const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width;
let h = canvas.height;

const minSize = 32;
const minSplit = 0.4;
const maxSplit = 1 - minSplit;
const aspect = 1.2;

function rand(min, max) {
    return Math.random() * (max - min + 1) + min ^ 0;
}

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}

let root = {};

function split(n, x, y, w, h) {

    if (n === 0) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 1, y + 1, w - 1, h - 1);
        return {x, y, w, h};
    }

    let dir = Math.random() * 2 ^ 0;

    if (w / h > aspect) {
        dir = 0;
    } else if (h / w > aspect) {
        dir = 1;
    }

    let node = {x, y, w, h};

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
    let w = rand(minSize, node.w - minSize);
    let h = rand(minSize, node.h - minSize);

    let x = (node.w - w) / 2 ^ 0;
    let y = (node.h - h) / 2 ^ 0;

    x += rand(-w, w);
    x = clamp(x, 10, node.w - w - 10);
    x += node.x;

    y += rand(-h, h);
    y = clamp(y, 10, node.h - h - 10);
    y += node.y;

    console.log(w, h);
    ctx.fillStyle = '#F0F';
    ctx.fillRect(x, y, w, h);
    return;
}

room(root);

function corridor(node) {
    if (node.left && node.right) {
        room(node.left);
        room(node.right);
        return;
    }

    return;
}

function render() {
    ctx.fillStyle = '#FFF';
    // ctx.fillRect(0, 0, w, h);


}

render();
