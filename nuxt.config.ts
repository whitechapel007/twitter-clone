import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/image", "@nuxt/test-utils", "@nuxt/eslint"],
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    // Private keys (only available on server-side)
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    databaseUrl: process.env.DATABASE_URL,

    // Public keys (exposed to client-side)
    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
      apiBase:
        process.env.NODE_ENV === "production"
          ? process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "https://your-app.vercel.app" // Replace with your actual domain
          : "http://localhost:3000",
    },
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
    rollupConfig: {
      external: ["@prisma/client", ".prisma/client"],
    },
    // Vercel configuration
    vercel: {
      functions: {
        maxDuration: 30,
      },
    },
    // Ensure Prisma client is bundled properly
    moduleSideEffects: ["@prisma/client"],
    // Include Prisma in the bundle
    bundledStorage: ["@prisma/client"],
  },

  // Build configuration
  build: {
    transpile: ["@prisma/client", ".prisma/client"],
  },

  // Ensure Prisma is only used server-side
  ssr: true,
});
