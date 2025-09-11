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

export interface Thread {
  id?: string
  title: string
  description: string
  createdAt: Date | null
  updatedAt: Date | null
  authorId: string
  authorName: string
}

export const useThread = () => {
  const { $firestore } = useNuxtApp()
  const firestore = $firestore as Firestore | null
  const loading = ref(false)

  // スレッドを作成
  const createThread = async (
    title: string,
    description: string,
    authorId: string,
    authorName: string
  ) => {
    if (!firestore) {
      return {
        thread: null,
        error: new Error('Firestoreが初期化されていません'),
      }
    }

    try {
      loading.value = true
      const threadData = {
        title,
        description,
        authorId,
        authorName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

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

  // スレッド一覧を取得
  const getThreads = async () => {
    if (!firestore) {
      return {
        threads: [],
        error: new Error('Firestoreが初期化されていません'),
      }
    }

    try {
      const threadsRef = collection(firestore, 'threads')
      const q = query(threadsRef, orderBy('createdAt', 'desc'))
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q)

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
