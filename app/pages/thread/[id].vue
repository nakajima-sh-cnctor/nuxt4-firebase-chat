<script setup lang="ts">
import { useMessageStore } from '~/stores/message'
import { useThreadStore } from '~/stores/thread'
import { useDateFormat } from '~/composables/useDateFormat'

const route = useRoute()
const router = useRouter()
const threadId = route.params.id as string

const messageStore = useMessageStore()
const threadStore = useThreadStore()

// スレッド情報を取得
const { threads: threadsData } = await threadStore.getThreads()
const currentThread = threadsData.find((thread) => thread.id === threadId)

if (!currentThread) {
  throw createError({
    statusCode: 404,
    statusMessage: 'スレッドが見つかりません',
  })
}

// メッセージ監視を開始
onMounted(() => {
  messageStore.subscribeToMessages(threadId)
})

// コンポーネントが破棄される時にメッセージ監視を停止
onUnmounted(() => {
  messageStore.unsubscribeMessages()
})

// メッセージ送信
const newMessage = ref('')
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const result = await messageStore.sendMessage(threadId, newMessage.value)
  if (result.success) {
    newMessage.value = ''
  }
}

// Enterキーでの送信は無効化（ボタンクリックのみで送信）
// const handleKeyPress = (event: KeyboardEvent) => {
//   if (event.key === 'Enter' && !event.shiftKey) {
//     event.preventDefault()
//     sendMessage()
//   }
// }

// メッセージの表示位置を自動スクロール
const messagesContainer = ref<HTMLElement>()
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// メッセージが更新されたら自動スクロール
watch(
  () => messageStore.messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)
</script>

<template>
  <div class="chat-container">
    <!-- ヘッダー -->
    <div class="chat-header">
      <v-btn
        class="back-button"
        icon="mdi-arrow-left"
        variant="text"
        @click="router.push('/thread')"
      />
      <div class="thread-info">
        <h2 class="thread-title">{{ currentThread.title }}</h2>
        <p class="thread-description">{{ currentThread.description }}</p>
      </div>
    </div>

    <!-- メッセージ一覧 -->
    <div ref="messagesContainer" class="messages-container">
      <div
        v-if="messageStore.loading && messageStore.messages.length === 0"
        class="loading"
      >
        <v-progress-circular indeterminate />
        <p>メッセージを読み込み中...</p>
      </div>

      <div v-else-if="messageStore.messages.length === 0" class="no-messages">
        <v-icon size="48" color="grey">mdi-chat-outline</v-icon>
        <p>まだメッセージがありません</p>
        <p>最初のメッセージを送信してみましょう！</p>
      </div>

      <div v-else class="messages-list">
        <div
          v-for="message in messageStore.messages"
          :key="message.id"
          class="message-item"
        >
          <div class="message-content">
            <div class="author-info">
              <v-avatar size="40" class="author-avatar">
                <v-img
                  v-if="message.authorAvatar"
                  :src="message.authorAvatar"
                  :alt="message.authorName"
                />
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
              <div class="author-details">
                <span class="author-name">{{ message.authorName }}</span>
                <span class="message-time">{{
                  useDateFormat().formatRelativeTime(message.timestamp)
                }}</span>
              </div>
            </div>
            <div class="message-text">{{ message.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- メッセージ入力フォーム -->
    <div class="message-input-container">
      <v-textarea
        v-model="newMessage"
        :disabled="!!messageStore.loading"
        placeholder="メッセージを入力..."
        variant="outlined"
        rows="1"
        auto-grow
        hide-details
        class="message-input"
      />
      <v-btn
        class="send-button"
        icon="mdi-send"
        color="primary"
        variant="flat"
        :disabled="!newMessage.trim() || !!messageStore.loading"
        @click="sendMessage"
      />
    </div>

    <!-- エラー表示 -->
    <v-snackbar
      :model-value="!!messageStore.error"
      color="error"
      timeout="5000"
    >
      {{ messageStore.error }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 2px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-button {
  margin-right: 16px;
}

.thread-info {
  flex: 1;
}

.thread-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #212529;
}

.thread-description {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.loading,
.no-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #6c757d;
}

.loading p,
.no-messages p {
  margin: 8px 0 0 0;
  text-align: center;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.message-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f3f4;
}

.author-avatar {
  border: 2px solid #e9ecef;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 14px;
  color: #495057;
  font-weight: 600;
}

.message-text {
  margin: 0;
  line-height: 1.6;
  word-wrap: break-word;
  color: #212529;
  font-size: 15px;
}

.message-time {
  font-size: 12px;
  color: #6c757d;
}

.message-input-container {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background-color: white;
  border-top: 2px solid #e9ecef;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.message-input {
  flex: 1;
}

.send-button {
  flex-shrink: 0;
  min-width: 48px;
}

/* スクロールバーのスタイリング */
.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f3f4;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .messages-container {
    padding: 16px;
  }

  .message-input-container {
    padding: 16px;
  }

  .chat-header {
    padding: 12px 16px;
  }

  .thread-title {
    font-size: 18px;
  }
}
</style>
