var canvas = document.getElementById('world'),
    ctx = canvas.getContext('2d'),
    img = new Image(),
    w = canvas.width,
    h = canvas.height,
    table = new Array(w * h);

img.onload = function() {
    ctx.drawImage(img, 0, 0);
    play();
};
img.src = 'sea.jpg';

for(var i = 0, l = table.length; i < l; i++) {
    table[i] = i;
}

for(var i = 0, l = table.length; i < l; i++) {
    var j = Math.random() * l ^ 0,
        t = table[i];
    table[i] = table[j];
    table[j] = t;
}

function play() {
    var render = function() {
        ctx.fillStyle = 'black';
        ctx.fillRect(table[index] % w, table[index] / h ^ 0, 1, 1);
    };
    var index = 0,
        count = 200;
    
    var timer = setInterval(function() {
        for(var i = 0; i < count && index < table.length; i++) {
        	render();
            index++;
        }
        
        count += 10;
        
        if(index >= table.length) {
           clearInterval(timer); 
        }
        
    }, 1000 / 30);
}