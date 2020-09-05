```
var colorLoc0 = gl.getUniformLocation(program, 'colors[0]');
gl.uniform4f(colorLoc0, 1.0, 1.0, 1.0, 1.0);
```

みたいな感じで1個1個配列の値を設定できる。