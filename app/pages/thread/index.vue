<script setup lang="ts">
const { getThreads } = useThreadStore()
const { loading } = toRefs(useThreadStore())
const { formatRelativeTime } = useDateFormat()

const threads = ref<Thread[]>([])

// ページ読み込み時にスレッド一覧を取得
onMounted(async () => {
  const { threads: fetchedThreads } = await getThreads()
  threads.value = fetchedThreads
})

// スレッド詳細ページに遷移
const goToThread = (threadId: string) => {
  navigateTo(`/thread/${threadId}`)
}
</script>

<template>
  <v-container>
    <!-- ヘッダー -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div
          class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between gap-4"
        >
          <div class="flex-grow-1">
            <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
              スレッド一覧
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              みんなのスレッドをチェックしよう
            </p>
          </div>
          <div class="flex-shrink-0">
            <v-btn
              color="primary"
              size="large"
              block
              class="d-md-inline-block"
              @click="navigateTo('/thread/create')"
            >
              スレッド作成
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- ローディング状態 -->
    <v-row v-if="loading">
      <v-col cols="12">
        <div class="text-center py-12">
          <v-progress-circular color="primary" indeterminate size="64" />
          <p class="text-body-1 mt-4">スレッドを読み込み中...</p>
        </div>
      </v-col>
    </v-row>

    <!-- スレッド一覧 -->
    <v-row v-else-if="threads.length > 0">
      <v-col v-for="thread in threads" :key="thread.id" cols="12" md="6" lg="4">
        <v-card class="h-100 thread-card" hover @click="goToThread(thread.id)">
          <v-card-title class="text-h6 pb-2">
            {{ thread.title }}
          </v-card-title>

          <v-card-text class="pt-0">
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ thread.description }}
            </p>

            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-avatar size="32" class="me-2">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
                <span class="text-body-2">{{ thread.authorName }}</span>
              </div>

              <div class="text-caption text-medium-emphasis">
                {{ formatRelativeTime(thread.createdAt) }}
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-spacer />
            <v-btn
              variant="text"
              color="primary"
              size="small"
              prepend-icon="mdi-arrow-right"
            >
              詳細を見る
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- スレッドが存在しない場合 -->
    <v-row v-else>
      <v-col cols="12">
        <div class="text-center py-12">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">
            mdi-forum-outline
          </v-icon>
          <h3 class="text-h5 mb-2">スレッドがありません</h3>
          <p class="text-body-1 text-medium-emphasis mb-6">
            最初のスレッドを作成してみましょう！
          </p>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="navigateTo('/thread/create')"
          >
            スレッドを作成
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.thread-card {
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.thread-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>
