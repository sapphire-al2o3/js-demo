const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let size = new Vector3(1.5, 1, 1);

let proj = Matrix4.perspective(degToRad(30), 1, 0.1, 100),
    target = new Vector3(0, 0, 0),
    position = new Vector3(3, 4, 5),
    view = Matrix4.lookAt(position, target, Vector3.up),
    screen = Matrix4.viewport(canvas.width, canvas.height, 0.1, 100.0),
    upMtx = screen.mul(proj),
    upv = upMtx.mul(view);

let rayPosition = new Vector3(0, 0, 5),
    rayDirection = new Vector3(0, 0, -10),
    planePosition = new Vector3(0, 0, -1),
    planeNormal = new Vector3(0, 0, -1);

canvas.onmousewheel = (e) => {
    let s = e.wheelDelta > 0 ? 1.0 / 1.1 : 1.1;
    position = position.mul(s);
    view = Matrix4.lookAt(position, target, Vector3.up);
    upv = upMtx.mul(view);
    // render();
};

canvas.onmousedown = (e) => {
    let x = e.clientX,
        y = e.clientY;
    canvas.onmousemove = (e) => {
        let dx = x - e.clientX,
            dy = y - e.clientY,
            pos = position.rotate(new Vector3(0, 1, 0), dx * 0.01),
            n = pos.cross(Vector3.up).normalize();
        position = pos.rotate(n, -dy * 0.01);
        view = Matrix4.lookAt(position, target, Vector3.up);
        upv = upMtx.mul(view);
        // render();
        x = e.clientX;
        y = e.clientY;
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

ctx.lineWidth = 0.5;
ctx.fillStyle = '#000';
ctx.strokeStyle = "#FFF";
ctx.clearRect(0, 0, 400, 400);
render();

function render(x, y, z) {
    ctx.clearRect(0, 0, 400, 400);
    
    let p = [
        new Vector3(-size.x,  size.y, -size.z),
        new Vector3( size.x,  size.y, -size.z),
        new Vector3(-size.x, -size.y, -size.z),
        new Vector3( size.x, -size.y, -size.z),

        rayPosition,
        rayPosition.add(rayDirection),
    ];

    let c = intersectPlaneToRay(planePosition, planeNormal, rayDirection, rayPosition);
    c = upv.apply(c);
  
    p = p.map(e => upv.apply(e));
    
    line(p[0], p[1]);
    line(p[2], p[3]);
    line(p[0], p[2]);
    line(p[1], p[3]);

    line(p[4], p[5]);

    ctx.fillStyle = '#FFF';
    ctx.fillRect(c.x - 1, c.y - 1, 2, 2);
}

function line(v0, v1) {
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.stroke();
}

function intersectPlaneToRay(p, n, o, r) {
    return o.add(r.mul((p.dot(n) - n.dot(o)) / n.dot(r)));
}

let t = 0;
function update() {
    // rayDirection.x = Math.sin(t) * 0.4;
    // rayDirection.y = Math.cos(t) * 0.4;
    render();
    // t += 0.03;
    requestAnimationFrame(update);
}

update();
