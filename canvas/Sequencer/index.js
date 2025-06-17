(function run() {
    'use strict';
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const box = document.getElementById("box");
    
    const text = run.toString();
    

    ctx.strokeStyle = '#000';
    

    // nフレーム待つ
    function* waitFrame(n) {
        for (; n; n--) {
            yield n;
        }
    }

    function* waitTime(t) {
        let start = time;
        while (t > time - start) {
            yield;
        }
    }
    
    // ジェネレータを作る
    const i = function*() {
        yield* waitTime(100);
        
        // for (let k = 0; k < text.length; k++) {
        //     box.textContent += text[k];
        //     yield* waitTime(50);
        // }

        for (let i = 0; i < 20; i++) {
            let x = i * 20 + 0.5;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 400);
            ctx.stroke();
            yield* waitTime(100);
        }
        for (let i = 0; i < 20; i++) {
            let y = i * 20 + 0.5;
            ctx.moveTo(0, y);
            ctx.lineTo(400, y);
            ctx.stroke();
            yield* waitTime(100);
        }

        ctx.fillStyle = '#844';
        for (let j = 0; j < 20; j++) {
            let y = j * 20 + 0.5;
            for (let i = 0; i < 20; i++) {
                let x = i * 20 + 0.5;
                ctx.fillRect(x, y, 20, 20);
                yield* waitTime(16);
            }
        }
    }();
    
    let elapsed = 0,
        time = Date.now(),
        lastTime = 0;

    const update = (timestamp) => {
        let now = Date.now(),
            delta = now - time;
        time = now;
        let d = timestamp - lastTime;
        lastTime = timestamp;
        elapsed += delta;
        if (i.next().done) {
            
        } else {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);

})();
