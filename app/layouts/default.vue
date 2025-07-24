<template>
  <div class="min-h-screen bg-gray-100 dark:bg-dim-900 text-gray-900 dark:text-white transition-colors duration-300">
    <!-- Main content -->
    <main class="grid grid-cols-12 mx-auto sm:px-2 lg:max-w-7xl">
      <!-- Left Sidebar -->

      <div
        class="col-span-2 hidden md:block xs:col-span-1 xl:col-span-2 sticky top-0 border-r border-border/20 dark:border-border">
        <Sidebar />
      </div>

      <!-- Main content -->
      <div class="col-span-12 md:col-span-8 xl:col-span-7 border-r border-border/20 dark:border-border border-b">
        <slot />
      </div>

      <div class="hidden md:block md:col-span-3 sticky top-0 ml-4">
        <RightSidebar />
      </div>
    </main>
  </div>
</template>
