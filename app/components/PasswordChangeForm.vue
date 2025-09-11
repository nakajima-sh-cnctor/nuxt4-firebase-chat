<script setup lang="ts">
// フォームの状態管理
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrent = ref(false) // 現在のパスワード表示/非表示
const showNew = ref(false) // 新しいパスワード表示/非表示
const showConfirm = ref(false) // 確認パスワード表示/非表示
const form = ref()
const loading = ref(false) // ローディング状態

// バリデーションルールの定義
const passwordRules = [(v: string) => !!v || 'パスワードは必須です']

const newPasswordRules = [
  (v: string) => !!v || '新しいパスワードは必須です',
  (v: string) => v.length >= 6 || 'パスワードは6文字以上で入力してください',
]

const confirmPasswordRules = [
  (v: string) => !!v || 'パスワードの確認は必須です',
  (v: string) => v === newPassword.value || 'パスワードが一致しません',
]

// 親コンポーネントへのイベント送信
const emit = defineEmits(['submit'])

// フォーム送信処理
const submit = async () => {
  if (form.value) {
    // バリデーション実行
    const { valid } = await form.value.validate()
    if (!valid) return

    // ローディング状態を開始
    loading.value = true
    // 親コンポーネントにパスワード変更データを送信
    emit('submit', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })
    // ローディング状態を終了
    loading.value = false
  }
}
</script>

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
