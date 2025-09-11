<script setup lang="ts">
// プロパティの定義（ボタンラベルとローディング状態）
defineProps<{
  btnLabel: string
  loading?: boolean
}>()

// フォームの状態管理
const email = ref('')
const password = ref('')
const show2 = ref(false) // パスワード表示/非表示の切り替え
const form = ref()

// バリデーションルールの定義
const emailRules = [
  (v: string) => !!v || 'メールアドレスは必須です',
  (v: string) => /.+@.+\..+/.test(v) || 'メールアドレスが不正です',
]
const passwordRules = [
  (v: string) => !!v || 'パスワードは必須です',
  (v: string) => v.length >= 6 || 'パスワードは6文字以上で入力してください',
]

// 親コンポーネントへのイベント送信
const emit = defineEmits(['submit'])

// フォーム送信処理
const submit = async () => {
  if (form.value) {
    // バリデーション実行
    const { valid } = await form.value.validate()
    if (!valid) return
    // 親コンポーネントにフォームデータを送信
    emit('submit', { email: email.value, password: password.value })
  }
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="email"
      color="primary"
      variant="underlined"
      label="メールアドレス"
      :rules="emailRules"
      autocomplete="email"
    />
    <v-text-field
      v-model="password"
      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="passwordRules"
      :type="show2 ? 'text' : 'password'"
      label="パスワード"
      variant="underlined"
      autocomplete="current-password"
      @click:append="show2 = !show2"
    ></v-text-field>
    <v-btn
      :loading="loading"
      color="primary"
      class="mt-4"
      type="submit"
      block
      >{{ btnLabel }}</v-btn
    >
  </v-form>
</template>
