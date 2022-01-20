const count = document.getElementById('count');

let down = false;
let n = 0;

document.body.addEventListener('keydown', e => {
    
    if (!down) {
        n++;
        count.textContent = n;
    }
    down = true;
});

document.body.addEventListener('keyup', e => {
    down = false;
});
