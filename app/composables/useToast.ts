import { getCurrentInstance } from "vue";

// Simple wrapper around vue-toastification for easier usage
export const useToast = () => {
  const instance = getCurrentInstance();

  if (!instance) {
    console.warn(
      "useToast must be called within a Vue component setup function"
    );
    return {
      success: (message: string) => console.log("Success:", message),
      error: (message: string) => console.error("Error:", message),
      warning: (message: string) => console.warn("Warning:", message),
      info: (message: string) => console.info("Info:", message),
      clear: () => {},
      dismiss: () => {},
      toast: null,
    };
  }

  const toast = instance.appContext.app.config.globalProperties.$toast;

  if (!toast) {
    console.warn(
      "Toast plugin not found. Make sure vue-toastification is properly installed."
    );
    return {
      success: (message: string) => console.log("Success:", message),
      error: (message: string) => console.error("Error:", message),
      warning: (message: string) => console.warn("Warning:", message),
      info: (message: string) => console.info("Info:", message),
      clear: () => {},
      dismiss: () => {},
      toast: null,
    };
  }

  return {
    // Basic toast methods
    success: (message: string, options?: any) =>
      toast.success(message, options),
    error: (message: string, options?: any) => toast.error(message, options),
    warning: (message: string, options?: any) =>
      toast.warning(message, options),
    info: (message: string, options?: any) => toast.info(message, options),

    // Advanced methods
    clear: () => toast.clear(),
    dismiss: (id: number) => toast.dismiss(id),

    // Original toast instance for advanced usage
    toast,
  };
};
