import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import toast from "react-hot-toast";
import { ToastNotification } from "../../components";

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
          messageId={`confirm-sms.toast.error.${error.response.data.code}}.message`}
        />
      );
    }
  });
};

export const useVerifySMS = () => {
  return useAsyncCallback(async (code: string) => {
    try {
      await webClient.post("sms/confirm-verification", { code });
      toast.custom(
        <ToastNotification
          status="success"
          titleId={"confirm-sms.toast.success.title"}
          messageId={"confirm-sms.toast.success.message"}
        />
      );
    } catch (error: any) {
      console.error(error);
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`confirm-sms.toast.error.${error.response.data.code}.title`}
          messageId={`confirm-sms.toast.error.${error.response.data.code}}.message`}
        />
      );
    }
  });
};
