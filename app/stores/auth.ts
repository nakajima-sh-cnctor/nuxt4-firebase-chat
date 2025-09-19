import {
  onAuthStateChanged,
  signOut,
  type User,
  type Auth,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const { $auth } = useNuxtApp()
  const auth = $auth as Auth | null
  const user = ref<User | null>(null)
  const loading = ref(true)
  let unsubscribe: (() => void) | null = null

  // 認証リスナーを開始
  const startAuthListener = () => {
    if (!auth || unsubscribe) return

    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser
      loading.value = false
      console.log(loading.value)

      // ユーザーが未認証の場合、ログインページにリダイレクト
      if (!currentUser) {
        navigateTo('/login')
      }
    })
  }

  // ログアウト
  const logout = async () => {
    if (!auth) {
      return { error: new Error('Firebase認証が初期化されていません') }
    }
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // 認証リスナーを停止（メモリリーク防止）
  const stopAuthListener = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // ストアが破棄される際にリスナーをクリーンアップ
  onScopeDispose(() => {
    stopAuthListener()
  })

  return {
    user,
    loading,
    startAuthListener,
    stopAuthListener,
    logout,
  }
})
