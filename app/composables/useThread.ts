// Firebase Firestore関連のインポート
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  type Firestore,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore'
import { useNuxtApp } from 'nuxt/app'

// スレッドの型定義
export interface Thread {
  id?: string
  title: string
  description: string
  createdAt: Date | null
  updatedAt: Date | null
  authorId: string
  authorName: string
}

// スレッド関連のcomposable
export const useThread = () => {
  // NuxtアプリからFirestoreインスタンスを取得
  const { $firestore } = useNuxtApp()
  const firestore = $firestore as Firestore | null
  const loading = ref(false)

  // スレッドを作成する関数
  const createThread = async (
    title: string,
    description: string,
    authorId: string,
    authorName: string
  ) => {
    // Firestoreが初期化されているかチェック
    if (!firestore) {
      return {
        thread: null,
        error: new Error('Firestoreが初期化されていません'),
      }
    }

    try {
      loading.value = true
      // スレッドデータの作成
      const threadData = {
        title,
        description,
        authorId,
        authorName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Firestoreにスレッドを追加
      const docRef = await addDoc(collection(firestore, 'threads'), threadData)

      return {
        thread: {
          id: docRef.id,
          ...threadData,
          createdAt: null,
          updatedAt: null,
        } as Thread,
        error: null,
      }
    } catch (error) {
      return {
        thread: null,
        error: error as Error,
      }
    } finally {
      loading.value = false
    }
  }

  // スレッド一覧を取得する関数
  const getThreads = async () => {
    // Firestoreが初期化されているかチェック
    if (!firestore) {
      return {
        threads: [],
        error: new Error('Firestoreが初期化されていません'),
      }
    }

    try {
      // スレッドコレクションへの参照を作成
      const threadsRef = collection(firestore, 'threads')
      // 作成日時の降順でクエリを作成
      const q = query(threadsRef, orderBy('createdAt', 'desc'))
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q)

      // クエリ結果をThread型の配列に変換
      const threads: Thread[] = []
      querySnapshot.forEach((doc) => {
        threads.push({
          id: doc.id,
          ...doc.data(),
        } as Thread)
      })

      return {
        threads,
        error: null,
      }
    } catch (error) {
      return {
        threads: [],
        error: error as Error,
      }
    }
  }

  return {
    loading: readonly(loading),
    createThread,
    getThreads,
  }
}
