export default defineNuxtPlugin(() => {
  // Only run on client side
  if (import.meta.server) {
    return
  }

  const { accessToken, refreshToken, logout } = useAuth()

  // Create a custom $fetch instance with automatic token refresh
  const $fetchWithAuth = $fetch.create({
    onRequest({ options }) {
      // Add Authorization header if we have a token
      if (accessToken.value) {
        options.headers = new Headers({
          ...options.headers,
          'Authorization': `Bearer ${accessToken.value}`
        })
      }
    },

    async onResponseError({ response, request, options: _options }) {
      // If we get a 401 and it's not a login/register/refresh request, try to refresh token
      const isAuthRequest = request.toString().includes('/api/auth/login') ||
                           request.toString().includes('/api/auth/register') ||
                           request.toString().includes('/api/auth/refresh')

      if (response.status === 401 && !isAuthRequest) {
        try {
          console.log('Token expired, attempting refresh...')
          const refreshSuccess = await refreshToken()

          if (refreshSuccess && accessToken.value) {
            // Token refreshed successfully, but we need to let the caller retry
            // We can't easily retry here due to type constraints
            throw new Error('TOKEN_REFRESHED')
          } else {
            // Refresh failed, logout user
            await logout()
            throw new Error('Session expired. Please login again.')
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          await logout()
          throw error
        }
      }
    }
  })

  // Make the authenticated fetch available globally
  return {
    provide: {
      fetchWithAuth: $fetchWithAuth
    }
  }
})
