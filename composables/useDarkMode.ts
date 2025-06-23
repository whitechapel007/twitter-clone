export const useDarkMode = () => {
  // Reactive state for dark mode
  const isDark = ref(false);

  // Initialize dark mode state
  const initDarkMode = () => {
    if (typeof window === "undefined") return;

    // Use the approach from Tailwind CSS v4 docs
    const shouldBeDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    isDark.value = shouldBeDark;

    // Apply the class to document
    updateDarkModeClass();
  };

  // Update the dark mode class on the document
  const updateDarkModeClass = () => {
    if (typeof window === "undefined") return;

    if (isDark.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value;

    if (typeof window !== "undefined") {
      // Use the approach from Tailwind CSS v4 docs
      if (isDark.value) {
        localStorage.theme = "dark";
      } else {
        localStorage.theme = "light";
      }
      updateDarkModeClass();
    }
  };

  // Set dark mode explicitly
  const setDarkMode = (value: boolean) => {
    isDark.value = value;

    if (typeof window !== "undefined") {
      // Use the approach from Tailwind CSS v4 docs
      if (value) {
        localStorage.theme = "dark";
      } else {
        localStorage.theme = "light";
      }
      updateDarkModeClass();
    }
  };

  // Reset to system preference
  const resetToSystemPreference = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("theme");
      initDarkMode();
    }
  };

  // Listen for system preference changes
  const watchSystemPreference = () => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (!("theme" in localStorage)) {
        isDark.value = e.matches;
        updateDarkModeClass();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Return cleanup function
    return () => mediaQuery.removeEventListener("change", handleChange);
  };

  // Initialize on mount
  onMounted(() => {
    initDarkMode();
    const cleanup = watchSystemPreference();

    // Cleanup on unmount
    onUnmounted(() => {
      if (cleanup) cleanup();
    });
  });

  return {
    isDark: readonly(isDark),
    toggleDarkMode,
    setDarkMode,
    resetToSystemPreference,
  };
};
