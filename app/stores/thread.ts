import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore'

export interface Thread {
  id: string
  title: string
  description: string
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt: Date
}

export const useThreadStore = defineStore('thread', () => {
  const { $firestore } = useNuxtApp()
  const firestore = $firestore as Firestore | null
  const loading = ref(false)

  // スレッドを作成
  const createThread = async (title: string, description: string) => {
    if (!firestore) {
      return {
        thread: null,
        error: new Error('Firestoreが初期化されていません'),
      }
    }

    const authStore = useAuthStore()
    const profileStore = useProfileStore()

    if (!authStore.user || !profileStore.profile) {
      return {
        thread: null,
        error: new Error(
          'ユーザーが認証されていないか、プロフィールが設定されていません'
        ),
      }
    }

    loading.value = true
    try {
      const threadData = {
        title,
        description,
        authorId: authStore.user.uid,
        authorName: profileStore.profile.nickname,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(firestore, 'threads'), threadData)

      const newThread: Thread = {
        id: docRef.id,
        ...threadData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      return { thread: newThread, error: null }
    } catch (error) {
      return { thread: null, error: error as Error }
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

    loading.value = true
    try {
      const threadsQuery = query(
        collection(firestore, 'threads'),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(threadsQuery)
      const threadsList: Thread[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        threadsList.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          authorId: data.authorId,
          authorName: data.authorName,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        })
      })

      return { threads: threadsList, error: null }
    } catch (error) {
      return { threads: [], error: error as Error }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    createThread,
    getThreads,
  }
})
