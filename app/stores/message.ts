import {
  ref as dbRef,
  push,
  set,
  onValue,
  off,
  serverTimestamp,
  type Database,
  type DatabaseReference,
} from 'firebase/database'

export interface Message {
  id: string
  text: string
  authorId: string
  authorName: string
  authorAvatar?: string
  timestamp: number
  threadId: string
}

export const useMessageStore = defineStore('message', () => {
  const { $database } = useNuxtApp()
  const database = $database as Database | null
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let messagesRef: DatabaseReference | null = null
  let unsubscribe: (() => void) | null = null

  // メッセージを送信
  const sendMessage = async (threadId: string, text: string) => {
    if (!database) {
      error.value = 'Databaseが初期化されていません'
      return { success: false, error: error.value }
    }

    const authStore = useAuthStore()
    const profileStore = useProfileStore()

    if (!authStore.user || !profileStore.profile) {
      error.value =
        'ユーザーが認証されていないか、プロフィールが設定されていません'
      return { success: false, error: error.value }
    }

    if (!text.trim()) {
      error.value = 'メッセージを入力してください'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const messageRef = dbRef(database, `messages/${threadId}`)
      const newMessageRef = push(messageRef)

      const messageData = {
        text: text.trim(),
        authorId: authStore.user.uid,
        authorName: profileStore.profile.nickname,
        authorAvatar: profileStore.profile.avatar || '',
        timestamp: serverTimestamp(),
        threadId,
      }

      await set(newMessageRef, messageData)

      return { success: true, error: null }
    } catch (err) {
      error.value = `メッセージの送信に失敗しました: ${err}`
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // リアルタイムでメッセージを監視
  const subscribeToMessages = (threadId: string) => {
    if (!database) {
      error.value = 'Databaseが初期化されていません'
      return
    }

    // 既存の監視を停止
    unsubscribeMessages()

    messagesRef = dbRef(database, `messages/${threadId}`)

    unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const messagesList: Message[] = []

        if (snapshot.exists()) {
          const data = snapshot.val()

          Object.keys(data).forEach((key) => {
            const messageData = data[key]
            messagesList.push({
              id: key,
              text: messageData.text,
              authorId: messageData.authorId,
              authorName: messageData.authorName,
              authorAvatar: messageData.authorAvatar || '',
              timestamp: messageData.timestamp || Date.now(),
              threadId: messageData.threadId,
            })
          })

          // タイムスタンプでソート
          messagesList.sort((a, b) => a.timestamp - b.timestamp)
        }

        messages.value = messagesList
        error.value = null
      },
      (err) => {
        error.value = `メッセージの取得に失敗しました: ${err}`
        console.error('メッセージ監視エラー:', err)
      }
    )
  }

  // メッセージ監視を停止
  const unsubscribeMessages = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    if (messagesRef) {
      off(messagesRef)
      messagesRef = null
    }
  }

  // メッセージをクリア
  const clearMessages = () => {
    messages.value = []
    unsubscribeMessages()
  }

  // ストアが破棄される時に監視を停止
  const $dispose = () => {
    unsubscribeMessages()
  }

  return {
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    sendMessage,
    subscribeToMessages,
    unsubscribeMessages,
    clearMessages,
    $dispose,
  }
})
