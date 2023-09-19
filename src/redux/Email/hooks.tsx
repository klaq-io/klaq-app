import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { ToastNotification } from "components";
import toast from "react-hot-toast";
import { useInitiateSMSVerification } from "../SMS/hooks";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const [, initiateSMSVerification] = useInitiateSMSVerification();

  return useAsyncCallback(async (token: string) => {
    try {
      const res = await webClient.post("email-confirmation/confirm", { token });
      toast.custom(
        <ToastNotification
          status="success"
          titleId={`toast.success.confirmed-email.title`}
          messageId={`toast.success.confirmed-email.message`}
        />
      );
      navigate(PATHS.CONFIRM_SMS);
    } catch (error: any) {
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : "default";
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.${code}.title`}
          messageId={`toast.error.${code}.message`}
        />,
        { duration: 1500, position: "top-right" }
      );
      console.error(error);
      return error.response;
    }
  });
};

export const useResendVerificationEmail = () => {
  return useAsyncCallback(async () => {
    try {
      await webClient.post("email-confirmation/resend-confirmation-link");
      toast.custom(
        <ToastNotification
          status="success"
          titleId={`toast.success.confirmed-email.title`}
          messageId={`toast.success.confirmed-email.message`}
        />
      );
    } catch (error: any) {
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : "default";
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.${code}.title`}
          messageId={`toast.error.${code}.message`}
        />,
        { duration: 1500, position: "top-right" }
      );
      console.error(error);
      return error.response;
    }
  });
};
