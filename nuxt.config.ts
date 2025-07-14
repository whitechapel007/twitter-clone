import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/image", "@nuxt/test-utils", "@nuxt/eslint"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    // Private keys (only available on server-side)
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    // Public keys (exposed to client-side)
    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    }
  },
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@prisma/client", ".prisma/client"],
    },
    define: {
      global: "globalThis",
    },
    ssr: {
      external: ["@prisma/client", ".prisma/client"],
    },
    build: {
      rollupOptions: {
        external: ["@prisma/client", ".prisma/client"],
      },
    },
  },
  // Suppress Vue Router warnings for API routes
  router: {
    options: {
      strict: false,
    },
  },
  // Nitro configuration for server-side only modules
  nitro: {
    experimental: {
      wasm: true,
    },
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    externals: {
      inline: [],
    },
    rollupConfig: {
      external: ["@prisma/client", ".prisma/client"],
    },
  },
  // Build configuration
  build: {
    transpile: ["@prisma/client"],
  },
  // Ensure Prisma is only used server-side
  ssr: true,
});
