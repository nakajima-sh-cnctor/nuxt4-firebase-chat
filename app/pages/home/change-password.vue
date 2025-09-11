<script setup lang="ts">
// パスワード変更フォームコンポーネントをインポート
import PasswordChangeForm from '~/components/PasswordChangeForm.vue'

// 認証関連のcomposableを使用
const { changePassword } = useAuth()

// エラー状態と成功状態の管理
const error = ref('')
const success = ref(false)

// パスワード変更処理
const handlePasswordChange = async (data: {
  currentPassword: string
  newPassword: string
}) => {
  error.value = ''
  success.value = false

  try {
    const result = await changePassword(data.newPassword)

    if (result.error) {
      error.value = result.error.message
    } else {
      success.value = true
      // 3秒後にホームページにリダイレクト
      setTimeout(() => {
        navigateTo('/home')
      }, 3000)
    }
  } catch (err) {
    console.error(err)
    error.value = 'パスワード変更中にエラーが発生しました'
  }
}
</script>

<template>
  <v-card class="mx-auto my-8" max-width="500">
    <v-card-item>
      <v-card-title>パスワード変更</v-card-title>
      <v-card-subtitle>
        現在のパスワードを入力して、新しいパスワードに変更してください
      </v-card-subtitle>
    </v-card-item>
    <v-card-item>
      <v-alert
        v-if="error"
        type="error"
        :text="error"
        variant="tonal"
        class="mb-4"
      />
      <v-alert
        v-if="success"
        type="success"
        text="パスワードが正常に変更されました"
        variant="tonal"
        class="mb-4"
      />
      <PasswordChangeForm @submit="handlePasswordChange" />
      <div class="mt-4 text-center">
        <v-btn variant="text" color="primary" @click="navigateTo('/home')">
          ホームに戻る
        </v-btn>
      </div>
    </v-card-item>
  </v-card>
</template>
