<script setup lang="ts">
import AuthForm from '~/components/AuthForm.vue'

const { login } = useAuth()

const error = ref('')

const loginSubmit = async (data: { email: string; password: string }) => {
  error.value = ''
  const result = await login(data.email, data.password)

  if (result.error) {
    error.value = result.error.message
  } else {
    // ログイン成功時にindexページに遷移
    await navigateTo('/home')
  }
}
</script>

<template>
  <v-card class="mx-auto my-8" max-width="400">
    <v-card-item>
      <v-card-title> ログイン認証 </v-card-title>
      <v-card-subtitle>
        Firebaseによる”メールアドレス/パスワード”による認証
      </v-card-subtitle>
    </v-card-item>
    <v-card-item>
      <v-btn
        variant="text"
        color="primary"
        class="ma-0 pa-0"
        @click="navigateTo('/signup')"
      >
        サインアップ
      </v-btn>
      <v-alert
        v-if="error"
        type="error"
        :text="error"
        variant="tonal"
      ></v-alert>
      <AuthForm class="my-4" btn-label="ログイン" @submit="loginSubmit" />
    </v-card-item>
  </v-card>
</template>
