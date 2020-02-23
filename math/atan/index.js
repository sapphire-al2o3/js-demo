
function atan(x) {
    return Math.atan(x);
}

// チェビシェフ多項式近似
function atan2(x) {
    // return 0.9705627 * x - 0.1895141 * x ** 3;
    return 0.994949 * x - 0.2870606 * x ** 3 + 0.07803717 * x ** 5;
}

function atan3(x) {
    return x - x ** 3 / 3 + x ** 5 / 5;
}

function atan4(x) {
    return (12 * x ** 2 + 45) * x / (27 * x ** 2 + 45);
}

function atan5(x) {
    return (8.2975*x*x*x*x - 20.114*x*x*x + 0.5812*x*x + 57.412*x)*Math.PI/180;
}

function atan6(x) {
    return (69 * x * x + 5 * x + 286) / (3 * x * x + 5) * x * Math.PI / 180;
}

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

ctx.lineWidth = 1.5;
ctx.strokeStyle = 'rgba(50,50,50,0.5)';

function plot2D(ctx, f, w, h, itr) {
    itr = itr === undefined ? 80 : itr;
    ctx.beginPath();
    let x = 0;
    let y = f(0);
    ctx.moveTo(x * w, h - y * h);
    
    for (var i = 1; i <= itr; i++) {
        x = i / itr;
        y = f(i / itr);
        ctx.lineTo(x * w, h - y * h);
    }
    ctx.stroke();
    console.log(f(1)*180/Math.PI);
}

plot2D(ctx, atan, w, h, 100);
ctx.strokeStyle = 'rgba(0,100,0,0.5)';
// plot2D(ctx, atan4, w, h, 100);
ctx.strokeStyle = 'rgba(90,0,0,0.5)';
plot2D(ctx, atan6, w, h, 100);
