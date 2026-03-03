const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 400, 400);


function hsva(h,s,v,a){var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;return 'rgba('+[[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0,a].join(',')+')';}

function draw() {
    ctx.clearRect(0, 0, 440, 400);
    /*
    for(var i = 0; i < 20; i++) {
        for(var j = 0; j < 20; j++) {
            //ctx.fillStyle = hsva(100, i / 20, j / 20, 1);
            ctx.fillCircle(j * 20 + 8, i * 20 + 8, 8);
        }
    }
    */
    ctx.fillRect(0, 0, 400, 400);
}

function render(x, y) {
    let h = x / 400 * 360;
    let grad = ctx.createRadialGradient(x, y, 0, x, y, 200);
    grad.addColorStop(0, hsva(h, 1, 1, 1));
    grad.addColorStop(1, hsva(h, 0, 0, 1));
    ctx.fillStyle = grad;
    draw();
}

canvas.onmousemove = (e) => {
    const rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    render(x, y);
};

render(canvas.width / 2, canvas.height / 2);