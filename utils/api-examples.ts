/**
 * Examples of how to use the authenticated API calls in your components
 */

// Example 1: Using fetchWithAuth from useAuth composable
export const exampleUsingUseAuth = async () => {
  const { fetchWithAuth } = useAuth()
  
  try {
    // This automatically adds Authorization headers and handles token refresh
    const tweets = await fetchWithAuth()('/api/tweets', {
      method: 'GET'
    })
    
    return tweets
  } catch (error) {
    console.error('Failed to fetch tweets:', error)
    throw error
  }
}

// Example 2: Using $fetchWithAuth directly in components
export const exampleUsingNuxtApp = async () => {
  const { $fetchWithAuth } = useNuxtApp()
  
  try {
    // Create a new tweet
    const newTweet = await $fetchWithAuth('/api/tweets', {
      method: 'POST',
      body: {
        content: 'Hello world!',
        mediaUrls: []
      }
    })
    
    return newTweet
  } catch (error) {
    console.error('Failed to create tweet:', error)
    throw error
  }
}

// Example 3: Using in a composable for tweets
export const useTweets = () => {
  const { fetchWithAuth } = useAuth()
  const tweets = ref([])
  const isLoading = ref(false)

  const fetchTweets = async () => {
    isLoading.value = true
    try {
      const response = await fetchWithAuth()('/api/tweets')
      tweets.value = response.tweets || []
    } catch (error) {
      console.error('Failed to fetch tweets:', error)
      tweets.value = []
    } finally {
      isLoading.value = false
    }
  }

  const createTweet = async (content: string, mediaUrls: string[] = []) => {
    try {
      const newTweet = await fetchWithAuth()('/api/tweets', {
        method: 'POST',
        body: { content, mediaUrls }
      })
      
      // Add to local tweets array
      tweets.value.unshift(newTweet)
      return newTweet
    } catch (error) {
      console.error('Failed to create tweet:', error)
      throw error
    }
  }

  return {
    tweets: readonly(tweets),
    isLoading: readonly(isLoading),
    fetchTweets,
    createTweet
  }
}

// Example 4: Using in a Vue component
/*
<script setup>
const { fetchWithAuth } = useAuth()
const userProfile = ref(null)

const loadProfile = async () => {
  try {
    userProfile.value = await fetchWithAuth()('/api/profile/me')
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

onMounted(() => {
  loadProfile()
})
</script>
*/
