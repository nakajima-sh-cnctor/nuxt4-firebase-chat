<template>
  <v-card class="mx-auto my-8" max-width="400">
    <v-card-item>
      <v-card-title> サインアップ </v-card-title>
      <v-card-subtitle>
        Firebaseによる”メールアドレス/パスワード”を登録を行う
      </v-card-subtitle>
    </v-card-item>
    <v-card-item>
      <v-btn
        variant="text"
        color="primary"
        class="ma-0 pa-0"
        @click="navigateTo('/login')"
      >
        ログイン
      </v-btn>
      <v-alert
        v-if="error"
        type="error"
        :text="error"
        variant="tonal"
      ></v-alert>
      <AuthForm
        class="my-4"
        btn-label="サインアップ"
        :loading="loading"
        @submit="signupSubmit"
      />
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import AuthForm from '~/components/AuthForm.vue'

const { signup, loading } = useAuth()

const error = ref('')

const signupSubmit = async (data: { email: string; password: string }) => {
  error.value = ''
  const result = await signup(data.email, data.password)

  if (result.error) {
    error.value = result.error.message
  } else {
    // ログイン成功時にindexページに遷移
    await navigateTo('/login')
  }
}
</script>
