import { vi } from 'vitest'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      cloudinaryCloudName: 'test-cloud',
      cloudinaryApiKey: 'test-key',
    },
    cloudinaryApiSecret: 'test-secret',
  }),
  navigateTo: vi.fn(),
  createError: vi.fn((error) => error),
}))

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock process.env for tests
process.env.ACCESS_TOKEN_SECRET = 'test-access-secret'
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret'
process.env.NODE_ENV = 'test'
