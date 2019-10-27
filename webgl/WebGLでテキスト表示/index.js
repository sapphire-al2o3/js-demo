(function(global) {
	'use strict';
	
	var mesh = {};
	
	var position = [],
		uv = [],
		buffer,
		indexStream,
		offset = 0,
		texture,
		font,
		count = 0,
		vbo,
		ibo,
		uniforms = [],
		attributes = [],
		program,
		ditry = true;
	
	var gl;
	
	var Font = {};
	
	var defualtFS =
		"precision highp float;\n" +
		"uniform sampler2D sampler;\n" +
		"varying vec2 v_uv;\n" +
		"varying vec4 v_color;\n" +
		"void main() {\n" +
		"vec4 tex = texture2D(sampler, v_uv);\n" +
		"gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);\n" +
		"}";
	
	var defaultVS =
		"attribute vec3 position;\n" +
		"attribute vec2 uv;\n" +
		"attribute vec4 color;\n" +
		"uniform vec2 screen;\n" +
		"varying vec2 v_uv;\n" +
		"varying vec4 v_color;\n" +
		"void main() {" +
		"v_uv = uv;\n" +
		"v_color = color;\n" +
		"gl_Position = vec4(position.xy / screen.xy, 0.0, 1.0);\n" +
		"}";
	
	Font.create = function(context, max) {
		gl = context;
		buffer = new Float32Array(max * 9 * 4);
		indexStream = new Uint16Array(max * 6);
		var k = 0;
		for(var i = 0; i < max * 6; i += 6) {
			indexStream[i + 0] = k + 0;
			indexStream[i + 1] = k + 1;
			indexStream[i + 2] = k + 2;
			indexStream[i + 3] = k + 0;
			indexStream[i + 4] = k + 2;
			indexStream[i + 5] = k + 3;
			k += 4;
		}
		vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		ibo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexStream, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	};
	
	function getShader(src, kind) {
		var s = gl.createShader(kind);
		gl.shaderSource(s, src);
		gl.compileShader(s);
		return s;
	}
	
	Font.shader = function(p) {
		if(p) {
			
		} else {
			var vs = getShader(defaultVS, gl.VERTEX_SHADER),
				fs = getShader(defualtFS, gl.FRAGMENT_SHADER);
			program = gl.createProgram();
			gl.attachShader(program, vs);
			gl.attachShader(program, fs);
			gl.linkProgram(program);
			uniforms[0] = gl.getUniformLocation(program, 'sampler');
			uniforms[1] = gl.getUniformLocation(program, 'screen');
			attributes[0] = gl.getAttribLocation(program, 'position');
			attributes[1] = gl.getAttribLocation(program, 'uv');
			attributes[2] = gl.getAttribLocation(program, 'color');
		}
	};
	
	Font.texture = function(image) {
		texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.bindTexture(gl.TEXTURE_2D, null);
	};
	
	Font.font = function(f) {
		font = f;
	};
	
	function getCharacter(code) {
        return font && (code in font) ? font[code] : null;
	}
	
	function setupColor(buffer, offset, color) {
		buffer[offset + 5] = color[0];
		buffer[offset + 6] = color[1];
		buffer[offset + 7] = color[2];
		buffer[offset + 8] = color[3];
	}
	
	/**
	 * draw text
	 */
	Font.drawText = function(text, x, y) {
		if(!ditry) {
			count = 0;
			offset = 0;
		}
		if(typeof text !== 'string') {
			text = '' + text;
		}
		var offsetX = 0,
			offsetY = 0;
		for(var i = 0; i < text.length; i++) {
			if(text[i]) {
				var uv = getCharacter(text[i].charCodeAt());
				
				if(uv) {
					var vx = [x, x, x + uv.vw, x + uv.vw],
						vy = [y + uv.vh, y, y, y + uv.vh],
						u = [uv.u, uv.u, uv.u + uv.w, uv.u + uv.w],
						v = [uv.v + uv.h, uv.v, uv.v, uv.v + uv.h];

					if(text[i] === '\n') {
						offsetY += uv.vh;
					}

					for(var j = 0; j < 4; j++) {
						buffer[offset + 0] = vx[j] + offsetX;
						buffer[offset + 1] = vy[j] + offsetY;
						buffer[offset + 2] = 0;
						buffer[offset + 3] = u[j];
						buffer[offset + 4] = v[j];
						buffer[offset + 5] = 1.0;
						buffer[offset + 6] = 1.0;
						buffer[offset + 7] = 1.0;
						buffer[offset + 8] = 1.0;
						offset += 9;
					}
					offsetX += uv.vw;
				}
			}
		}
		count += text.length;
		ditry = true;
	};
	
	/**
	 * draw
	 */
	Font.draw = function() {
		
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		if(ditry) {
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, buffer.subarray(0, offset));
			ditry = false;
		}
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(uniforms[0], 0);
		var w = gl.canvas.width * 0.5,
			h = gl.canvas.height * 0.5;
		gl.uniform2f(uniforms[1], w, h);
		gl.enableVertexAttribArray(attributes[0]);
		gl.enableVertexAttribArray(attributes[1]);
		gl.enableVertexAttribArray(attributes[2]);
		var size = Float32Array.BYTES_PER_ELEMENT,
			stride = 9 * size;
		gl.vertexAttribPointer(attributes[0], 3, gl.FLOAT, false, stride, 0);
		gl.vertexAttribPointer(attributes[1], 2, gl.FLOAT, false, stride, 3 * size);
		gl.vertexAttribPointer(attributes[2], 4, gl.FLOAT, false, stride, 5 * size);
		gl.drawElements(gl.TRIANGLES, count * 6, gl.UNSIGNED_SHORT, 0);
	};
	
	global.Font = Font;
})(this);
