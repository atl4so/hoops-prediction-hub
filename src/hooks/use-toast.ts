import { toast } from "sonner";

export { toast };

type ToastMessage = string | { title?: string; description: string };

export const useToast = () => {
  return {
    toast: (message: ToastMessage) => {
      if (typeof message === 'string') {
        return toast(message);
      }
      return toast(message.title || '', {
        description: message.description,
      });
    },
    success: (message: ToastMessage) => {
      if (typeof message === 'string') {
        return toast.success(message);
      }
      return toast.success(message.title || '', {
        description: message.description,
      });
    },
    error: (message: ToastMessage) => {
      if (typeof message === 'string') {
        return toast.error(message);
      }
      return toast.error(message.title || '', {
        description: message.description,
      });
    },
    info: (message: ToastMessage) => {
      if (typeof message === 'string') {
        return toast.info(message);
      }
      return toast.info(message.title || '', {
        description: message.description,
      });
    },
  };
};