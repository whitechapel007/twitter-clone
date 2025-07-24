<template>
  <div
    ref="headerRef"
    class="flex justify-between items-center max-h-14 border-b border-gray-200 dark:border-b-[rgb(47, 51, 54)] sticky top-0 z-10 transition-all duration-300 ease-out"
    :class="headerClasses"
    :style="headerStyle"
  >
    <h1 class="text-2xl font-bold">{{ title || "" }}</h1>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const { title = "" } = defineProps<{
  title?: string;
}>();

const headerRef = ref<HTMLElement>();
const scrollY = ref(0);

// Computed style that changes based on scroll position
const headerStyle = computed(() => {
  // Calculate opacity based on scroll position (0 to 1)
  const maxScroll = 200; // Maximum scroll distance for full effect
  const opacity = Math.min(scrollY.value / maxScroll, 1);

  // Create a darker background with increasing opacity
  const blurAmount = 8 + opacity * 4;

  return {
    backdropFilter: `blur(${blurAmount}px)`,
    "--tw-bg-opacity": (0.8 + opacity * 0.2).toString(),
  };
});

// Computed classes that change based on scroll position
const headerClasses = computed(() => {
  const maxScroll = 200;
  const opacity = Math.min(scrollY.value / maxScroll, 1);

  // Determine background darkness based on scroll
  if (opacity < 0.3) {
    return "bg-white/80 dark:bg-gray-900/60";
  } else if (opacity < 0.6) {
    return "bg-white/90 dark:bg-gray-900/75";
  } else {
    return "bg-white/95 dark:bg-black/85";
  }
});

// Handle scroll events
const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
