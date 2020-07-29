function createPlane() {
    var vertices = [
            -1, 0, 1,
            -1, 0, -1,
            1, 0, 1,
            1, 0, -1
        ],
        indices = [
            1, 0, 2,
            1, 2, 3
        ],
        normals = [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0
        ],
        texcoords = [
            1, 0,
            0, 1,
            0, 0,
            1, 1
        ];

    return { size: indices.length, v: vertices, i: indices, t: texcoords, n: normals };
}

function createSphere(n) {
    var vertices = [],
        indices = [],
        normals = [],
        texcoods = [];

    for(var i = 0; i <= n; i++) {
        var ph = Math.PI * i / n,
            y = Math.cos(ph),
            r = Math.sin(ph);
        
        for(var j = 0; j <= n; j++) {
            var th = 2.0 * Math.PI * j / n,
                x = r * Math.cos(th),
                z = r * Math.sin(th);
            vertices.push(x, y, z);
            normals.push(x, y, z);
            texcoods.push(x, y, z);
        }
    }

    for(i = 0; i < n; i++) {
        for(j = 0; j < n; j++) {
            var count = (n + 1) * j + i;
            indices.push(count, count + 1, count + n + 2);
            indices.push(count, count + n + 2, count + n + 1);
        }
    }
    return { size: indices.length, v: vertices, i: indices, t: texcoods, n: normals };
}

function createTorus(n, m) {
    var vertices = [],
        indices = [],
        normals = [],
        texcoords = [],
        s = 3.0,
        t = 1.0;

    for(var i = 0; i <= n; i++) {
        var ph = Math.PI * 2.0 * i / n,
            y = Math.cos(ph) * t,
            r = Math.sin(ph) * t;
        
        for(var j = 0; j <= m; j++) {
            var th = 2.0 * Math.PI * j / n,
                cth = Math.cos(th),
                sth = Math.sin(th),
                x = cth * (s + r),
                z = sth * (s + r);
            vertices.push(x, y, z);
            normals.push(cth * r, y, sth * r);
            texcoords.push(x, y, z);
        }
    }

    for(i = 0; i < n; i++) {
        for(j = 0; j < m; j++) {
            var count = (n + 1) * j + i;
            indices.push(count, count + 1, count + n + 2);
            indices.push(count, count + n + 2, count + n + 1);
        }
    }

    return { size: indices.length, v: vertices, i: indices, t: texcoords, n: normals };
}

function createCube() {
    var vertices = [
        // Front face
        -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];
    var indices = [
        // Front face
        0, 1, 2,
        0, 2, 3,
        // Back face
        4, 5, 6,
        4, 6, 7,
        // Top face
        8, 9, 10,
        8, 10, 11,
        // Bottom face
        12, 13, 14,
        12, 14, 15,
        // Right face
        16, 17, 18,
        16, 18, 19,
        // Left face	
        20, 21, 22,
        20, 22, 23
    ];
    var normals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
    ];
    var textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];
    return { size: 36, v: vertices, n: normals, t: textureCoords, i: indices };
}
