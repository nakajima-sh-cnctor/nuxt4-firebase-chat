<script setup lang="ts">
import AuthLoading from '~/components/AuthLoading.vue'
import { useAuthStore } from '~/stores/auth'

const { startAuthListener, stopAuthListener } = useAuthStore()
const { loading } = toRefs(useAuthStore())

onMounted(async () => {
  startAuthListener()

  // 認証状態の確認とリダイレクト
  await nextTick()

  if (!loading.value) {
    // ログイン済みの場合はhomeページにリダイレクト
    await navigateTo('/home')
  }
})

onUnmounted(() => {
  stopAuthListener()
})
</script>

<template>
  <AuthLoading :loading="loading" />
</template>
