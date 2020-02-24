
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

function plot2D(ctx, f, w, h, itr) {
    itr = itr === undefined ? 100 : itr;
    ctx.beginPath();
    let x = -1;
    let y = f(x);
    ctx.moveTo(x * w, h - y * h);
    
    for (var i = 1 - itr; i <= itr; i++) {
        x = i / itr;
        y = f(x);
        ctx.lineTo(x * w, h - y * h);
    }
    ctx.stroke();
    console.log(f(1)*180/Math.PI);
}

let plot = [true, true, true, true];
let colors = [
    'rgba(50,50,50,0.5)',
    'rgba(0,100,0,0.5)',
    'rgba(90,0,0,0.5)',
    'rgba(0,0,100,0.5)'
];
let func = [
    atan,
    atan2,
    atan4,
    atan6
];

function render() {
    ctx.clearRect(0, 0, w, h);
    for(let i = 0; i < plot.length; i++) {
        if(plot[i]) {
            ctx.strokeStyle = colors[i];
            plot2D(ctx, func[i], w, h, 100);
        }
    }
}

document.body.appendChild(createCheckbox('atan', v => {
    plot[0] = v;
    render();
}));

document.body.appendChild(createCheckbox('0.994949x - 0.2870606x^3 + 0.07803717x^5', v => {
    plot[1] = v;
    render();
}));

document.body.appendChild(createCheckbox('(12x^2 + 45)x / (27x^2 + 45)', v => {
    plot[2] = v;
    render();
}));

document.body.appendChild(createCheckbox('(69 * x * x + 5 * x + 286) / (3 * x * x + 5) * x', v => {
    plot[3] = v;
    render();
}));

render();
