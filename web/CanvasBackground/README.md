https://sapphire-al2o3.github.io/js-demo/web/CanvasBackground/

- Fill: fillRectで画面を塗りつぶす
- Clear: clearRectで画面をクリアする
- Load: backgroundImageでCanvasの背景に画像を読み込む
- Reset: Canvasのサイズを変更してコンテキストをリセットする

AndroidのChromeで最初にLoadを押した場合、Canvasに設定した背景は表示される。
最初にClear、Loadの順に押した場合、Canvasに設定した背景が表示されない。(WindowsのChromeでは表示される)
Resetを押して、Canvasのサイズを変更され設定がリセットされると背景が表示されるようになる。
