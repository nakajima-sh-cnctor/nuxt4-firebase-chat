<script setup lang="ts">
import ThreadForm from '~/components/ThreadForm.vue'

const { user } = useAuth()
const { createThread, loading } = useThread()
const error = ref<string | null>(null)

const createThreadHandler = async (data: {
  title: string
  description: string
}) => {
  if (!user.value) {
    error.value = 'ユーザーが認証されていません'
    return
  }
  error.value = null

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
