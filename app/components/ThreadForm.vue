<script setup lang="ts">
const form = ref()
const title = ref('')
const description = ref('')

const titleRules = [(v: string) => !!v || 'タイトルは必須です']
const descriptionRules = [(v: string) => !!v || '概要は必須です']

const emit = defineEmits<{
  submit: [data: { title: string; description: string }]
}>()

const submit = async () => {
  const { valid } = await form.value.validate()
  console.log('valid', valid)
  if (valid) {
    console.log('submit')
    console.log(title.value)
    console.log(description.value)
    emit('submit', {
      title: title.value,
      description: description.value,
    })
  }
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="title"
      label="タイトル"
      variant="underlined"
      :rules="titleRules"
      required
    />

    <v-textarea
      v-model="description"
      label="概要"
      variant="underlined"
      :rules="descriptionRules"
      required
      rows="4"
    />

    <v-btn color="primary" class="mt-4" block type="submit">作成</v-btn>
  </v-form>
</template>
