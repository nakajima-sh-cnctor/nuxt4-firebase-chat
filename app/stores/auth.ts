import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updatePassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type Auth,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const { $auth } = useNuxtApp()
  const auth = $auth as Auth | null
  const user = ref<User | null>(null)
  const loading = ref(false)
  let unsubscribe: (() => void) | null = null

  // 認証リスナーを開始
  const startAuthListener = () => {
    loading.value = true
    if (!auth || unsubscribe) {
      loading.value = false
      return
    }

    unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      user.value = currentUser
      loading.value = false

      // ユーザーが未認証の場合、ログインページにリダイレクト
      if (!currentUser) {
        navigateTo('/login')
      } else {
        // ユーザーが認証された場合、プロフィールを取得
        const profileStore = useProfileStore()
        await profileStore.getProfile(currentUser.uid)
      }
    })
  }

  // ログイン
  const login = async (email: string, password: string) => {
    if (!auth) {
      return {
        user: null,
        error: new Error('Firebase認証が初期化されていません'),
      }
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  // サインアップ
  const signup = async (email: string, password: string) => {
    loading.value = true
    if (!auth) {
      return {
        user: null,
        error: new Error('Firebase認証が初期化されていません'),
      }
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    } finally {
      loading.value = false
    }
  }

  // ログアウト
  const logout = async () => {
    loading.value = true
    if (!auth) {
      return { error: new Error('Firebase認証が初期化されていません') }
    }
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    } finally {
      loading.value = false
    }
  }

  // 認証リスナーを停止（メモリリーク防止）
  const stopAuthListener = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // パスワード変更
  const changePassword = async (newPassword: string) => {
    if (!auth || !user.value) {
      return {
        error: new Error('ユーザーが認証されていません'),
      }
    }
    try {
      await updatePassword(user.value, newPassword)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // ストアが破棄される際にリスナーをクリーンアップ
  onScopeDispose(() => {
    stopAuthListener()
  })

  return {
    // ユーザー関連
    user,
    loading,
    // 認証関連
    signup,
    login,
    startAuthListener,
    stopAuthListener,
    logout,
    changePassword,
  }
})
