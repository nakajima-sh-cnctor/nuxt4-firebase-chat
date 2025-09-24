<script setup lang="ts">
import AuthLoading from '~/components/AuthLoading.vue'
import { useAuthStore } from '~/stores/auth'

const { startAuthListener, stopAuthListener } = useAuthStore()
const { loading } = toRefs(useAuthStore())

onMounted(async () => {
  startAuthListener()
})
onUnmounted(() => {
  stopAuthListener()
})
</script>

<template>
  <AuthLoading :loading="loading" />
</template>
