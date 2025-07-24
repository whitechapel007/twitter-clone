import Toast, { POSITION, TYPE, type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    // Toast position
    position: POSITION.TOP_RIGHT,

    // Timeout duration (in milliseconds)
    timeout: 5000,

    // Close toast on click
    closeOnClick: true,

    // Pause timer when hovering
    pauseOnFocusLoss: true,
    pauseOnHover: true,

    // Show close button
    showCloseButtonOnHover: false,
    hideProgressBar: false,

    // Animation settings
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true,

    // Accessibility
    accessibility: {
      toastRole: "alert",
      closeButtonLabel: "Close toast",
    },

    // Custom toast defaults
    toastDefaults: {
      // Success toasts
      [TYPE.SUCCESS]: {
        timeout: 4000,
        hideProgressBar: false,
      },
      // Error toasts (longer duration)
      [TYPE.ERROR]: {
        timeout: 8000,
        hideProgressBar: false,
      },
      // Warning toasts
      [TYPE.WARNING]: {
        timeout: 6000,
        hideProgressBar: false,
      },
      // Info toasts
      [TYPE.INFO]: {
        timeout: 5000,
        hideProgressBar: false,
      },
    },
  };

  // Install the plugin
  nuxtApp.vueApp.use(Toast, options);
});
