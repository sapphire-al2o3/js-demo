(function run() {
    'use strict';
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const box = document.getElementById("box");
    
    const text = run.toString();
    

    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#844';

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

        for (let i = 0; i < 20; i++) {
            let x = i * 20 + 0.5;
            ctx.fillRect(x, 0, 20, 20);
            yield* waitTime(200);
        }
    }();
    
    let elapsed = 0,
        time = Date.now(),
        lastTime = time;

    const update = () => {
        let now = Date.now(),
            delta = now - time;
        time = now;
        elapsed += delta;
        if (i.next().done) {
            
        } else {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);

})();
