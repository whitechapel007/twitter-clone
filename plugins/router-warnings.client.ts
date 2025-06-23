export default defineNuxtPlugin(() => {
  // Suppress Vue Router warnings for API routes in development
  if (process.dev) {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        message.includes('[Vue Router warn]') &&
        message.includes('/api/')
      ) {
        // Suppress API route warnings
        return;
      }
      originalWarn.apply(console, args);
    };
  }
});
