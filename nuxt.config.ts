// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/main.css"],
  modules: ["@prisma/nuxt"],

  prisma: {
    client: {
      enable: false,
    },
    seed: false, // This prevents automatic db push
    autoSetupPrisma: false, // This prevents auto-setup prompts
    formatSchema: false,
    installCLI: false,
  },

  // Ensure TypeScript support and auto-imports
  typescript: {
    typeCheck: true,
  },

  // Define aliases for the lib folder outside app
  alias: {
    "@lib": fileURLToPath(new URL("./lib", import.meta.url)),
  },
  nitro: {
    // Nitro-specific configuration can go here
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@lib": fileURLToPath(new URL("./lib", import.meta.url)),
      },
    },
  },
});
