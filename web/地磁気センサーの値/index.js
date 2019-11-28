(function() {
    'use strict';
    
    window.addEventListener("deviceorientation", function(e) {
        document.getElementById('orientation').textContent = [e.alpha | 0, e.beta | 0, e.gamma | 0];
    });
    
    window.addEventListener('devicemotion', function(e) {
        var acc = e.acceleration;
        document.getElementById('motion').textContent = [acc.x.toFixed(3), acc.y.toFixed(3), acc.y.toFixed(3)];
    });
        
})();