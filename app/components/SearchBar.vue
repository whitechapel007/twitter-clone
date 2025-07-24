<template>
  <div class="relative w-full max-w-md">
    <div class="relative">
      <!-- Search Icon -->
      <div
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
      >
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>

      <!-- Input Field -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search"
        class="w-full bg-gray-200 dark:bg-gray-900 border border-gray-700 rounded-full py-1 pl-12 pr-4 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const searchQuery = ref("");

const emit = defineEmits<{
  search: [query: string];
  focus: [];
  blur: [];
}>();

const handleInput = () => {
  emit("search", searchQuery.value);
};

const handleFocus = () => {
  emit("focus");
};

const handleBlur = () => {
  emit("blur");
};
</script>
