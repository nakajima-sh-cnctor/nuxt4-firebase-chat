import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // 環境変数が設定されていない場合はエラーを表示
  if (!config.public.firebase?.apiKey || config.public.firebase.apiKey === 'your-api-key') {
    console.log('現在の設定:', config.public.firebase)
    console.error('Firebase設定が正しく設定されていません。.envファイルを確認してください。')
    return {
      provide: {
        auth: null as Auth | null
      }
    }
  }
  
  const firebaseConfig: FirebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId
  }

  // Firebase初期化
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  return {
    provide: {
      auth: auth as Auth | null
    }
  }
}) 