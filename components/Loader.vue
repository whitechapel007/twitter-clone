<template>
  <span
    v-if="isLoading"
    class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"
  ></span>
</template>

<script setup lang="ts">
defineProps({ isLoading: Boolean });
</script>
