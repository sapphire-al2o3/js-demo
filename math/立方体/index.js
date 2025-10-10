const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let size = new Vector3(1, 1, 1);

let proj = Matrix4.perspective(degToRad(30), 1, 0.1, 100),
    target = new Vector3(0, 0, 0),
    position = new Vector3(3, 4, 5),
    view = Matrix4.lookAt(position, target, Vector3.up),
    screen = Matrix4.viewport(canvas.width, canvas.height, 0.1, 100.0),
    upMtx = screen.mul(proj),
    upv = upMtx.mul(view);

canvas.onmousewheel = (e) => {
    let s = e.wheelDelta > 0 ? 1.0 / 1.1 : 1.1;
    position = position.mul(s);
    view = Matrix4.lookAt(position, target, Vector3.up);
    upv = upMtx.mul(view);
    render(size.x, size.y, size.z);
};

canvas.onmousedown = (e) => {
    let x = e.clientX,
        y = e.clientY;
    canvas.onmousemove = (e) => {
        // if(e.button === 0) {
            let dx = x - e.clientX,
                dy = y - e.clientY,
                pos = position.rotate(new Vector3(0, 1, 0), dx * 0.01),
                n = pos.cross(Vector3.up).normalize();
            position = pos.rotate(n, -dy * 0.01);
            view = Matrix4.lookAt(position, target, Vector3.up);
            upv = upMtx.mul(view);
            render(size.x, size.y, size.z);
            x = e.clientX;
            y = e.clientY;
        // }
    };
        
    canvas.onmouseup = (e) => {
        canvas.oumouseup = null;
        canvas.onmousemove = null;
        canvas.onmouseout = null;
    };
    canvas.onmouseout = (e) => {
        canvas.oumouseup = null;
        canvas.onmousemove = null;
        canvas.onmouseout = null;
    };
};
	
canvas.oncontextmenu = (e) => {
	e.preventDefault();
};

slider('x-size', 240, (e) => {
    size.x = e + 0.01;
    render(size.x, size.y, size.z);
});
slider('y-size', 240, (e) => {
    size.y = e + 0.01;
    render(size.x, size.y, size.z);
});
slider('z-size', 240, (e) => {
    size.z = e + 0.01;
    render(size.x, size.y, size.z);
});

ctx.lineWidth = 0.5;
ctx.fillStyle = '#000';
ctx.strokeStyle = "#FFF";
ctx.clearRect(0, 0, 400, 400);
render(size.x, size.y, size.z);

function render(x, y, z) {
    ctx.clearRect(0, 0, 400, 400);
    
    let p = [
        new Vector3(-x,  y, -z),
        new Vector3( x,  y, -z),
        new Vector3( x,  y,  z),
        new Vector3(-x,  y,  z),
        new Vector3(-x, -y, -z),
        new Vector3( x, -y, -z),
        new Vector3( x, -y,  z),
        new Vector3(-x, -y,  z)
    ];
  
    p = p.map(e => upv.apply(e));
    
    line(p[0], p[1]);
    line(p[1], p[2]);
    line(p[2], p[3]);
    line(p[3], p[0]);

    line(p[4], p[5]);
    line(p[5], p[6]);
    line(p[6], p[7]);
    line(p[7], p[4]);

    line(p[0], p[4]);
    line(p[1], p[5]);
    line(p[2], p[6]);
    line(p[3], p[7]);   
}


function line(v0, v1) {
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.stroke();
}

function slider(id, w, func) {
    let elm = document.getElementById(id);
    elm.onmousedown = (e) => {
        let cur = elm.firstChild,
            t = document,
            r = elm.getBoundingClientRect(),
            x = e.pageX - r.left,
            y = e.pageY - r.top,
            l = r.left;
        cur.style.left = x - 5 + 'px';
        
        elm.value = x / w;
        
        t.onselectstart = () => false;
        
        t.onmousemove = (e) => {
            let x = e.clientX - l;
            if (x < 0) x = 0;
            if (x > w) x = w;
            cur.style.left = x - 5 + 'px';
            elm.value = x / w;
            if (func) func(elm.value);
        };
        t.onmouseup = (e) => {
            t.onmousemove = null;
            t.onmouseup = null;
            t.onselectstart = null;
        };
        
        if (func) func(elm.value);
    };
    elm.value = 0;
    return elm;
}