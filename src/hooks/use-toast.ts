import { toast } from "sonner";

export { toast };

type ToastMessage = string | { title?: string; description: string };

export const useToast = () => {
  const showToast = (message: ToastMessage, type: 'default' | 'success' | 'error' | 'info' = 'default') => {
    if (typeof message === 'string') {
      switch (type) {
        case 'success':
          return toast.success(message);
        case 'error':
          return toast.error(message);
        case 'info':
          return toast.info(message);
        default:
          return toast(message);
      }
    }

    switch (type) {
      case 'success':
        return toast.success(message.title || '', {
          description: message.description,
        });
      case 'error':
        return toast.error(message.title || '', {
          description: message.description,
        });
      case 'info':
        return toast.info(message.title || '', {
          description: message.description,
        });
      default:
        return toast(message.title || '', {
          description: message.description,
        });
    }
  };

  return {
    toast: (message: ToastMessage) => showToast(message),
    success: (message: ToastMessage) => showToast(message, 'success'),
    error: (message: ToastMessage) => showToast(message, 'error'),
    info: (message: ToastMessage) => showToast(message, 'info'),
  };
};