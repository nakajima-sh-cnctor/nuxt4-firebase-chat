<script setup lang="ts">
interface Props {
  initialTitle?: string
  initialDescription?: string
  submitButtonText?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialTitle: '',
  initialDescription: '',
  submitButtonText: '作成',
  disabled: false,
})

const title = ref(props.initialTitle)
const description = ref(props.initialDescription)
const form = ref()

const titleRules = [(v: string) => !!v || 'スレッド名は必須です']
const descriptionRules = [(v: string) => !!v || 'スレッド概要は必須です']

const emit = defineEmits(['submit'])

const submit = async () => {
  if (form.value) {
    const { valid } = await form.value.validate()
    if (!valid) return
    emit('submit', { title: title.value, description: description.value })
  }
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="title"
      variant="underlined"
      color="primary"
      label="スレッド名"
      class="my-2"
      :rules="titleRules"
      :disabled="props.disabled"
    ></v-text-field>

    <v-textarea
      v-model="description"
      variant="underlined"
      color="primary"
      label="スレッド概要"
      class="my-2"
      :rules="descriptionRules"
      :disabled="props.disabled"
    ></v-textarea>

    <v-btn
      color="primary"
      block
      class="my-4"
      type="submit"
      :disabled="props.disabled"
      :loading="props.disabled"
    >
      {{ props.submitButtonText }}
    </v-btn>
  </v-form>
</template>
