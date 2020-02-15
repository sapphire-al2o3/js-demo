(function() {
    'use strict';
    
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');
    
    function Player() {
        this.x = 200;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.ground = false;
    }
    
    var keyState = [],
        prevKyeState = [],
        keyDowns = [],
        keyUps = [];
    
    function UpdateKey() {
        for(var k in keyState) {
            var change = keyState[k] ^ prevKyeState[k];
            keyDowns[k] = change & keyState[k];
            keyUps[k] = change & !keyState[k];
            prevKyeState[k] = keyState[k];
        }
    }
    
    document.addEventListener('keydown', function(e) {
        keyState[e.keyCode] = true;
        e.preventDefault();
    });
    
    document.addEventListener('keyup', function(e) {
        keyState[e.keyCode] = false;
        e.preventDefault();
    });
    
    var player = new Player(),
        jumpPower = 0;
    
    function jump0() {
        if(keyState[32]) {
            jumpPower++;
        }
        
        if(keyUps[32]) {
            if(jumpPower > 16) jumpPower = 16;
            if(player.ground) {
                player.vy = -4 - jumpPower;
                player.ground = false;
            }
            
            jumpPower = 0;
        }
    }
    
    function render() {
        UpdateKey();
        
        player.y += player.vy;
        if(player.y < 300) {
            player.vy += 1;
            
        } else {
            player.y = 300;
            player.vy = 0;
            player.ground = true;
        }
        
        jump0();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#AAA';
        ctx.moveTo(0, 300);
        ctx.lineTo(canvas.width, 300);
        ctx.stroke();
        
        ctx.fillStyle = '#39b939';
        ctx.fillRect(player.x - 4, player.y - 4, 8, 8);
    }
    
    setInterval(render, 1000 / 60);
    
})();
