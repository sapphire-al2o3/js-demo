// 固有ベクトル、固有値を求める
function solve(m, e, v0, v1) {
    var b = m[0] + m[3],
        c = m[0] * m[3] - m[1] * m[2],
            d = b * b - 4 * c;
    
    // 虚数になる場合は計算しない
    if(d < 0) return false;
    
    d = Math.sqrt(d);
    
    e[0] = 0.5 * (b + d);
    e[1] = 0.5 * (b - d);
    
    v0[0] = m[1];
    v0[1] = m[3] - e[1];
    
    v1[0] = m[0] - e[0];
    v1[1] = m[2];
    
    return true;
}

document.getElementById('solve').addEventListener('click', function() {
    
    var m = [
        parseFloat(document.getElementById('_00').value),
        parseFloat(document.getElementById('_01').value),
        parseFloat(document.getElementById('_10').value),
        parseFloat(document.getElementById('_11').value)
    ],
        e = [], v0 = [], v1 = [];
    
    if(solve(m, e, v0, v1)) {
        
        document.getElementById('e0').textContent = e[0];
        document.getElementById('v0').textContent = v0[0] + ',' + v0[1];
        
        document.getElementById('e1').textContent = e[1];
        document.getElementById('v1').textContent = v1[0] + ',' + v1[1];
    } else {
        
    }
});