Webカメラが使えるブラウザ限定(Google Chorme、Opera Next)

getUserMediaを使ってWebカメラから取得した画像をvideoに流し込んでWebGLでテクスチャとしてつかっています。

Google Chromeの場合は起動オプションに--enable-media-streamをつけて試してください。
実行するとブラウザの上のほうにWebカメラのアクセスの許否が出てくるので許可してみてください。

動作確認環境：Google Chrome 19