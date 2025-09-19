<script setup lang="ts">
import ProfileForm from '~/components/ProfileForm.vue'

const { saveProfile, loading } = useProfile()
const { user } = toRefs(useAuthStore())

const error = ref('')

const handleProfileSubmit = async (data: {
  nickname: string
  age: string
  gender: string
}) => {
  const { error: saveProfileError } = await saveProfile(
    data.nickname,
    data.age,
    data.gender,
    user.value?.uid ?? ''
  )

  if (saveProfileError) {
    error.value = saveProfileError.message
    return
  }

  // プロフィール保存成功後、ホームページにリダイレクト
  await navigateTo('/home')
}
</script>

<template>
  <v-card class="mx-auto my-8" max-width="500">
    <v-card-item>
      <v-card-title>プロフィール作成</v-card-title>
    </v-card-item>
    <v-card-item>
      <v-alert
        v-if="error"
        type="error"
        :text="error"
        variant="tonal"
        class="mb-4"
      />
      <ProfileForm :is-submitting="loading" @submit="handleProfileSubmit" />
    </v-card-item>
    <v-card-actions class="justify-center">
      <v-btn variant="text" color="primary" @click="navigateTo('/home')">
        ホームに戻る
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
