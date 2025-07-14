export default defineNuxtPlugin(() => {
  // Only run on client side
  if (import.meta.server) {
    return
  }

  const { accessToken, checkAuth, user } = useAuth()

  // If we have a stored token, validate it and set up automatic refresh
  if (accessToken.value) {
    // If we don't have user data yet, validate the token in the background
    if (!user.value) {
      // Don't await this - let it run in the background
      checkAuth().catch((error) => {
        console.error('Failed to restore auth state:', error)
        // Token is invalid, it will be cleared by the checkAuth function
      })
    }

  }
})
