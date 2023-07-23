import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import toast from "react-hot-toast";
import { ToastNotification } from "../../components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";

export const useInitiateSMSVerification = () => {
  return useAsyncCallback(async () => {
    try {
      await webClient.post("sms/initiate-verification");
    } catch (error: any) {
      console.error(error);
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`confirm-sms.toast.error.${error.response.data.code}.title`}
          messageId={`confirm-sms.toast.error.${error.response.data.code}.message`}
        />,
        { duration: 1000, position: "top-right" }
      );
    }
  });
};

export const useVerifySMS = () => {
  const navigate = useNavigate();
  return useAsyncCallback(async (code: string) => {
    try {
      await webClient.post("sms/confirm-verification", { code });
      toast.custom(
        <ToastNotification
          status="success"
          titleId={"confirm-sms.toast.success.title"}
          messageId={"confirm-sms.toast.success.message"}
        />,
        { duration: 1000, position: "top-right" }
      );
      navigate(PATHS.ONBOARDING_LEGAL_FORM_CHOICE);
    } catch (error: any) {
      console.error(error);
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`confirm-sms.toast.error.${error.response.data.code}.title`}
          messageId={`confirm-sms.toast.error.${error.response.data.code}.message`}
        />,
        { duration: 1000, position: "top-right" }
      );
    }
  });
};
