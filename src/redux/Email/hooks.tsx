import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { ToastNotification } from "../../components";
import toast from "react-hot-toast";

export const useVerifyEmail = () => {
  return useAsyncCallback(async (token: string) => {
    try {
      const res = await webClient.post("email-confirmation/confirm", { token });
      toast.custom(
        <ToastNotification
          status="success"
          titleId={`confirm-mail.toast.success.title`}
          messageId={`confirm-mail.toast.success.message`}
        />
      );
    } catch (error: any) {
      console.error(error);
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`confirm-mail.toast.error.${error.response.data.code}.title`}
          messageId={`confirm-mail.toast.error.${error.response.data.code}.message`}
        />
      );
    }
  });
};

export const useResendVerificationEmail = () => {
  return useAsyncCallback(async () => {
    try {
      await webClient.post("email-confirmation/resend-confirmation-link");
    } catch (error: any) {
      console.error(error);
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`confirm-mail.toast.error.${error.response.data.code}.title`}
          messageId={`confirm-mail.toast.error.${error.response.data.code}.message`}
        />
      );
    }
  });
};
