/*

大気減光　大気によって星が暗くなる。地平線付近の方が大気を通る距離が長いのでより暗くなる。
星のまたたき　大気によって光が散乱されて瞬いて見える。地平線付近の方が散乱される。
星の数　目に見える星(6等星くらいまで)の数は全天で8000個ほどなので半分で4000くらい

*/
(function() {
    'use strict';

    var canvas = document.getElementById('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 2;

    var gl = initContext('canvas');

    var bloom = new Bloom(gl);

    var program = initShader(gl, 'star-fs', 'star-vs'),
        sky = initShader(gl, 'sky-fs', 'sky-vs');

    var count = 5000;

    var colors = [
        rgb('#4787e0', 0.3),	// 20000
        rgb('#ffffff', 0.3),
        rgb('#ffe894', 0.3),
        rgb('#fa7553', 0.3)
    ];

    var stars = createRandomSphere(count);
    initBuffer(gl, stars);

    var camera = {},
        matrix = {};

    camera.position = new Vector3(0, 0, 0);
    camera.target = new Vector3(0, 1.5, 2);
    camera.up = new Vector3(0, 1, 0);
    matrix.mMatrix = new Matrix4();
    matrix.vMatrix = new Matrix4();
    matrix.mvMatrix = new Matrix4();
    matrix.pMatrix = new Matrix4();

    // 行列設定
    Matrix4.identity(matrix.mMatrix);
    Matrix4.perspective(60.0 * Math.PI / 180.0, gl.canvas.width / gl.canvas.height, 0.1, 1000.0, matrix.pMatrix);
    Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);
    matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);

    sky.uniform['topColor'].value = rgb('#00002a', 1);
    sky.uniform['bottomColor'].value = rgb('#343460', 1);

    var timer = setAnimationFrame(render, 1000 / 60);

    var free = false;
    
    gl.canvas.addEventListener('click', function() {
        //timer.toggle();
        free = !free;
    });
    
    gl.canvas.addEventListener('mousemove', function(e) {
        if(free) {
            var rad = e.clientX / gl.canvas.width * 2;
            camera.target.x = 2 * Math.cos(rad);
            camera.target.z = 2 * Math.sin(rad);
            camera.target.y = (1 - e.clientY / gl.canvas.height) * 2.0 + 0.5;
        }
    });

    gl.enable(gl.BLEND);
    gl.depthFunc(gl.ALWAYS);

    var frame = 0,
        time = 0;

    function render(delta) {
        time += delta;
        
        if(!free) {
            camera.target.x = Math.cos(frame * 0.001) * 2;
            camera.target.z = Math.sin(frame * 0.001) * 2;
            frame++;
        }
        
        Matrix4.lookAt(camera.position, camera.target, camera.up, matrix.vMatrix);
        matrix.mMatrix.mul(matrix.vMatrix, matrix.mvMatrix);
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.useProgram(sky);
        setupUniform(sky);
        setupAttribute(sky, stars.meshes[1].vbo);
        setBlend(gl);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.useProgram(program);
        program.uniform['mvMatrix'].value = matrix.mvMatrix.data;
        program.uniform['pMatrix'].value = matrix.pMatrix.data;
        program.uniform['time'].value = time / 1000;
        setAdditionBlend(gl);
        setupUniform(program);
        setupAttribute(program, stars.meshes[0].vbo);
        gl.drawArrays(gl.POINTS, 0, count);

        setBlend(gl);
        bloom.draw(3);
        
        gl.flush();
    }

    // 加算合成
    function setAdditionBlend(gl) {
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    }

    function setBlend(gl) {
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ZERO);
    }

    function rgb(str, a) {
        var r = parseInt(str.slice(1, 3), 16) / 255,
            g = parseInt(str.slice(3, 5), 16) / 255,
            b = parseInt(str.slice(5), 16) / 255;
        return [r, g, b, a || 1];
    }

    function lerp(a, b, t) {
        return a * (1 - t) + b * t;
    }

    function lerpColor(k) {
        var c0 = colors[k | 0],
            c1 = colors[k + 1 | 0],
            t = k - (k | 0);
        return [
            lerp(c0[0], c1[0], t),
            lerp(c0[1], c1[1], t),
            lerp(c0[2], c1[2], t),
            1
        ];
    }

    // 球面上にランダムに頂点を配置する
    function createRandomSphere(n) {
        var p = [],
            c = [],
            size = [],
            b = [];

        for(; n >= 0; n--) {
            var x, y, z, r;
            r = 100.0;
            x = Math.random() * 2 - 1;
            y = Math.random();
            z = Math.random() * 2 - 1;
            b.push((1 - y) * 0.4, 2 * Math.PI * Math.random());
            var l = 1 / Math.sqrt(x * x + y * y + z * z);

            x = x * l * r;
            y = y * l * r;
            z = z * l * r;
            p.push(x, y, z);

            var mag = Math.random();
            
            
            var color = lerpColor(Math.random() * (colors.length - 1));
            color[3] = mag + 0.1;
            c = c.concat(color);

            mag = (mag * mag * mag * mag * mag) * 12.0 + 4.0;
            size.push(mag);
        }

        return {
            meshes: [
                {
                    vertexStream: {
                        position: p,
                        color: c,
                        size: size,
                        blink: b
                    }
                },
                {
                    vertexStream: {
                        position: [
                                1.0, -1.0,
                                1.0,  1.0,
                            -1.0, -1.0,
                            -1.0,  1.0
                        ]
                    }
                }
            ]
        };
    }
})();
