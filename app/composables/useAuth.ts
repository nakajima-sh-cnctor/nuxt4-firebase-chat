import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from 'firebase/auth'
import { useNuxtApp } from 'nuxt/app'
// import { ref, onMounted, onUnmounted, readonly } from 'vue'

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const auth = $auth as Auth | null
  const user = ref<User | null>(null)
  const loading = ref(true)

  // 認証状態の監視
  onMounted(() => {
    // Firebase Authが初期化されていない場合は処理を終了
    if (!auth) {
      loading.value = false
      return
    }

    // Firebase Authの状態変更を監視するリスナーを設定
    // ユーザーのログイン・ログアウト状態が変更されるたびに実行される
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // ユーザーが未認証の場合、ログインページにリダイレクト
      if (!currentUser) {
        navigateTo('/login')
      }
      // 現在のユーザー情報をリアクティブな変数に保存
      user.value = currentUser
      // ローディング状態を解除
      loading.value = false
    })

    // コンポーネントがアンマウントされる際にリスナーを解除
    // メモリリークを防ぐためのクリーンアップ処理
    onUnmounted(() => unsubscribe())
  })

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

  return {
    user: readonly(user),
    loading: readonly(loading),
    login,
    signup,
    logout,
  }
}
