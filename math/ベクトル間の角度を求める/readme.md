* ベクトル間の角度を0～360度の範囲で求める

```
let r = Math.atan2(v0.x * v1.y - v1.x * v0.y, v0.x * v1.x + v0.y * v1.y);
r = r < 0 ? r + Math.PI * 2 : r;
```