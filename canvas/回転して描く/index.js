(function() {
    'use strict';
    
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width,
        h = canvas.height;
    
    let px = 0,
        py = 0,
        rect,
        rot = 32,
        down = false,
        bgcolor = '#FFF';
    
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = 'rgba(250, 100, 0, 0.4)';
    
    document.getElementById('r32').className = 'selected';

    function mousemove(e) {
        if(down) {
            let x = e.pageX - rect.left + 0.5,
                y = e.pageY - rect.top + 0.5;
            
            render(x, y, px, py);
            
            px = x;
            py = y;
        }
    }
    
    function mouseup(e) {
        if(down) {
            down = false;
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        }
    }
    
    function mousedown(e) {
        rect = e.target.getBoundingClientRect();
        px = e.pageX - rect.left + 0.5;
        py = e.pageY - rect.top + 0.5;
        down = true;
        
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    }
    
    function setRot(e, r) {
        rot = r;
        document.querySelector('.selected').className = '';
        e.target.className = 'selected';
    }

    canvas.addEventListener('mousedown', mousedown);

    document.getElementById('reset').addEventListener('click', () => {
        ctx.fillStyle = bgcolor;
        ctx.fillRect(0, 0, w, h);
    });
    document.getElementById('r64').addEventListener('click', (e) => {
        setRot(e, 64);
    });
    document.getElementById('r32').addEventListener('click', (e) => {
        setRot(e, 32);
    });
    document.getElementById('r16').addEventListener('click', (e) => {
        setRot(e, 16);
    });
    document.getElementById('r8').addEventListener('click', (e) => {
        setRot(e, 8);
    });
    document.getElementById('r3').addEventListener('click', (e) => {
        setRot(e, 3);
    });
    document.getElementById('bgblack').addEventListener('click', () => {
        bgcolor = '#000';
        ctx.fillStyle = bgcolor;
        ctx.fillRect(0, 0, w, h);
    });
    document.getElementById('bgwhite').addEventListener('click', () => {
        bgcolor = '#FFF';
        ctx.fillStyle = bgcolor;
        ctx.fillRect(0, 0, w, h);
    });
    function render(x, y, px, py) {
        
        let r = Math.PI * 2.0 / rot,
            c = Math.cos(r),
            s = Math.sin(r),
            tx = (w + h * s - w * c) * 0.5,
            ty = (h - w * s - h * c) * 0.5;
        
        for(let i = 0; i < rot; i++) {
            ctx.transform(c, s, -s, c, tx, ty);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
            
        }
        ctx.resetTransform();
    }
})();