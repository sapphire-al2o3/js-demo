var canvas,
    ctx,
    gl,
    program,
    stream = {},
    width,
    height,
    blockSlider,
    check,
    mouse = new Float32Array([0, 0]),
    translate = new Float32Array([0, 0]),
    scale = 1.0,
    colorTable = new Uint8Array(256 * 4),
    coord = {},
    isMove = false;

(function() {
    function hsv(h,s,v){
        var f=h/60,i=f^0,m=v-v*s,k=v*s*(f-i),p=v-k,q=k+m;
        return [[v,p,m,m,q,v][i]*255^0,[q,v,v,p,m,m][i]*255^0,[m,m,q,v,v,p][i]*255^0];
    }
    function rgb(r, g, b) { return 'rgb(' + r + ',' + g + ',' + b + ')'; }
    for(var i = 0; i < 256; i++) {
  var t = i / 255,
      c = hsv(t * 360, 1, 1);
  
  colorTable[i * 4] = c[0];
  colorTable[i * 4 + 1] = c[1];
  colorTable[i * 4 + 2] = c[2];
  colorTable[i * 4 + 3] = 255;
  
}
colorTable[255 * 4] = 0;
colorTable[255 * 4 + 1] = 0;
colorTable[255 * 4 + 2] = 0;
colorTable[255 * 4 + 3] = 255;

})();

var c0 = checkBox('size0'),
    c1 = checkBox('size1'),
    c2 = checkBox('size2');
c1.onclick();
c2.onclick();
draw();

function draw() {
  canvas = document.getElementById('canvas');
  width = canvas.width;
  height = canvas.height;
  
  canvas.onmousedown = function(e) {
    var r = e.target.getBoundingClientRect();
    mouse[0] = (e.clientX - r.left) / 200 - 1.0;
    mouse[1] = (e.clientY - r.top) / 200 - 1.0;
    zoom(0.1, mouse[0], -mouse[1]);
    render();
    e.preventDefault();
  };
  canvas.oncontextmenu = function(e) {
    e.preventDefault();
  };
  
  gl = canvas.getContext('experimental-webgl');
  gl.viewportWidth = gl.canvas.width;
  gl.viewportHeight = gl.canvas.height;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  
  gl.disable(gl.DEPTH_TEST);
  //gl.depthFunc(gl.LEQUAL);
  
  initBuffer();
  initShader();
  initTexture();
  console.time('draw');
  preRender();
  render();
  console.timeEnd('draw');
}

function checkBox(id, func) {
    var elm = document.getElementById(id),
		value = true;
	elm.onclick = function() {
		var c = this.firstChild;
		value = !value;
		if(value) {
			c.style.display = 'block';
		} else {
			c.style.display = 'none';
		}
		if(func) func(value);
	};
    return elm;
}

function lerp(a, b, t) {
  return a * (1.0 - t) + b * t;
}

function powp(a, b, t) {
  return Math.pow(a, 1.0 - t) * Math.pow(b, t);
}

function easeOut(x) {
  return 1 - (1 - x) * (1 - x);
}

function zoom(s, x, y) {
  if(isMove) {
    return;    
  }
  var t = 0,
    o = scale,
    ox = translate[0],
    oy = translate[1];
  //translate[0] = x;
  //translate[1] = y;
  isMove = true;
  (function() {
    scale = powp(o, s, t);
    var tt = easeOut(t);
    translate[0] = lerp(ox, x, tt);
    translate[1] = lerp(oy, y, tt);
    render();
    t += 0.01;
    if(t <= 1) {
      setTimeout(arguments.callee, 1000 / 33);
    } else {
      isMove = false; 
    }
  })();
}

function initBuffer() {
  stream.vtx = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, stream.vtx);
  var vertices = [
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function initTexture() {
  stream.tex = gl.createTexture();
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, stream.tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  //
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, colorTable);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
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

  program.blockUniform = gl.getUniformLocation(program, 'uBlock');
  program.offsetUniform = gl.getUniformLocation(program, 'uOffset');
}

function preRender() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, stream.vtx);
  gl.vertexAttribPointer(program.vertex.position, 3, gl.FLOAT, false, 0, 0);
  
  gl.uniform1i(program.samplerUniform, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, stream.tex);
}

// 描画
function render() {
  gl.uniform1f(program.blockUniform, scale);
  gl.uniform2fv(program.offsetUniform, translate);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  //gl.finish();
}


















