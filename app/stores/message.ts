// Firebase Realtime Databaseの機能をインポート
import {
  ref as dbRef, // データベース参照を作成
  push, // 新しい子ノードを追加
  set, // データを設定
  onValue, // リアルタイムでデータ変更を監視
  off, // リスナーを削除
  serverTimestamp, // サーバー側のタイムスタンプを取得
  type Database, // データベースの型定義
  type DatabaseReference, // データベース参照の型定義
} from 'firebase/database'

// メッセージの型定義
export interface Message {
  id: string // メッセージの一意ID
  text: string // メッセージの本文
  authorId: string // 投稿者のユーザーID
  authorName: string // 投稿者の表示名
  authorAvatar?: string // 投稿者のアバター画像URL（オプション）
  timestamp: number // 投稿日時（Unixタイムスタンプ）
  threadId: string // 所属するスレッドのID
}

// メッセージ管理用のPiniaストアを定義
export const useMessageStore = defineStore('message', () => {
  // NuxtアプリからFirebaseデータベースインスタンスを取得
  const { $database } = useNuxtApp()
  const database = $database as Database | null

  // リアクティブな状態管理
  const messages = ref<Message[]>([]) // メッセージ一覧
  const loading = ref(false) // ローディング状態
  const error = ref<string | null>(null) // エラーメッセージ

  // データベース参照とリスナーの管理用変数
  let messagesRef: DatabaseReference | null = null // メッセージのデータベース参照
  let unsubscribe: (() => void) | null = null // リスナー解除関数

  /**
   * メッセージを送信する関数
   * @param threadId スレッドID
   * @param text メッセージ本文
   * @returns 送信結果（成功/失敗とエラーメッセージ）
   */
  const sendMessage = async (threadId: string, text: string) => {
    // データベースの初期化チェック
    if (!database) {
      error.value = 'Databaseが初期化されていません'
      return { success: false, error: error.value }
    }

    // 認証ストアとプロフィールストアを取得
    const authStore = useAuthStore()
    const profileStore = useProfileStore()

    // ユーザー認証とプロフィール設定の確認
    if (!authStore.user || !profileStore.profile) {
      error.value =
        'ユーザーが認証されていないか、プロフィールが設定されていません'
      return { success: false, error: error.value }
    }

    // メッセージ本文の空文字チェック
    if (!text.trim()) {
      error.value = 'メッセージを入力してください'
      return { success: false, error: error.value }
    }

    // ローディング状態を開始し、エラーをクリア
    loading.value = true
    error.value = null

    try {
      // 指定されたスレッドのメッセージ参照を取得
      const messageRef = dbRef(database, `messages/${threadId}`)
      // 新しいメッセージ用の子ノードを作成
      const newMessageRef = push(messageRef)

      // メッセージデータを構築
      const messageData = {
        text: text.trim(), // 前後の空白を除去
        authorId: authStore.user.uid, // 投稿者のユーザーID
        authorName: profileStore.profile.nickname, // 投稿者の表示名
        authorAvatar: profileStore.profile.avatar || '', // 投稿者のアバター（空文字の場合は空文字）
        timestamp: serverTimestamp(), // サーバー側のタイムスタンプ
        threadId, // スレッドID
      }

      // データベースにメッセージを保存
      await set(newMessageRef, messageData)

      return { success: true, error: null }
    } catch (err) {
      // エラーが発生した場合の処理
      error.value = `メッセージの送信に失敗しました: ${err}`
      return { success: false, error: error.value }
    } finally {
      // ローディング状態を終了
      loading.value = false
    }
  }

  /**
   * リアルタイムでメッセージを監視する関数
   * 指定されたスレッドのメッセージ変更を監視し、リアルタイムで更新する
   * @param threadId 監視対象のスレッドID
   */
  const subscribeToMessages = (threadId: string) => {
    // データベースの初期化チェック
    if (!database) {
      error.value = 'Databaseが初期化されていません'
      return
    }

    // 既存の監視を停止（重複監視を防ぐ）
    unsubscribeMessages()

    // 指定されたスレッドのメッセージ参照を取得
    messagesRef = dbRef(database, `messages/${threadId}`)

    // リアルタイムリスナーを設定
    unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const messagesList: Message[] = []

        // スナップショットが存在する場合のみ処理
        if (snapshot.exists()) {
          const data = snapshot.val()

          // データベースの各メッセージを配列に変換
          Object.keys(data).forEach((key) => {
            const messageData = data[key]
            messagesList.push({
              id: key, // メッセージID（データベースのキー）
              text: messageData.text, // メッセージ本文
              authorId: messageData.authorId, // 投稿者ID
              authorName: messageData.authorName, // 投稿者名
              authorAvatar: messageData.authorAvatar || '', // 投稿者アバター（デフォルトは空文字）
              timestamp: messageData.timestamp || Date.now(), // タイムスタンプ（デフォルトは現在時刻）
              threadId: messageData.threadId, // スレッドID
            })
          })

          // タイムスタンプで昇順ソート（古いメッセージから新しいメッセージ順）
          messagesList.sort((a, b) => a.timestamp - b.timestamp)
        }

        // メッセージ一覧を更新し、エラーをクリア
        messages.value = messagesList
        error.value = null
      },
      (err) => {
        // エラーが発生した場合の処理
        error.value = `メッセージの取得に失敗しました: ${err}`
        console.error('メッセージ監視エラー:', err)
      }
    )
  }

  /**
   * メッセージ監視を停止する関数
   * リソースリークを防ぐために、リスナーとデータベース参照をクリーンアップ
   */
  const unsubscribeMessages = () => {
    // リスナーが存在する場合、解除してnullに設定
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    // データベース参照が存在する場合、オフにしてnullに設定
    if (messagesRef) {
      off(messagesRef)
      messagesRef = null
    }
  }

  /**
   * メッセージをクリアする関数
   * メッセージ一覧を空にして、監視も停止する
   */
  const clearMessages = () => {
    messages.value = [] // メッセージ一覧をクリア
    unsubscribeMessages() // 監視を停止
  }

  /**
   * ストアが破棄される時に実行されるクリーンアップ関数
   * メモリリークを防ぐために監視を停止
   */
  const $dispose = () => {
    unsubscribeMessages()
  }

  // ストアから公開する状態と関数を返す
  return {
    // 読み取り専用のリアクティブ状態
    messages: readonly(messages), // メッセージ一覧（外部からの直接変更を防ぐ）
    loading: readonly(loading), // ローディング状態（外部からの直接変更を防ぐ）
    error: readonly(error), // エラーメッセージ（外部からの直接変更を防ぐ）

    // 公開する関数
    sendMessage, // メッセージ送信関数
    subscribeToMessages, // メッセージ監視開始関数
    unsubscribeMessages, // メッセージ監視停止関数
    clearMessages, // メッセージクリア関数
    $dispose, // ストア破棄時のクリーンアップ関数
  }
})
