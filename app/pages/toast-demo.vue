<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Toast Notification Demo
      </h1>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <!-- Basic Toast Types -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Basic Toast Types
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button @click="showSuccess"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
              Success
            </button>
            <button @click="showError"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors">
              Error
            </button>
            <button @click="showWarning"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors">
              Warning
            </button>
            <button @click="showInfo"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
              Info
            </button>
          </div>
        </div>

        <!-- Advanced Examples -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Advanced Examples
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button @click="showWithTitle"
              class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors">
              With Title
            </button>
            <button @click="showPersistent"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors">
              Persistent
            </button>
            <button @click="showWithActions"
              class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors">
              With Actions
            </button>
            <button @click="showLongDuration"
              class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors">
              Long Duration
            </button>
          </div>
        </div>

        <!-- Management -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Toast Management
          </h2>
          <div class="flex flex-wrap gap-4">
            <button @click="clearAll"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
              Clear All
            </button>
            <button @click="showMultiple"
              class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors">
              Show Multiple
            </button>
          </div>
        </div>

        <!-- Library Info -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">
            Using vue-toastification
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Professional toast notifications with animations, accessibility, and customization.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


const { success, error, warning, info, clear } = useToast();

// Basic toast examples
const showSuccess = () => {
  success("Operation completed successfully!");
};

const showError = () => {
  error("Something went wrong. Please try again.");
};

const showWarning = () => {
  warning("This action cannot be undone.");
};

const showInfo = () => {
  info("New features are available in the settings.");
};

// Advanced examples
const showWithTitle = () => {
  success("Account updated successfully!", {
    timeout: 6000,
  });
};

const showPersistent = () => {
  error("Critical system error detected.", {
    timeout: false, // Persistent toast
  });
};

const showWithActions = () => {
  warning("Your session will expire in 5 minutes.", {
    timeout: 10000,
    closeOnClick: false,
  });
};

const showLongDuration = () => {
  info("This toast will stay visible for 10 seconds.", {
    timeout: 10000,
  });
};

const showMultiple = () => {
  success("First notification");
  setTimeout(() => warning("Second notification"), 500);
  setTimeout(() => info("Third notification"), 1000);
  setTimeout(() => error("Fourth notification"), 1500);
};

const clearAll = () => {
  clear();
};

// Page meta
definePageMeta({
  title: "Toast Demo",
});



</script>
