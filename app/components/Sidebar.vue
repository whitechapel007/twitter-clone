<template>
  <div class="space-y-2 bg-gray-100 dark:bg-dim-900 fixed top-0">
    <div class="flex items-center space-x-5 p-3  rounded-full  transition-colors duration-200  cursor-pointer">
      <div class="w-8 h-8">
        <Logo variant="black" />
      </div>
    </div>
    <div v-for="item in navigationItems" :key="item.name"
      class="flex items-center space-x-5 p-3 hover:bg-gray-900 rounded-full dark:hover:bg-gray-700 transition-colors duration-200 hover:text-white cursor-pointer"
      @click="handleNavigation(item)">
      <component :is="item.icon" class="w-8 h-8" />
      <span class="text-xl font-normal hidden xl:block">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BellIcon,
  BookmarkIcon,
  DocumentTextIcon,
  EllipsisHorizontalCircleIcon,
  HashtagIcon,
  HomeIcon,
  InboxIcon,
  UserIcon,
} from "@heroicons/vue/24/solid";

// Define navigation items with their icons and routes
const navigationItems = [
  {
    name: "Home",
    icon: HomeIcon,
    route: "/",
  },
  {
    name: "Explore",
    icon: HashtagIcon,
    route: "/explore",
  },
  {
    name: "Notifications",
    icon: BellIcon,
    route: "/notifications",
  },
  {
    name: "Messages",
    icon: InboxIcon,
    route: "/messages",
  },
  {
    name: "Bookmarks",
    icon: BookmarkIcon,
    route: "/bookmarks",
  },
  {
    name: "Lists",
    icon: DocumentTextIcon,
    route: "/lists",
  },
  {
    name: "Profile",
    icon: UserIcon,
    route: "/profile",
  },
  {
    name: "More",
    icon: EllipsisHorizontalCircleIcon,
    route: "/more",
  },
];

// Handle navigation click
const handleNavigation = (item: (typeof navigationItems)[0]) => {
  console.log(`Navigating to ${item.name}:`, item.route);
  // You can use navigateTo(item.route) here for actual navigation
  // navigateTo(item.route);
};
</script>
