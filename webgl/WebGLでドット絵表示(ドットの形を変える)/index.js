// forked from sapphire_al2o3's "WebGLでインデックスカラー画像を表示" http://jsdo.it/sapphire_al2o3/1vJc
(function() {
	'use strict';
	
    var Base64 = function () {
		var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
			d = {},
			i = 0,
			l = e.length;
		
		for (i = 0; i < l; i += 1) {
			d[e[i]] = i;
		}
	
		return {
			decode: function (b, a) {
				if (a === undefined) {
					a = [];
				}
				
				var l = b.length;
				
				b[l - 1] === '=' && l--;
				b[l - 1] === '=' && l--;
				b[l - 1] === '=' && l--;
				
				var m = b.length - l;
				
				for (var i = 0, j = 0; i <= l - 4; i += 4) {
					var k = (d[b[i]] << 18) | (d[b[i + 1]] << 12) | (d[b[i + 2]] << 6) | d[b[i + 3]];
					a[j++] = k >> 16 & 255;
					a[j++] = k >> 8 & 255;
					a[j++] = k & 255;
				}
				
				if (m == 1) {
					k = (d[b[i]] << 18) | (d[b[i + 1]] << 12) | (d[b[i + 2]] << 6);
					a[j++] = k >> 16 & 255;
					a[j] = k >> 8 & 255;
				} else if (m == 2) {
					k = (d[b[i]] << 18) | (d[b[i + 1]] << 12);
					a[j] = k >> 16 & 255;
				}
				
				return a;
			},
			decodeSize: function (b) {
				var l = b.length;
				if (l >= 4) {
					var s = l / 4 * 3;
					b[l - 1] === '=' && s--;
					b[l - 2] === '=' && s--;
					b[l - 3] === '=' && s--;
					return s;
				}
				return 0;
			},
			check: function (b) {
				var l = b.length;
				for (var i = 0; i < l; i++) {
					if (!(b[i] in d)) {
						return false;
					}
				}
				return true;
			}
		};
	
	}();
    
	function str2rgb(str) {
		if (str[0] === '#') {
			if (str.length === 7) {
				return [parseInt(str.slice(1, 3), 16), parseInt(str.slice(3, 5), 16), parseInt(str.slice(5), 16)];
			} else if (str.length === 4) {
				return [parseInt(str[1] + str[1], 16), parseInt(str[2] + str[2], 16), parseInt(str[3] + str[3], 16)];
			}
		} else {
			var c = str.match(/(\d+)/g);
			return [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)];
		}
	}
    
	var gl = initContext('canvas'),
		program = initShader(gl, 'shader-fs', 'shader-vs');
	
	var image = {"index":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAgIDBAICAQEAAAAAAAAAAAAAAAAAAAAAAAAAAQECBAIDBAICAwQCAgEAAAAAAAAAAAAAAAAAAAAAAAECBAIBAQIDAwICAwQDAgEAAAAAAAAAAAAAAAAAAAABAgQAAQUFAQICAwQCAgIDAwEAAAAAAAAAAAAAAAAAAAEEAAAABgUBAwQCAgMDBAICAQAAAAAAAAAAAAAAAAABAAAAAAAGBQECAwIDBAICAgMCAQAAAAAAAAAAAAAAAAEABwcAAAgDCAAIAgIDBAMEAgIBAAAAAAAAAAAAAAABBQAHBwAAAAgAAAAACAIDAgIDAwIBAAAAAAAAAAEBAQUFBQUFAAAAAAAAAAAAAAgCAwQCAwEAAAAAAAAAAQEFBQUGBQAAAAAACAAAAAAAAAAAAAgIAQAAAAAAAAAAAAEBAQEFAAAAAAgICAgAAAAAAAAICAgBAAAAAAAAAAAAAAAAAAEBAQMICAgICAgICAgIAAgIAQAAAAAAAAAAAAAAAAAAAAAAAQYFAQEBAQEBAQYAAQEAAAAAAAAAAAAAAAAAAAAAAAABBQUBAAAAAAABBQUBAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEAAAAAAAEBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==","palette":"/////3tjZv/Wrob/pn5j/+TJo///4db/0YiI/1BYSP/m3sn/","width":32,"height":32};
	
	var indexData = new Uint8Array(image.width * image.height),
		paletteData = new Uint8Array(256 * 4);
	
	var paletteSize = Base64.decodeSize(image.palette);
	
    // base64でエンコードしてあるのでデコードする
	Base64.decode(image.index, indexData);
	Base64.decode(image.palette, paletteData);
	
	var scale = 8.0 * image.width / gl.canvas.width;
	
    // スライダーのイベント
	document.body.appendChild(createSlider('zoom', scale / 3, function(v, id) {
		scale = v * 3.0;
		if(scale <= 0.0) scale = 0.01;
		render();
	}));
	
    // パレットのイベント
	var paletteElm = document.createElement('div');
	paletteElm.className = 'palette';
	for(var i = 0; i < paletteSize; i += 4) {
		var c = document.createElement('div'),
			r = paletteData[i + 0],
			g = paletteData[i + 1],
			b = paletteData[i + 2],
			a = paletteData[i + 3] / 255;
        c.setAttribute('palette-index', i / 4);
		c.style.backgroundColor = 'rgba(' + [r, g, b, a].join(',') + ')';
		c.addEventListener('mousedown', function(e) {
            var elm = e.target;
            ColorSelector.show(function(v) {
                var i = parseInt(elm.getAttribute('palette-index'), 10);
                elm.style.backgroundColor = v;
                var rgb = str2rgb(v);
                paletteData[i * 4 + 0] = rgb[0];
                paletteData[i * 4 + 1] = rgb[1];
                paletteData[i * 4 + 2] = rgb[2];
                paletteData[i * 4 + 3] = 255;
                
                // パレットのテクスチャ更新
                gl.bindTexture(gl.TEXTURE_2D, paletteTex);
	            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, paletteData.length / 4, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, paletteData);
                
                render();
            }, elm.style.backgroundColor, elm);
            e.stopPropagation();
		});
		paletteElm.appendChild(c);
	}
	document.body.appendChild(paletteElm);
	
    var shapeElm = document.querySelectorAll('input[type="radio"]');
    for(var i = 0; i < shapeElm.length; i++) {
        shapeElm[i].addEventListener('change', function(e) {
            var t = parseInt(e.target.value, 10);
            gl.uniform1i(typeLoc, t);
            render();
        });
    }
    

    // 頂点バッファ作成
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
	
	// インデックスのテクスチャ作る
	var indexTex = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, indexTex);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, image.width, image.height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, indexData);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	// パレットのテクスチャ作る
	var paletteTex = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, paletteTex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, paletteData.length / 4, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, paletteData);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	var indexLoc = gl.getUniformLocation(program, 'index');
	gl.uniform1i(indexLoc, 0);
	
	var paletteLoc = gl.getUniformLocation(program, 'palette');
	gl.uniform1i(paletteLoc, 1);
	
	var scaleLoc = gl.getUniformLocation(program, 'scale');
	gl.uniform1f(scaleLoc, scale);

    var imageLoc = gl.getUniformLocation(program, 'image');
    gl.uniform2f(imageLoc, image.width, image.height);

    var typeLoc = gl.getUniformLocation(program, 'type');
    gl.uniform1i(typeLoc, 2);
	
    var frameLoc = gl.getUniformLocation(program, 'frame');
    gl.uniform1f(frameLoc, 0);

    var frame = 0;

	// レンダリング
	function render() {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.uniform1f(scaleLoc, scale);
        gl.uniform1f(frameLoc, frame);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.flush();
        //frame++;
	}
	render();
    //setAnimationFrame(render, 1000 / 30);
})();
