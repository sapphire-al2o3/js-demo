var gl,
    program,
    frame = 0,
    bias = 0.0;

function createPlaneMesh(m) {
    var position = [],
        texcoord = [],
        index = [];

    position = [
        -32.0, 32.0, 0.0,
        32.0, 32.0, 0.0,
        -32.0, -32.0, 0.0,
        32.0, -32.0, 0.0
    ];

    texcoord = [
        0.0, 1.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 0.0
    ];

    index = [1, 0, 2, 1, 2, 3];

    return {
        material: m,
        indexStream: index,
        vertexStream: {
            position: position,
            uv: texcoord
        }
    };
}

window.onload = function () {
    var model = {};
    model.meshes = [];
    model.materials = [
        { texture: [
            'tex256.png',
            'tex128.png',
            'tex64.png',
            'tex32.png',
            'tex16.png',
            'tex8.png',
            'tex4.png',
            'tex2.png',
            'tex1.png']}
    ];
    model.meshes.push(createPlaneMesh(0));

    slider('slider', -2.0, 2.0, 0.0, value => {
        bias = value;
        render(model);
    });

    ready(model);
};


function ready(model) {
	// WebGLのコンテキスト取得
	gl = initContext('canvas');
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
	initBuffer(gl, model);
	program = initShader(gl, 'shader-fs', 'shader-vs');
	setupTexture(model);
	console.log(gl.drawingBufferWidth);
	
	setTimeout(function() {
		render(model);
	}, 100);
}
	
var imageLoader = {
	images: [],
	count: 0,
	load: function(files) {
		var that = this;
		for(var i = 0, n = files.length; i < n; i++) {
			var image = new Image();
			image.onload = this.callback.bind(this);
			image.src = files[i];
			this.images.push(image);
		}
	},
	callback: function() {
		this.count++;
		if(this.images.length === this.count) {
			this.onload(this.images);
		}
	}
};

function setupTexture(model) {
	var materials = model.materials,
		i = 0,
		n = materials.length,
		mat,
		image;
	
	for(; i < n; i++) {
		mat = materials[i];
		
		if(Array.isArray(mat.texture)) {
			imageLoader.onload = function(m) {
				return function(images) {
					m.tex = initTexture(gl, images);
					gl.bindTexture(gl.TEXTURE_2D, m.tex);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
					gl.bindTexture(gl.TEXTURE_2D, null);
				};
			}(mat);
			imageLoader.load(mat.texture);
		} else {
			image = new Image();
			image.onload = function(m) {
				return function() { m.tex = initTexture(gl, this); };
			}(mat);
			image.src = mat.texture;
		}
	}
}

// 描画
function render(model) {
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
	// ユニフォーム設定
	gl.uniform1f(program.uniform['bias'].location, bias);
	
	gl.activeTexture(gl.TEXTURE0);
	
	getError(gl);
	
	// 頂点バッファ
	for(var i = 0; i < model.meshes.length; i++) {
		var mesh = model.meshes[i],
			mat = model.materials[mesh.material];
        if(mat && mat.tex) {
			gl.bindTexture(gl.TEXTURE_2D, mat.tex);
		}
        setupAttribute(program, mesh.vbo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
		gl.drawElements(gl.TRIANGLES, mesh.indexStream.length, gl.UNSIGNED_SHORT, 0);
	}
	
	frame++;
	
	gl.flush();
	getError(gl);
}

function slider(id, min, max, def, func) {
	var elm = document.getElementById(id),
		w = elm.clientWidth,
		d = max - min;
	
	elm.onmousedown = function(e) {
		var cur = this.firstChild,
			t = document,
			r = elm.getBoundingClientRect(),
			x = e.pageX - r.left,
			y = e.pageY - r.top,
			l = r.left;
		cur.style.left = x - 5 + 'px';
		elm.value = x / w;
		if(elm.value > 1.0) elm.value = 1.0;
		if(elm.value < 0.0) elm.value = 0.0;
		elm.value = elm.value * d + min;
		t.onselectstart = function() { return false; };
		t.onmousemove = function(e) {
			var x = e.clientX - l;
			if(x < 0) x = 0;
			if(x > w) x = w;
			cur.style.left = x - 5 + 'px';
			elm.value = x / w;
			elm.value = elm.value * d + min;
			cur.setAttribute('value', elm.value.toFixed(2));
			if(func) func(elm.value);
		};
		t.onmouseup = function(e) {
			t.onmousemove = null;
			t.onmouseup = null;
			t.onselectstart = null;
		};
		
		if(func) func(elm.value);
	};
    elm.value = def;
    let x = (def - min) / d * w - 5;
    elm.firstChild.style.left = x + 'px';
    return elm;
}
