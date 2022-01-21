const count = document.getElementById('count');

let down = false;
let n = 0;
let delay = 0.5;
let interval = 0.05;
let time = 0;
let repeat = false;

function countup() {
    n++;
    count.textContent = n;
}

document.body.addEventListener('keydown', e => {
    
    if (!down) {
        time = Date.now();
        repeat = false;
        countup();
    } else {
        const t = Date.now() - time;
        if (repeat && t / 1000 > interval) {
            countup();
            time = Date.now();
        } else if (!repeat && t / 1000 > delay) {
            countup();
            time = Date.now();
            repeat = true;
        }
        
    }
    down = true;
});

document.body.addEventListener('keyup', e => {
    down = false;
    repeat = false;
});
