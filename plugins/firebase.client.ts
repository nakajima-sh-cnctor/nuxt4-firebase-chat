import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // 環境変数が設定されていない場合はエラーを表示
  if (!config.public.firebase?.apiKey || config.public.firebase.apiKey === 'your-api-key') {
    console.log('現在の設定:', config.public.firebase)
    console.error('Firebase設定が正しく設定されていません。.envファイルを確認してください。')
    return {
      provide: {
        auth: null as any
      }
    }
  }
  
  const firebaseConfig = {
    apiKey: (config.public.firebase as any)?.apiKey,
    authDomain: (config.public.firebase as any)?.authDomain,
    projectId: (config.public.firebase as any)?.projectId,
    storageBucket: (config.public.firebase as any)?.storageBucket,
    messagingSenderId: (config.public.firebase as any)?.messagingSenderId,
    appId: (config.public.firebase as any)?.appId
  }

  // Firebase初期化
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  return {
    provide: {
      auth
    }
  }
}) 