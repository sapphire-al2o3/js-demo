var gl = initContext('canvas'),
    program = initShader(gl, 'shader-fs', 'shader-vs');

var video = document.getElementById('video');

var timer = 0;

video.addEventListener('canplaythrough', function() {
    video.play();
    gl.canvas.width = video.videoWidth;
    gl.canvas.height = video.videoHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    timer = setInterval(render, 33);
}, true);

video.addEventListener('ended', function() {
    clearInterval(timer);
}, true);

// 画面をクリックしたらポーズ
gl.canvas.addEventListener('click', function() {
    if(video.paused) {
        video.play();
        timer = setInterval(render, 33);
    } else {
        video.pause();
        clearInterval(timer);
    }
});

var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

var buffer = new Float32Array([
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0
]);

gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

var loc = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

// テクスチャ作る
var tex = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
// NPOTのテクスチャを表示するための設定
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

var offsetLocation = gl.getUniformLocation(program, 'offset');
gl.uniform2f(offsetLocation, 0.01, 0.01);

// レンダリング
function render() {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.flush();
}
