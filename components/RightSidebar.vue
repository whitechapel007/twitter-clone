<template>
  <div class="hidden md:block col-span-2 sticky top-0 px-1 space-y-4">
    <div class="flex justify-end p-4">
      <DarkModeToggle />
    </div>
    <div class="sticky top-0 py-3">
      <SearchBar @search="handleSearch" />
    </div>

    <!-- Right Sidebar Content -->
    <div class="flex flex-col space-y-4">
      <RightSidebarPreview title="Live on X">
        <!-- Live Events -->
        <div class="">
          <div
            v-for="event in liveEvents"
            :key="event.id"
            class="rounded-lg transition-colors duration-200 cursor-pointer px-4 py-3"
          >
            <!-- Host Info -->
            <div class="flex items-center space-x-1 mb-2">
              <img
                :src="event.host.avatar"
                :alt="event.host.name"
                class="w-4 h-4 rounded-full flex-shrink-0"
              />
              <span
                class="font-semibold text-sm text-gray-900 dark:text-white truncate"
                >{{ event.host.name }}</span
              >
              <CheckBadgeIcon
                v-if="event.host.verified"
                class="w-3 h-3 text-blue-500"
              />
              <span
                class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                >{{ event.status }}</span
              >
            </div>

            <div class="flex justify-between items-center">
              <!-- Event Title -->
              <h3
                class="font-bold text-sm text-gray-900 dark:text-white leading-tight truncate"
              >
                {{ event.title }}
              </h3>

              <!-- Participants -->
              <div class="flex items-center justify-between">
                <!-- Listener Count -->
                <div
                  class="flex items-center bg-gray-600 dark:bg-gray-600 rounded-full px-2 py-1 space-x-1 min-w-[72px]"
                >
                  <div class="flex -space-x-1">
                    <img
                      v-for="(listener, index) in event.listeners.slice(0, 2)"
                      :key="index"
                      :src="listener.avatar"
                      :alt="listener.name"
                      class="w-6 h-6 rounded-full border aspect-auto"
                    />
                  </div>
                  <span class="text-xs font-medium text-white"
                    >+{{ event.listenerCount }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </RightSidebarPreview>
      <RightSidebarPreview title="What's happening">
        <!-- Trending Topics -->
        <div class="space-y-3">
          <div
            v-for="trend in trendingTopics"
            :key="trend.id"
            class="rounded-lg transition-colors duration-200 cursor-pointer group px-4 py-3"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <!-- Category and Location -->
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {{ trend.category
                  }}{{ trend.location ? ` · ${trend.location}` : "" }}
                </div>

                <!-- Trend Title -->
                <h3
                  class="font-bold text-sm text-gray-900 dark:text-white mb-1 truncate"
                >
                  {{ trend.title }}
                </h3>

                <!-- Post Count -->
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ trend.postCount }} posts
                </div>
              </div>

              <!-- More Options -->
              <div class="relative">
                <button
                  class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  @click.stop="toggleDropdown(trend.id)"
                >
                  <EllipsisHorizontalIcon class="w-4 h-4 text-gray-400" />
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="activeDropdown === trend.id"
                  class="absolute right-0 top-8 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  @click.stop
                >
                  <button
                    v-for="option in dropdownOptions"
                    :key="option.id"
                    class="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    @click="handleTrendAction(option.action, trend.id)"
                  >
                    <FaceFrownIcon
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    />
                    <span class="text-sm text-gray-900 dark:text-white">{{
                      option.label
                    }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RightSidebarPreview>
      <RightSidebarPreview title="Who to follow">
        <!-- Suggested Users -->
        <div class="space-y-3">
          <div
            v-for="user in suggestedUsers"
            :key="user.id"
            class="flex items-center justify-between p-2 rounded-lg transition-colors duration-200 px-4 py-3"
          >
            <div class="flex items-center space-x-3 flex-1">
              <!-- User Avatar -->
              <img
                :src="user.avatar"
                :alt="user.name"
                class="w-10 h-10 rounded-full flex-shrink-0"
              />

              <!-- User Info -->
              <div class="flex-1">
                <div class="flex items-center space-x-1">
                  <span
                    class="font-bold text-sm text-gray-900 dark:text-white truncate"
                    >{{ user.name }}</span
                  >
                  <CheckBadgeIcon
                    v-if="user.verified"
                    class="w-4 h-4 text-blue-500 flex-shrink-0"
                  />
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ user.username }}
                </div>
              </div>
            </div>

            <!-- Follow Button -->
            <button
              class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
            >
              Follow
            </button>
          </div>
        </div>
      </RightSidebarPreview>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckBadgeIcon,
  EllipsisHorizontalIcon,
  FaceFrownIcon,
} from "@heroicons/vue/24/solid";
import { ref, onMounted, onUnmounted } from "vue";

