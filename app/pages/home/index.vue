<script setup lang="ts">
// 認証関連のcomposableを使用
const { user, logout, loading } = useAuth()

// エラー状態とローディング状態の管理
const error = ref('')
const logoutLoading = ref(false)

// ログアウト処理
const handleLogout = async () => {
  error.value = ''
  logoutLoading.value = true

  try {
    const result = await logout()

    if (result.error) {
      error.value = result.error.message
    } else {
      // ログアウト成功時にログインページに遷移
      await navigateTo('/login')
    }
  } catch {
    error.value = 'ログアウト中にエラーが発生しました'
  } finally {
    logoutLoading.value = false
  }
}

// 日付フォーマット関数
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '不明'
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <!-- 認証済みユーザー -->
  <v-card v-if="!loading" class="mx-auto" max-width="600">
    <v-card-item>
      <v-card-title class="text-center">
        ようこそ、{{ user?.email }}さん！
      </v-card-title>
      <v-card-subtitle class="text-center">
        ログイン認証が完了しました
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-alert
        v-if="error"
        type="error"
        :text="error"
        variant="tonal"
        class="mb-4"
      ></v-alert>

      <div class="user-info">
        <v-list>
          <v-list-item>
            <template #prepend>
              <v-icon>mdi-email</v-icon>
            </template>
            <v-list-item-title>メールアドレス</v-list-item-title>
            <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>ユーザーID</v-list-item-title>
            <v-list-item-subtitle>{{ user?.uid }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-calendar</v-icon>
            </template>
            <v-list-item-title>アカウント作成日</v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate(user?.metadata.creationTime) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-account-edit"
        @click="navigateTo('/home/edit-profile')"
      >
        プロフィール編集
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-lock-reset"
        @click="navigateTo('/home/change-password')"
      >
        パスワード変更
      </v-btn>
      <v-btn
        color="error"
        variant="outlined"
        :loading="logoutLoading"
        prepend-icon="mdi-logout"
        @click="handleLogout"
      >
        ログアウト
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
