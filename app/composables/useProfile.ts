import { doc, setDoc, type Firestore } from 'firebase/firestore'
import { useNuxtApp } from 'nuxt/app'

export interface ProfileData {
  nickname: string
  age: number
  gender: string
  createdAt: Date
  updatedAt: Date
}

export const useProfile = () => {
  const { $firestore } = useNuxtApp()
  const firestore = $firestore as Firestore | null
  const loading = ref(false)

  // プロフィール保存
  const saveProfile = async (
    nickname: string,
    age: string,
    gender: string,
    userId: string
  ) => {
    loading.value = true
    if (!firestore) {
      return {
        error: new Error('Firestoreが初期化されていません'),
      }
    }
    try {
      const profileData: ProfileData = {
        nickname,
        age: parseInt(age),
        gender,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await setDoc(doc(firestore, 'profiles', userId), profileData)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      loading.value = false
    }
  }

  return {
    saveProfile,
    loading: readonly(loading),
  }
}
