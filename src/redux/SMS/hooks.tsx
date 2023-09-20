import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import toast from "react-hot-toast";
import { ToastNotification } from "components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";

export const useInitiateSMSVerification = () => {
  return useAsyncCallback(async () => {
    try {
      await webClient.post("sms/initiate-verification");
      return;
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

export const useVerifySMS = () => {
  const navigate = useNavigate();
  return useAsyncCallback(async (code: string) => {
    try {
      await webClient.post("sms/confirm-verification", { code });
      toast.custom(
        <ToastNotification
          status="success"
          titleId={"toast.success.confirmed-sms.title"}
          messageId={"toast.success.confirmed-sms.message"}
        />,
        { duration: 1500, position: "top-right" }
      );
      navigate(PATHS.ONBOARDING_LEGAL_FORM_CHOICE);
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
