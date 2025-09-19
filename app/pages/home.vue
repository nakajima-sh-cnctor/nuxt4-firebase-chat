<script setup lang="ts">
import AuthLoading from '~/components/AuthLoading.vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['auth'], // もしくは 'auth'
})

const { loading } = toRefs(useAuthStore())
</script>

<template>
  <AuthLoading :loading="loading" />
</template>
