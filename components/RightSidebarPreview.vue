<template>
  <div
    class="bg-gray-200 rounded-lg dark:bg-gray-800 dark:border dark:border-border"
  >
    <div class="py-3 px-4 text-xl font-bold">{{ title }}</div>

    <slot />

    <div class="text-show-more cursor-pointer pb-3 px-4">Show more</div>
  </div>
</template>

<script setup lang="ts">
const { title } = defineProps<{
  title: string;
}>();
</script>
