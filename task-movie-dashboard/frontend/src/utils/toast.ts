import toast from "react-hot-toast";

export const safeToast = {
  success: (message: unknown) => {
    const safeMessage = typeof message === "string" ? message : String(message);
    toast.success(safeMessage);
  },

  error: (message: unknown) => {
    let safeMessage: string;

    if (typeof message === "string") {
      safeMessage = message;
    } else if (message instanceof Error) {
      safeMessage = message.message;
    } else if (
      message &&
      typeof message === "object" &&
      message !== null &&
      "message" in message
    ) {
      safeMessage = String((message as { message: unknown }).message);
    } else {
      safeMessage = String(message);
    }

    toast.error(safeMessage);
  },

  loading: (message: unknown) => {
    const safeMessage = typeof message === "string" ? message : String(message);
    toast.loading(safeMessage);
  },
};
