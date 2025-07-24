// Ensure Nuxt auto-imports are properly typed
declare global {
  const definePageMeta: typeof import('#app/composables/router')['definePageMeta']
  const navigateTo: typeof import('#app/composables/router')['navigateTo']
  const useRoute: typeof import('#app/composables/router')['useRoute']
  const useRouter: typeof import('#app/composables/router')['useRouter']
  const useState: typeof import('#app/composables/state')['useState']
  const useNuxtApp: typeof import('#app/nuxt')['useNuxtApp']
  const useRuntimeConfig: typeof import('#app/nuxt')['useRuntimeConfig']
  const useFetch: typeof import('#app/composables/fetch')['useFetch']
  const $fetch: typeof import('#app/composables/fetch')['$fetch']
}

export {}
