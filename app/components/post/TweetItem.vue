<template>
  <article
    ref="tweetRef"
    class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-300 cursor-pointer border-y dark:border-border border-gray-200"
    :class="tweetClasses"
  >
    <div class="flex space-x-3">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <img
          :src="tweet.user.avatar"
          :alt="`${tweet.user.name} avatar`"
          class="w-10 h-10 rounded-full"
        />
      </div>

      <!-- Tweet Content -->
      <div class="flex-1 min-w-0">
        <!-- Header -->
        <div class="flex items-center space-x-1 text-sm">
          <h3 class="font-bold text-gray-900 dark:text-white truncate">
            {{ tweet.user.name }}
          </h3>

          <!-- Verification badges -->
          <CheckBadgeIcon
            v-if="tweet.user.verified && tweet.user.isBlueVerified"
            class="w-4 h-4 text-blue-500 flex-shrink-0"
          />
          <CheckBadgeIcon
            v-else-if="tweet.user.verified"
            class="w-4 h-4 text-gray-500 flex-shrink-0"
          />

          <span class="text-gray-500 dark:text-gray-400 truncate">
            @{{ tweet.user.username }}
          </span>
          <span class="text-gray-500 dark:text-gray-400">·</span>
          <span class="text-gray-500 dark:text-gray-400 flex-shrink-0">
            {{ tweet.timestamp }}
          </span>
        </div>

        <!-- Tweet Text -->
        <div class="mt-1">
          <p class="text-gray-900 dark:text-white whitespace-pre-wrap">
            {{ tweet.content }}
          </p>
        </div>

        <!-- Media -->
        <div v-if="tweet.media && tweet.media.length > 0" class="mt-3">
          <div
            class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <!-- Special case for MacBook Pro giveaway -->
            <MacBookProImage v-if="tweet.media[0].alt === 'MacBook Pro M4'" />
            <img
              v-else-if="tweet.media[0].type === 'image'"
              :src="tweet.media[0].url"
              :alt="tweet.media[0].alt || 'Tweet image'"
              class="w-full h-auto max-h-96 object-cover"
            />
          </div>
        </div>

        <!-- Quote Tweet -->
        <div v-if="tweet.quoteTweet" class="mt-3">
          <div
            class="border border-gray-200 dark:border-gray-700 rounded-2xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
          >
            <div class="flex items-center space-x-1 text-sm mb-1">
              <span class="font-bold text-gray-900 dark:text-white">
                {{ tweet.quoteTweet.user.name }}
              </span>
              <CheckBadgeIcon
                v-if="tweet.quoteTweet.user.verified"
                class="w-4 h-4 text-blue-500"
              />
              <span class="text-gray-500 dark:text-gray-400">
                @{{ tweet.quoteTweet.user.username }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">·</span>
              <span class="text-gray-500 dark:text-gray-400">
                {{ tweet.quoteTweet.timestamp }}
              </span>
            </div>
            <p class="text-gray-900 dark:text-white text-sm">
              {{ tweet.quoteTweet.content }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex items-center justify-between max-w-md mt-3 text-gray-500 dark:text-gray-400"
        >
          <!-- Reply -->
          <button
            class="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200 group"
            @click.stop="handleReply"
          >
            <div
              class="p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-200"
            >
              <ChatBubbleOvalLeftIcon class="w-4 h-4" />
            </div>
            <span class="text-sm">{{ formatNumber(tweet.stats.replies) }}</span>
          </button>

          <!-- Retweet -->
          <button
            class="flex items-center space-x-1 hover:text-green-500 transition-colors duration-200 group"
            :class="{ 'text-green-500': isRetweeted }"
            @click.stop="handleRetweet"
          >
            <div
              class="p-2 rounded-full group-hover:bg-green-100 dark:group-hover:bg-green-900/20 transition-colors duration-200"
            >
              <ArrowPathRoundedSquareIcon class="w-4 h-4" />
            </div>
            <span class="text-sm">{{
              formatNumber(tweet.stats.retweets)
            }}</span>
          </button>

          <!-- Like -->
          <button
            class="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200 group"
            :class="{ 'text-red-500': isLiked }"
            @click.stop="handleLike"
          >
            <div
              class="p-2 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors duration-200"
            >
              <HeartIcon v-if="!isLiked" class="w-4 h-4" />
              <HeartIconSolid v-else class="w-4 h-4" />
            </div>
            <span class="text-sm">{{ formatNumber(tweet.stats.likes) }}</span>
          </button>

          <!-- Views -->
          <button
            class="hidden md:flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200 group"
            @click.stop="handleViews"
          >
            <div
              class="p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-200"
            >
              <ChartBarIcon class="w-4 h-4" />
            </div>
            <span class="text-sm">{{ formatNumber(tweet.stats.views) }}</span>
          </button>

          <!-- Share -->
          <button
            class="hidden md:flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200 group"
            @click.stop="handleShare"
          >
            <div
              class="p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-200"
            >
              <ArrowUpTrayIcon class="w-4 h-4" />
            </div>
          </button>

          <!-- Bookmark -->
          <button
            class="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200 group"
            :class="{ 'text-blue-500': isBookmarked }"
            @click.stop="handleBookmark"
          >
            <div
              class="p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors duration-200"
            >
              <BookmarkIcon v-if="!isBookmarked" class="w-4 h-4" />
              <BookmarkIconSolid v-else class="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

import {
  CheckBadgeIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  BookmarkIcon,
} from "@heroicons/vue/24/outline";

import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/vue/24/solid";


import MacBookProImage from "../MacBookProImage.vue";

interface Tweet {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    isBlueVerified?: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    replies: number;
    retweets: number;
    likes: number;
    views: number;
  };
  media?: {
    type: "image" | "video";
    url: string;
    alt?: string;
  }[];
  quoteTweet?: {
    user: {
      name: string;
      username: string;
      verified: boolean;
    };
    content: string;
    timestamp: string;
  };
}

const props = defineProps<{
  tweet: Tweet;
}>();

// Interactive states
const isLiked = ref(false);
const isRetweeted = ref(false);
const isBookmarked = ref(false);

// Scroll-based styling
const tweetRef = ref<HTMLElement>();
const scrollY = ref(0);

// Computed classes for scroll-based effects
const tweetClasses = computed(() => {
  const maxScroll = 500;
  const opacity = Math.min(scrollY.value / maxScroll, 1);

  // Subtle darkening effect as user scrolls
  if (opacity < 0.3) {
    return "";
  } else if (opacity < 0.6) {
    return "bg-gray-50/30 dark:bg-gray-800/20";
  } else {
    return "bg-gray-100/50 dark:bg-gray-700/30";
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

// Format numbers for display
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

// Action handlers
const handleReply = () => {
  console.log("Reply to tweet:", props.tweet.id);
  // Implement reply functionality
};

const handleRetweet = () => {
  isRetweeted.value = !isRetweeted.value;
  console.log("Retweet:", props.tweet.id, isRetweeted.value);
  // Implement retweet functionality
};

const handleLike = () => {
  isLiked.value = !isLiked.value;
  console.log("Like:", props.tweet.id, isLiked.value);
  // Implement like functionality
};

const handleViews = () => {
  console.log("Views for tweet:", props.tweet.id);
  // Implement views functionality
};

const handleShare = () => {
  console.log("Share tweet:", props.tweet.id);
  // Implement share functionality
};

const handleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  console.log("Bookmark:", props.tweet.id, isBookmarked.value);
  // Implement bookmark functionality
};
</script>
