(function() {
    function getGlConstant(param) {
        for(var e in WebGLRenderingContext) {
            if(WebGLRenderingContext[e] === param) {
                return e;
            }
        }
        return param;
    }
    
    function getColor(param) {
        return Array.prototype.join.call(param, ','); 
    }
    
    
    var canvas = $('#canvas').get(0),
        gl = canvas.getContext('experimental-webgl'),
        tex = gl.createTexture(),
        td = $('td'),
        p = 0,
        attr = gl.getContextAttributes();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    $(td[p++]).text(gl.getParameter(gl.BLEND));
    $(td[p++]).text(getGlConstant(gl.getParameter(gl.BLEND_EQUATION)));
    $(td[p++]).text(getColor(gl.getParameter(gl.BLEND_COLOR)));
    $(td[p++]).text(getColor(gl.getParameter(gl.COLOR_CLEAR_VALUE)));
    $(td[p++]).text(gl.getParameter(gl.CULL_FACE));
    $(td[p++]).text(getGlConstant(gl.getParameter(gl.CULL_FACE_MODE)));
    $(td[p++]).text(gl.getParameter(gl.DEPTH_CLEAR_VALUE));
    $(td[p++]).text(gl.getParameter(gl.DEPTH_TEST));
    $(td[p++]).text(getGlConstant(gl.getParameter(gl.DEPTH_FUNC)));
    $(td[p++]).text(getGlConstant(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S)));
    $(td[p++]).text(getGlConstant(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T)));
    $(td[p++]).text(getGlConstant(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER)));
    $(td[p++]).text(getGlConstant(gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER)));
    $(td[p++]).text(gl.getParameter(gl.DITHER));
    $(td[p++]).text(gl.getParameter(gl.SCISSOR_TEST));
    $(td[p++]).text(gl.getParameter(gl.STENCIL_TEST));
    $(td[p++]).text(getColor(gl.getParameter(gl.VIEWPORT)));
    $(td[p++]).text(getGlConstant(gl.getParameter(gl.ACTIVE_TEXTURE)));
    $(td[p++]).text(attr.antialias);
    $(td[p++]).text(attr.preserveDrawingBuffer);
    $(td[p++]).text(getColor(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
    $(td[p++]).text(getColor(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
    $(td[p++]).text(gl.getParameter(gl.MAX_TEXTURE_SIZE));
})();