/**
 * 通知音を再生する関数
 * タイマー終了時などに呼び出して、音声で通知を行う
 * @returns Promise<void> - 音声の再生が完了するまで待機するPromise
 */
export async function playNotificationSound() {
    try {
        // Audioオブジェクトを作成
        // '/notification.mp3'はpublicフォルダ内の音声ファイルを指す
        const audio = new Audio('/notification.mp3');

        // 音量を30%（0.3）に設定
        // 0.0（無音）から1.0（最大音量）の範囲で指定
        audio.volume = 0.3;

        // 音声の再生を開始
        // play()はPromiseを返すため、awaitで再生開始を待つ
        await audio.play();

        // 音声の再生が完全に終了するまで待機するPromiseを返す
        // これにより、呼び出し側で音声が終わるまで待つことができる
        return new Promise<void>((resolve) => {
            // onendedイベント：音声の再生が終了した時に発火する
            // 再生終了時にresolve()を呼び出してPromiseを解決する
            audio.onended = () => resolve();
        })

    } catch (error) {
        // エラーが発生した場合（例：ファイルが見つからない、再生権限がないなど）
        // コンソールにエラーメッセージを出力する
        // エラーが発生してもアプリケーションは継続して動作する
        console.error('通知音を再生できませんでした:', error);
    }
}