<template>
  <!-- Header with dark mode toggle -->
  <header
    class="bg-gray-50 dark:bg-dim-800 border-b border-gray-200 dark:border-dim-700 p-4"
  >
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <SearchBar @search="handleSearch" />
    </div>
  </header>
</template>

<script setup lang="ts">
const handleSearch = (query: string) => {
  console.log("Search query:", query);
};
</script>
