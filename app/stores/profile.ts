import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type Firestore,
} from 'firebase/firestore'

export interface ProfileData {
  nickname: string
  age: number
  gender: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export const useProfileStore = defineStore('profile', () => {
  const { $firestore } = useNuxtApp()
  const firestore = $firestore as Firestore | null
  const loading = ref(false)
  const profile = ref<ProfileData | null>(null)

  // プロフィール取得
  const getProfile = async (userId: string) => {
    loading.value = true
    if (!firestore) {
      console.error('Firestoreが初期化されていません')
      return { data: null, error: new Error('Firestoreが初期化されていません') }
    }
    try {
      const profileDoc = await getDoc(doc(firestore, 'profiles', userId))
      if (profileDoc.exists()) {
        const profileData = profileDoc.data() as ProfileData
        profile.value = profileData
        return { data: profileData, error: null }
      } else {
        return { data: null, error: new Error('プロフィールが見つかりません') }
      }
    } catch (error) {
      console.error(error)
      return { data: null, error: error as Error }
    } finally {
      loading.value = false
    }
  }

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
      await getProfile(userId)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      loading.value = false
    }
  }

  // プロフィール更新
  const updateProfile = async (
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
      const profileData = {
        nickname,
        age: parseInt(age),
        gender,
        updatedAt: new Date(),
      }
      await updateDoc(doc(firestore, 'profiles', userId), profileData)
      await getProfile(userId)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      loading.value = false
    }
  }

  return { loading, profile, getProfile, saveProfile, updateProfile }
})
