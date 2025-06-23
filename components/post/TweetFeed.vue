<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-800">
    <TweetItem v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TweetItem from "./TweetItem.vue";

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

const tweets = ref<Tweet[]>([
  {
    id: "1",
    user: {
      name: "Donald J. Trump",
      username: "realDonaldTrump",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      verified: true,
      isBlueVerified: true,
    },
    content:
      "We have completed our very successful attack on the three Nuclear sites in Iran, including Fordow, Natanz, and Esfahan. All planes are now outside of Iran air space. A full payload of BOMBS was dropped on the primary site, Fordow. All planes are safely on their way home. Congratulations to our great American Warriors. There is not another military in the World that could have done this. NOW IS THE TIME FOR PEACE! Thank you for your attention to this matter.",
    timestamp: "10h",
    stats: {
      replies: 131000,
      retweets: 158000,
      likes: 877000,
      views: 139000000,
    },
  },
  {
    id: "2",
    user: {
      name: "Lucas",
      username: "edchucation",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      verified: true,
      isBlueVerified: true,
    },
    content:
      "I'm giving away a m4 MacBook Pro!\n\nComment \"m4\" or what you'll do with it",
    timestamp: "16h",
    stats: {
      replies: 1100,
      retweets: 93,
      likes: 1200,
      views: 136000,
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
        alt: "MacBook Pro M4",
      },
    ],
    quoteTweet: {
      user: {
        name: "hampton",
        username: "hamptonism",
        verified: true,
      },
      content: "Give a man an M4 chip, and he will change his life .",
      timestamp: "Jun 20",
    },
  },
]);
</script>
