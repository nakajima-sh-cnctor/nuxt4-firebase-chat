<script setup lang="ts">
interface Props {
  loading: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <!-- ローディング状態 -->
    <div v-if="props.loading" class="loading">
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
