(function() {
     var canvas = $('<canvas>').get(0),
         gl = canvas.getContext('experimental-webgl'),
         td = $('td'),
         p = 0;
    
    function printPrecision(s, t) {
        var p = gl.getShaderPrecisionFormat(s, t);
        return '' + p.precision + 'bit (' + p.rangeMin + ' - ' + p.rangeMax + ')';
    }
    
    $(td[p++]).text(printPrecision(gl.VERTEX_SHADER, gl.LOW_FLOAT));
    $(td[p++]).text(printPrecision(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT));
    $(td[p++]).text(printPrecision(gl.VERTEX_SHADER, gl.HIGH_FLOAT));
    
    $(td[p++]).text(printPrecision(gl.VERTEX_SHADER, gl.LOW_INT));
    $(td[p++]).text(printPrecision(gl.VERTEX_SHADER, gl.MEDIUM_INT));
    $(td[p++]).text(printPrecision(gl.VERTEX_SHADER, gl.HIGH_INT));
    
    $(td[p++]).text(printPrecision(gl.FRAGMENT_SHADER, gl.LOW_FLOAT));
    $(td[p++]).text(printPrecision(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT));
    $(td[p++]).text(printPrecision(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT));
    
    $(td[p++]).text(printPrecision(gl.FRAGMENT_SHADER, gl.LOW_INT));
    $(td[p++]).text(printPrecision(gl.FRAGMENT_SHADER, gl.MEDIUM_INT));
    $(td[p++]).text(printPrecision(gl.FRAGMENT_SHADER, gl.HIGH_INT));
})();