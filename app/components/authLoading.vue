<script setup lang="ts">
const loading = ref(true)
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1500)
})
</script>

<template>
  <div>
    <!-- ローディング状態 -->
    <div v-if="loading" class="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4">認証状態を確認中...</p>
    </div>
    <div v-else>
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 4rem 0;
}
</style>
