export default defineNuxtRouteMiddleware(() => {
  const { startAuthListener } = useAuthStore()
  startAuthListener()
})
