import { ToastNotification } from "components";
import toast from "react-hot-toast";

type ToastStatus = "success" | "info" | "warning" | "danger";

export const KlaqToast = (
  status: ToastStatus,
  code?: string,
  duration?: number
) => {
  toast.custom(
    <ToastNotification
      titleId={`toast.${status === "danger" ? "error" : status}.${
        code ? code : "default"
      }.title`}
      messageId={`toast.${status === "danger" ? "error" : status}.${
        code ? code : "default"
      }.message`}
      status={status}
    />,
    { duration: duration || 1500, position: "top-right" }
  );
};
