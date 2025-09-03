<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="currentPassword"
      :append-icon="showCurrent ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="passwordRules"
      :type="showCurrent ? 'text' : 'password'"
      label="現在のパスワード"
      variant="underlined"
      autocomplete="current-password"
      @click:append="showCurrent = !showCurrent"
    />
    <v-text-field
      v-model="newPassword"
      :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="newPasswordRules"
      :type="showNew ? 'text' : 'password'"
      label="新しいパスワード"
      variant="underlined"
      autocomplete="new-password"
      @click:append="showNew = !showNew"
    />
    <v-text-field
      v-model="confirmPassword"
      :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="confirmPasswordRules"
      :type="showConfirm ? 'text' : 'password'"
      label="新しいパスワード（確認）"
      variant="underlined"
      autocomplete="new-password"
      @click:append="showConfirm = !showConfirm"
    />
    <v-btn :loading="loading" color="primary" class="mt-4" type="submit" block>
      パスワードを変更
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const form = ref()
const loading = ref(false)

const passwordRules = [(v: string) => !!v || 'パスワードは必須です']

const newPasswordRules = [
  (v: string) => !!v || '新しいパスワードは必須です',
  (v: string) => v.length >= 6 || 'パスワードは6文字以上で入力してください',
]

const confirmPasswordRules = [
  (v: string) => !!v || 'パスワードの確認は必須です',
  (v: string) => v === newPassword.value || 'パスワードが一致しません',
]

const emit = defineEmits(['submit'])

const submit = async () => {
  if (form.value) {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true
    emit('submit', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })
    loading.value = false
  }
}
</script>
