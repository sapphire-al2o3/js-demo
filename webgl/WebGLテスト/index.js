"use strict";
var canvas,
    ctx,
    gl,
    program,
    vtx,
    texcoord,
    tex,
    sl;

window.onload = ready;

function slider(id, w) {
  var elm = document.getElementById(id);
  elm.onmousedown = function(e) {
    var cur = this.firstChild,
      t = document,
      r = elm.getBoundingClientRect(),
      x = e.pageX - r.left,
      y = e.pageY - r.top,
      l = r.left;
    cur.style.left = x - 5 + 'px';
    
    elm.value = x / w;
    
    document.onselectstart = function() { return false; };
    
    t.onmousemove = function(e) {
      var x = e.clientX - l;
      if(x < 0) x = 0;
      if(x > w) x = w;
      cur.style.left = x - 5 + 'px';
      elm.value = x / w;
      render();
    };
    t.onmouseup = function(e) {
      t.onmousemove = null;
      t.onmouseup = null;
      t.onselectstart = null;
    };
    
    render();
  };
  elm.value = 0;
  return elm;
}

function ready() {
  sl = slider('slider', 240);
  gl = document.getElementById('canvas').getContext('experimental-webgl');
  gl.viewportWidth = gl.canvas.width;
  gl.viewportHeight = gl.canvas.height;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  initBuffer();
  initShader();
  initTexture();
  
  setTimeout(function() {
    render();
  }, 500);
}

function initBuffer() {
  vtx = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vtx);
  var vertices = [
    -1.0,  1.0, 0.0,
     1.0,  1.0, 0.0,
    -1.0, -1.0, 0.0,
     1.0, -1.0, 0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  var texcoords = [
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 0.0
  ];
  texcoord = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id),
      str = shaderScript.textContent,
      shader = null;
  
  if(shaderScript.type == 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if(shaderScript.type == 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  
  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function initTexture() {
  var img = document.getElementById('texture');
  tex = gl.createTexture();
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function initShader() {
  var fs = getShader(gl, 'shader-fs'),
      vs = getShader(gl, 'shader-vs');

  program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);
  
  
  program.vertex = {};
  program.vertex.position = gl.getAttribLocation(program, 'aVertexPosition');
  gl.enableVertexAttribArray(program.vertex.position);

  program.vertex.texcoord = gl.getAttribLocation(program, 'aTexCoord');
  gl.enableVertexAttribArray(program.vertex.texcoord);
  
  program.samplerUniform = gl.getUniformLocation(program, 'uSampler');
  program.blockUniform = gl.getUniformLocation(program, 'uBlock');
}

function render() {
  
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vtx);
  gl.vertexAttribPointer(program.vertex.position, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
  gl.vertexAttribPointer(program.vertex.texcoord, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(program.samplerUniform, 0);
  gl.uniform1f(program.blockUniform, sl.value * 400 + 1);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.flush();
}







