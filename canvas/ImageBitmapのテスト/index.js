let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width,
    h = canvas.height;
    
let image = new Image();
let sprite = [];
image.onload = () => {
    createImageBitmap(image, 0, 0, 32, 32).then((img) => {
        sprite[0] = img;
    });
    createImageBitmap(image, 32, 0, 32, 32).then((img) => {
    sprite[1] = img;
    });
    createImageBitmap(image, 64, 0, 32, 32).then((img) => {
        sprite[2] = img;
    });
    createImageBitmap(image, 96, 0, 32, 32).then((img) => {
        sprite[3] = img;
    });
};
    image.src = "http://jsrun.it/assets/C/0/W/d/C0WdX.png";
    
function drawImage() {
    console.time('Draw Image');
    ctx.clearRect(0, 0, w, h);
    for(let i = 0; i < 5000; i++) {
        let x = (Math.random() * w ^ 0) - 16,
        y = (Math.random() * h ^ 0) - 16,
        f = Math.random() * 4 ^ 0;
        ctx.drawImage(image, f * 32, 0, 32, 32, x, y, 32, 32);
    }
    console.timeEnd('Draw Image');
}
        
function drawImageBitmap() {
    console.time('Draw ImageBitmap');
    ctx.clearRect(0, 0, w, h);
    for(let i = 0; i < 5000; i++) {
        let x = (Math.random() * w ^ 0) - 16,
        y = (Math.random() * h ^ 0) - 16,
        f = Math.random() * 4 ^ 0;
        ctx.drawImage(sprite[f], x, y);
    }
    console.timeEnd('Draw ImageBitmap');
}
        
document.getElementById('button0').addEventListener('click', drawImage);
document.getElementById('button1').addEventListener('click', drawImageBitmap);