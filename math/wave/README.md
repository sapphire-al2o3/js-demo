三角波

```
Math.abs(x - Math.floor(x) - 0.5) * 2
```

ノコギリ波
```
x - Math.floor(x)
```

矩形波

```
Math.max(x - Math.floor(x) - 0.5, 0) > 0 ? 1 : 0
```

