<template>
  <div class="container">
    <!-- ローディング状態 -->
    <div v-if="loading" class="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4">認証状態を確認中...</p>
    </div>

    <!-- 認証済みユーザー -->
    <div v-else-if="user" class="authenticated">
      <v-card class="mx-auto" max-width="600">
        <v-card-item>
          <v-card-title class="text-center">
            ようこそ、{{ user.email }}さん！
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
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-title>ユーザーID</v-list-item-title>
                <v-list-item-subtitle>{{ user.uid }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-calendar</v-icon>
                </template>
                <v-list-item-title>アカウント作成日</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(user.metadata.creationTime) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>

        <v-card-actions class="justify-center">
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
    </div>

    <!-- 未認証ユーザー -->
    <div v-else class="unauthenticated">
      <v-card class="mx-auto" max-width="400">
        <v-card-item>
          <v-card-title class="text-center">ログインが必要です</v-card-title>
          <v-card-subtitle class="text-center">
            このページにアクセスするにはログインしてください
          </v-card-subtitle>
        </v-card-item>

        <v-card-actions class="justify-center">
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-login"
            @click="navigateTo('/login')"
          >
            ログイン
          </v-btn>
          <v-btn
            color="secondary"
            variant="outlined"
            prepend-icon="mdi-account-plus"
            @click="navigateTo('/signup')"
          >
            サインアップ
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, loading, logout } = useAuth()

const error = ref('')
const logoutLoading = ref(false)

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

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 4rem 0;
}

.authenticated {
  margin-top: 2rem;
}

.unauthenticated {
  margin-top: 4rem;
}

.user-info {
  margin-top: 1rem;
}
</style>
