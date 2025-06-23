import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/image", "@nuxt/test-utils", "@nuxt/eslint", "@prisma/nuxt"],
  css: ["~/assets/css/main.css"],
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
  },
  // Suppress Vue Router warnings for API routes
  router: {
    options: {
      strict: false,
    },
  },
});
