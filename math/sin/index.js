
function sin(x) {
    return Math.sin(x);
}

// チェビシェフ多項式近似
function sin2(x) {
    let u = x / (2 * Math.PI);
    let t = u - Math.round(u);
    let d = 8 * t - 16 * t * Math.abs(t);
    return 0.225 * (d * Math.abs(d) - d) + d;
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
    let y = f(x * 2 * Math.PI);
    ctx.moveTo(x * w, (h - y * h) * 0.5);
    
    for (let i = 1 - itr; i <= itr; i++) {
        x = i / itr;
        y = f(x * 2 * Math.PI);
        ctx.lineTo(x * w, (h - y * h) * 0.5);
    }
    ctx.stroke();
    console.log(f(1)*180/Math.PI);
}

let plot = [true, true];
let colors = [
    'rgba(50,50,50,0.5)',
    'rgba(0,100,0,0.5)',
    'rgba(90,0,0,0.5)',
    'rgba(0,0,100,0.5)'
];
let func = [
    sin,
    sin2,
];

function render() {
    ctx.clearRect(0, 0, w, h);
    for(let i = 0; i < plot.length; i++) {
        if(plot[i]) {
            ctx.strokeStyle = colors[i];
            plot2D(ctx, func[i], w, h, 200);
        }
    }
}

const check1 = createCheckbox('sin', v => {
    plot[0] = v;
    render();
});
document.body.appendChild(check1);
check1.querySelector('label').textContent = 'Math.sin';
check1.querySelector('input').checked = true;

const check2 = createCheckbox('sin2', v => {
    plot[1] = v;
    render();
});

document.body.appendChild(check2);
check2.querySelector('label').textContent = 'sin(近似)';
check2.querySelector('input').checked = true;

render();
