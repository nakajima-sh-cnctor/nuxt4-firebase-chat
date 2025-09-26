import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getDatabase, type Database } from 'firebase/database'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  databaseURL: string
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // 環境変数が設定されていない場合はエラーを表示
  if (
    !config.public.firebase?.apiKey ||
    config.public.firebase.apiKey === 'your-api-key'
  ) {
    console.log('現在の設定:', config.public.firebase)
    console.error(
      'Firebase設定が正しく設定されていません。.envファイルを確認してください。'
    )
    return {
      provide: {
        auth: null as Auth | null,
        firestore: null as Firestore | null,
        database: null as Database | null,
      },
    }
  }

  const firebaseConfig: FirebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId,
    databaseURL: config.public.firebase.databaseURL,
  }

  // Firebase初期化
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const firestore = getFirestore(app)
  const database = getDatabase(app)

  return {
    provide: {
      auth: auth as Auth | null,
      firestore: firestore as Firestore,
      database: database as Database,
    },
  }
})