const handleSearch = (query: string) => {
  console.log("Search query:", query);
};

// Dropdown state management
const activeDropdown = ref<number | null>(null);

const toggleDropdown = (trendId: number) => {
  activeDropdown.value = activeDropdown.value === trendId ? null : trendId;
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

const handleTrendAction = (action: string, trendId: number) => {
  console.log(`Action: ${action} for trend ${trendId}`);
  closeDropdown();
};

// Dropdown options for trending topics
const dropdownOptions = [
  {
    id: 1,
    label: "The associated content is not relevant",
    action: "not_relevant",
  },
  {
    id: 2,
    label: "This trend is spam",
    action: "spam",
  },
  {
    id: 3,
    label: "This trend is abusive or harmful",
    action: "abusive",
  },
  {
    id: 4,
    label: "Not interested in this",
    action: "not_interested",
  },
  {
    id: 5,
    label: "This trend is a duplicate",
    action: "duplicate",
  },
  {
    id: 6,
    label: "This trend is harmful or spammy",
    action: "harmful_spammy",
  },
];

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Mock data for live events
const liveEvents = [
  {
    id: 1,
    host: {
      name: "Apst Johnson Suleman",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      verified: true,
    },
    status: "is hosting",
    title: "JCCF ANNUAL CONVENTION 2025 (The Glory Of The Lord)...",
    speaker: {
      name: "Crochet Creator",
      verified: true,
      status: "is speaking",
    },
    listeners: [
      {
        name: "User 1",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
      },
      {
        name: "User 2",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      },
      {
        name: "User 3",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      },
    ],
    listenerCount: 512,
  },
  {
    id: 2,
    host: {
      name: "Crochet Creator",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      verified: true,
    },
    status: "is hosting",
    title:
      "#MorningPUSHPrayers | June 22nd 2025 | #PRG | #UncleSola | #PushRelationshipGroup",
    speaker: {
      name: "Fashion Expert",
      verified: false,
      status: "is speaking",
    },
    listeners: [
      {
        name: "User 4",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
      },
      {
        name: "User 5",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face",
      },
      {
        name: "User 6",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face",
      },
    ],
    listenerCount: 15,
  },
];

// Mock data for trending topics
const trendingTopics = [
  {
    id: 1,
    category: "Trending in Nigeria",
    title: "Nursing",
    postCount: "9,483",
    location: null,
  },
  {
    id: 2,
    category: "Politics",
    title: "World War III",
    postCount: "38.9K",
    location: null,
  },
  {
    id: 3,
    category: "Politics",
    title: "Khamenei",
    postCount: "183K",
    location: null,
  },
  {
    id: 4,
    category: "Trending in Nigeria",
    title: "Terry G",
    postCount: "2,359",
    location: null,
  },
];

// Mock data for suggested users
const suggestedUsers = [
  {
    id: 1,
    name: "Princess Adeola",
    username: "@dearolaa",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 2,
    name: "Atem",
    username: "@AtemMBS",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    verified: true,
  },
  {
    id: 3,
    name: "Arsh Goyal",
    username: "@arsh_goyal",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    verified: true,
  },
];
</script>
