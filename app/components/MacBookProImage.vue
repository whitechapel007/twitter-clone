<template>
  <div
    class="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
    <!-- MacBook Pro Illustration -->
    <div class="relative">
      <!-- Laptop Base -->
      <div
        class="w-80 h-52 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-2xl transform perspective-1000 rotate-x-12">
        <!-- Screen -->
        <div
          class="absolute -top-44 left-2 right-2 h-44 bg-black rounded-t-lg border-2 border-gray-300 dark:border-gray-600 shadow-xl">
          <!-- Screen Content -->
          <div class="w-full h-full bg-black rounded-t-lg flex items-center justify-center overflow-hidden">
            <!-- Apple Logo with M4 text -->
            <div class="text-center">
              <div class="text-white text-6xl font-bold mb-2 tracking-wider">
                M4
              </div>
              <div class="text-gray-400 text-sm">
                MacBook Pro
              </div>
            </div>
          </div>

          <!-- Screen Bezel -->
          <div class="absolute inset-0 rounded-t-lg border border-gray-800"></div>
        </div>

        <!-- Keyboard Area -->
        <div class="absolute top-4 left-4 right-4 bottom-8 bg-gray-200 dark:bg-gray-700 rounded">
          <!-- Keyboard Keys (simplified) -->
          <div class="grid grid-cols-12 gap-1 p-2">
            <div v-for="i in 48" :key="i" class="h-2 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
          </div>

          <!-- Trackpad -->
          <div
            class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-10 bg-gray-300 dark:bg-gray-600 rounded border border-gray-400 dark:border-gray-500">
          </div>
        </div>

        <!-- Laptop Hinge -->
        <div
          class="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full">
        </div>
      </div>

      <!-- Reflection/Shadow -->
      <div
        class="absolute top-full left-0 right-0 h-20 bg-gradient-to-b from-gray-200/30 to-transparent dark:from-gray-700/30 transform scale-y-50 origin-top blur-sm">
      </div>
    </div>

    <!-- Floating Elements -->
    <div
      class="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full backdrop-blur-sm">
      Latest Model
    </div>

    <div
      class="absolute bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full backdrop-blur-sm">
      Giveaway
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this static illustration
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.rotate-x-12 {
  transform: rotateX(12deg);
}
</style>
