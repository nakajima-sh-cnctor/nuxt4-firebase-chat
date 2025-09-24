<script setup lang="ts">
const { createThread } = useThreadStore()
const error = ref('')

const handleSubmit = async (data: { title: string; description: string }) => {
  const { error: threadError } = await createThread(
    data.title,
    data.description
  )

  if (threadError) {
    error.value = threadError.message
    return
  }
  await navigateTo('/thread')
}
</script>

<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-item>
      <v-card-title> スレッド作成 </v-card-title>
    </v-card-item>
    <v-card-item>
      <v-alert
        v-if="error"
        type="error"
        :text="error"
        variant="tonal"
        class="mb-4"
      />
      <ThreadForm @submit="handleSubmit" />
    </v-card-item>
  </v-card>
</template>
