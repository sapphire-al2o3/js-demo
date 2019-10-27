'use strict';

function rgba(r, g, b, a) {
    return 'rgba(' + [r, g, b, a].join(',') + ')';
}

function log(e, r, g, b, a) {
    document.getElementById(e).textContent = rgba(r, g, b, a);
}

(function() {
    var ctx = document.getElementById('canvas0').getContext('2d');
    ctx.fillStyle = rgba(255, 0, 0, 1.0);
    ctx.fillRect(0, 0, 48, 48);
    
    var data = ctx.getImageData(0, 0, 48, 48).data;
    log('result0', data[0], data[1], data[2], data[3]);
})();

(function() {
    var ctx = document.getElementById('canvas1').getContext('2d');
    ctx.fillStyle = rgba(255, 0, 0, 0.5);
    ctx.fillRect(0, 0, 48, 48);
    
    var data = ctx.getImageData(0, 0, 48, 48).data;
    log('result1', data[0], data[1], data[2], data[3]);
})();

(function() {
    var ctx = document.getElementById('canvas2').getContext('2d');
    ctx.fillStyle = rgba(255, 0, 0, 0.005);
    ctx.fillRect(0, 0, 48, 48);
    
    var data = ctx.getImageData(0, 0, 48, 48).data;
    log('result2', data[0], data[1], data[2], data[3]);
})();


(function() {
    var ctx = document.getElementById('canvas3').getContext('2d');
    ctx.fillStyle = rgba(255, 0, 0, 0.0);
    ctx.fillRect(0, 0, 48, 48);
    
    var data = ctx.getImageData(0, 0, 48, 48).data;
    log('result3', data[0], data[1], data[2], data[3]);
})();
