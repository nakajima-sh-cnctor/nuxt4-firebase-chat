<script setup lang="ts">
// スレッド作成フォームコンポーネントをインポート
import ThreadForm from '~/components/ThreadForm.vue'

// 認証とスレッド関連のcomposableを使用
const { user } = useAuth()
const { createThread, loading } = useThread()
const error = ref<string | null>(null)

// スレッド作成処理
const createThreadHandler = async (data: {
  title: string
  description: string
}) => {
  // ユーザー認証チェック
  if (!user.value) {
    error.value = 'ユーザーが認証されていません'
    return
  }
  error.value = null

  // スレッド作成API呼び出し
  const result = await createThread(
    data.title,
    data.description,
    user.value.uid,
    user.value.email || 'Unknown User'
  )

  if (result.error) {
    error.value = result.error.message
  } else {
    // スレッド作成成功時はスレッド一覧ページにリダイレクト
    await navigateTo('/thread')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">スレッド作成</h1>

    <v-alert v-if="error" type="error" :text="error" variant="tonal"></v-alert>

    <ThreadForm
      :submit-button-text="loading ? '作成中...' : '作成'"
      :disabled="loading"
      @submit="createThreadHandler"
    />
  </div>
</template>
