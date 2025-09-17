<script setup lang="ts">
interface Props {
  initialNickname?: string
  initialAge?: string
  initialGender?: string
  submitButtonText?: string
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialNickname: '',
  initialAge: '',
  initialGender: '',
  submitButtonText: '作成',
  isSubmitting: false,
})

const form = ref()

const nickname = ref(props.initialNickname)
const age = ref(props.initialAge)
const gender = ref(props.initialGender)

const nicknameRules = [(v: string) => !!v || 'ニックネームは必須です']
const ageRules = [
  (v: string) => !!v || '年齢は必須です',
  (v: string) => /^\d+$/.test(v) || '年齢は数字で入力してください',
  (v: string) => {
    const num = parseInt(v)
    return (num >= 0 && num <= 150) || '年齢は0〜150の範囲で入力してください'
  },
]
const genderRules = [(v: string) => !!v || '性別は必須です']

// 親コンポーネントへのイベント送信
const emit = defineEmits(['submit'])

const submit = async () => {
  if (form.value) {
    const { valid } = await form.value.validate()
    if (!valid) return
  }
  emit('submit', {
    nickname: nickname.value,
    age: age.value,
    gender: gender.value,
  })
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="nickname"
      color="primary"
      variant="underlined"
      label="ニックネーム"
      :rules="nicknameRules"
    />
    <v-text-field
      v-model="age"
      color="primary"
      variant="underlined"
      label="年齢"
      :rules="ageRules"
    />
    <v-select
      v-model="gender"
      color="primary"
      variant="underlined"
      label="性別"
      :rules="genderRules"
      :items="['男性', '女性', 'その他']"
    />

    <v-btn
      color="primary"
      class="mt-4"
      type="submit"
      block
      :loading="props.isSubmitting"
      :disabled="props.isSubmitting"
      >{{ props.submitButtonText }}</v-btn
    >
  </v-form>
</template>
