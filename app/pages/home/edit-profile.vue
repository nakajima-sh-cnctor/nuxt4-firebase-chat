<script setup lang="ts">
import ProfileForm from '~/components/ProfileForm.vue'

const { updateProfile, loading } = useProfileStore()
const { user } = toRefs(useAuthStore())
const { profile } = toRefs(useProfileStore())

const error = ref('')

const handleProfileSubmit = async (data: {
  nickname: string
  age: string
  gender: string
}) => {
  if (!user.value?.uid) {
    error.value = 'ユーザー情報が取得できません'
    return
  }

  const { error: updateProfileError } = await updateProfile(
    data.nickname,
    data.age,
    data.gender,
    user.value.uid
  )

  if (updateProfileError) {
    error.value = updateProfileError.message
    return
  }

  // プロフィール更新成功後、ホームページにリダイレクト
  await navigateTo('/home')
}
</script>

<template>
  <v-card class="mx-auto my-8" max-width="500">
    <v-card-item>
      <v-card-title>プロフィール編集</v-card-title>
    </v-card-item>
    <v-card-item>
      <v-alert
        v-if="error"
        type="error"
        :text="error"
        variant="tonal"
        class="mb-4"
      />

      <!-- プロフィール情報が読み込まれている場合のみフォームを表示 -->
      <ProfileForm
        v-if="profile"
        :initial-nickname="profile.nickname"
        :initial-age="profile.age.toString()"
        :initial-gender="profile.gender"
        submit-button-text="更新"
        :is-submitting="loading"
        @submit="handleProfileSubmit"
      />

      <!-- ローディング中の場合 -->
      <div v-else-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" />
        <p class="mt-4">プロフィール情報を読み込み中...</p>
      </div>
    </v-card-item>
    <v-card-actions class="justify-center">
      <v-btn variant="text" color="primary" @click="navigateTo('/home')">
        ホームに戻る
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
