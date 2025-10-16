<script setup lang="ts">
// 認証関連のcomposableを使用
const { logout } = useAuthStore()
const { user } = toRefs(useAuthStore())
const { profile } = toRefs(useProfileStore())

// 日付フォーマット用のcomposableを使用
const { formatDate } = useDateFormat()

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
</script>

<template>
  <!-- 認証済みユーザー -->
  <v-card class="mx-auto" max-width="600">
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

      <!-- プロフィール情報セクション -->
      <v-divider class="my-4"></v-divider>

      <div class="profile-section">
        <h3 class="text-h6 mb-3">プロフィール情報</h3>

        <!-- プロフィールエラー -->
        <div v-if="!profile">
          <v-alert
            type="warning"
            text="プロフィールが作成されていません。下のボタンからプロフィールを作成してください。"
            variant="tonal"
            class="mb-4"
          ></v-alert>

          <!-- プロフィール作成ボタン -->
          <div class="text-center">
            <v-btn
              color="primary"
              variant="elevated"
              prepend-icon="mdi-account-plus"
              @click="navigateTo('/home/create-profile')"
            >
              プロフィールを作成
            </v-btn>
          </div>
        </div>

        <!-- プロフィール情報表示 -->
        <v-list v-else-if="profile">
          <v-list-item>
            <template #prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>ニックネーム</v-list-item-title>
            <v-list-item-subtitle>{{ profile.nickname }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-cake</v-icon>
            </template>
            <v-list-item-title>年齢</v-list-item-title>
            <v-list-item-subtitle>{{ profile.age }}歳</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-gender-male-female</v-icon>
            </template>
            <v-list-item-title>性別</v-list-item-title>
            <v-list-item-subtitle>{{ profile.gender }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon>mdi-calendar-edit</v-icon>
            </template>
            <v-list-item-title>最終更新日</v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate(profile.updatedAt) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-forum"
        @click="navigateTo('/thread')"
      >
        掲示板一覧
      </v-btn>
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
