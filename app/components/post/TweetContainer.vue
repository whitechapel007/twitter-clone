<template>
  <div class="min-h-32 flex px-4 gap-2">
    <div class="pt-3">
      <img
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
        alt="User Avatar"
        class="w-10 h-10 rounded-full"
      />
    </div>

    <div class="flex-1 pt-2">
      <!-- Audience Selector -->
      <div class="relative mb-2">
        <button
          class="flex items-center space-x-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded-full transition-colors duration-200 border border-gray-200 dark:border-gray-700"
          v-if="showAudienceButton"
          @click="toggleAudienceDropdown"
        >
          <span class="text-sm font-semibold">{{ selectedAudience }}</span>
          <ChevronDownIcon class="w-4 h-4" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showAudienceDropdown"
          class="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          @click.stop
        >
          <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">
              Choose audience
            </h3>
          </div>
          <div class="py-2">
            <button
              v-for="option in audienceOptions"
              :key="option.value"
              class="w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              :class="{
                'bg-blue-50 dark:bg-blue-900/20':
                  selectedAudience === option.label,
              }"
              @click="selectAudience(option)"
            >
              <div class="flex-1">
                <div class="font-semibold text-gray-900 dark:text-white">
                  {{ option.label }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ option.description }}
                </div>
              </div>
              <div
                v-if="selectedAudience === option.label"
                class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
              >
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="py-3">
        <input
          type="text"
          placeholder="What's happening?"
          class="placeholder-gray-500 dark:placeholder-gray-400 placeholder:text-2xl w-full outline-0 dark:text-white"
          @focus="showAudienceButton = true"
        />
      </div>
      <div
        class="flex justify-between items-center border-y py-3 dark:border-border border-gray-200"
      >
        <div>
          <div class="flex gap-4">
            <div v-for="icon in tweetIcons" :key="icon.name">
              <component :is="icon.icon" class="w-5 h-5 text-show-more" />
            </div>
          </div>
        </div>
        <button
          class="dark:bg-button dark:text-black text-white bg-blue-500 px-4 py-2 rounded-full font-bold"
        >
          Post
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  PhotoIcon,
  GifIcon,
  GlobeAltIcon,
  ListBulletIcon,
  FaceSmileIcon,
  CalendarIcon,
  MapPinIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import { ref, onMounted, onUnmounted } from "vue";

// Dropdown state
const showAudienceDropdown = ref(false);
const selectedAudience = ref("Everyone");
const showAudienceButton = ref(false);

// Audience options
const audienceOptions = [
  { value: "everyone", label: "Everyone", description: "Anyone on or off X" },
  { value: "circle", label: "X Circle", description: "Only people you choose" },
  {
    value: "mentioned",
    label: "People you mention",
    description: "Only people you mention in your post",
  },
];

const toggleAudienceDropdown = () => {
  showAudienceDropdown.value = !showAudienceDropdown.value;
};

const selectAudience = (option: (typeof audienceOptions)[0]) => {
  selectedAudience.value = option.label;
  showAudienceDropdown.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    showAudienceDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const tweetIcons = [
  {
    name: "PhotoIcon",
    icon: PhotoIcon,
  },
  {
    name: "GifIcon",
    icon: GifIcon,
  },
  {
    name: "GlobeAltIcon",
    icon: GlobeAltIcon,
  },
  {
    name: "ListBulletIcon",
    icon: ListBulletIcon,
  },
  {
    name: "FaceSmileIcon",
    icon: FaceSmileIcon,
  },
  {
    name: "CalendarIcon",
    icon: CalendarIcon,
  },
  {
    name: "MapPinIcon",
    icon: MapPinIcon,
  },
];
</script>
