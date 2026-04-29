const Base64 = (() => {
    const e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let d = {},
        i = 0,
        l = e.length;
    
    for (i = 0; i < l; i += 1) {
        d[e[i]] = i;
    }

    return {
        encode: (a, s) => {
            let l = s === undefined ? a.length : s,
                m = l % 3,
                r = [],
                i = 0,
                j = 0;
            
            for (i = 0; i <= l - 3; i += 3) {
                j = (a[i] << 16) | (a[i + 1] << 8) | a[i + 2];
                r.push(e[j >> 18 & 63], e[j >> 12 & 63], e[j >> 6 & 63], e[j & 63]);
            }
            
            if (m === 1) {
                j = a[i] << 16;
                r.push(e[j >> 18 & 63], e[j >> 12 & 63], '==');
            } else if (m === 2) {
                j = (a[i] << 16) | (a[i + 1] << 8);
                r.push(e[j >> 18 & 63], e[j >> 12 & 63], e[j >> 6 & 63], '=');
            }
            
            return r.join('');
        },
        encodeURL: (a, s) => {
            return encode(a, s).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
        },
        decode: (b, a) => {
            if (a === undefined) {
                a = [];
            }
            
            const l = b.length;
            
            b[l - 1] === '=' && l--;
            b[l - 1] === '=' && l--;
            b[l - 1] === '=' && l--;
            
            const m = b.length - l;
            
            for (let i = 0, j = 0; i <= l - 4; i += 4) {
                let k = (d[b[i]] << 18) | (d[b[i + 1]] << 12) | (d[b[i + 2]] << 6) | d[b[i + 3]];
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
        decodeSize: (b) => {
            let l = b.length;
            if (l >= 4) {
                let s = l / 4 * 3;
                b[l - 1] === '=' && s--;
                b[l - 2] === '=' && s--;
                b[l - 3] === '=' && s--;
                return s;
            }
            return 0;
        },
        check: (b) => {
            let l = b.length;
            for (let i = 0; i < l; i++) {
                if (!(b[i] in d)) {
                    return false;
                }
            }
            return true;
        }
    };

})();
