import { useToast as useVueToastification } from "vue-toastification";

// Simple wrapper around vue-toastification for easier usage
export const useToast = () => {
  const toast = useVueToastification();

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
