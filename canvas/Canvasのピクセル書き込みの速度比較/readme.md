CanvasのImageDataを別のTypedArrayとしてアクセスすると速くなるか実験

- A: Uint8ClampedArray(通常)
- B: Uint32Array
- C: Uint8Array

時間はconsole.timeで測っているのでコンソール見てください。