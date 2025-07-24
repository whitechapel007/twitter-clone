<template>
  <button
    class="p-2 rounded-full transition-colors duration-200"
    :class="[
      isDark
        ? 'bg-dim-800 text-dim-100 hover:bg-dim-700'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    ]"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleDarkMode"
  >
    <!-- Sun icon for light mode -->
    <SunIcon v-if="!isDark" class="w-5 h-5" />

    <!-- Moon icon for dark mode -->
    <MoonIcon v-else class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from "@heroicons/vue/24/solid";

const { isDark, toggleDarkMode } = useDarkMode();
</script>
