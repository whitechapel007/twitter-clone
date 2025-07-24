<template>
  <div class="h-full text-gray-900 dark:text-text-black transition-colors duration-500" :class="backgroundClasses">
    <postMainContentHeader>
      <ul class="flex justify-around w-full p-4">
        <li v-for="(tab, index) in tabs" :key="tab.id"
          class="relative cursor-pointer py-3 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
          :class="{
            'text-gray-50 dark:text-white font-semibold': activeTab === index,
          }" @click="setActiveTab(index)">
          {{ tab.name }}
          <!-- Blue underline for active tab -->
          <div v-if="activeTab === index" class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
        </li>
      </ul>
    </postMainContentHeader>
    <PostTweetContainer />
    <postTweetFeed />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

// Define tabs data
const tabs = [
  { id: "for-you", name: "For you" },
  { id: "following", name: "Following" },
  { id: "cpp-twitter", name: "C++ Twitter" },
];

// Active tab state (default to first tab)
const activeTab = ref(0);

// Scroll tracking
const scrollY = ref(0);

// Function to set active tab
const setActiveTab = (index: number) => {
  const tab = tabs[index];
  if (tab && index >= 0 && index < tabs.length) {
    activeTab.value = index;
    console.log(`Switched to tab: ${tab.name}`);
  }
};

// Computed background classes based on scroll position
const backgroundClasses = computed(() => {
  const maxScroll = 300; // Maximum scroll distance for full effect
  const opacity = Math.min(scrollY.value / maxScroll, 1);

  // Gradually darken background as user scrolls
  if (opacity < 0.2) {
    return "bg-gray-100 dark:bg-dim-700";
  } else if (opacity < 0.4) {
    return "bg-gray-200 dark:bg-gray-800";
  } else if (opacity < 0.6) {
    return "bg-gray-300 dark:bg-gray-850";
  } else if (opacity < 0.8) {
    return "bg-gray-400 dark:bg-gray-900";
  } else {
    return "bg-gray-500 dark:bg-black";
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

// Authentication is handled by the global middleware
// No need for manual token refresh here
</script>
