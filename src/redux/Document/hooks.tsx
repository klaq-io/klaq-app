import { useAsyncCallback } from "@react-hooks-library/core";
import { ToastNotification } from "components";
import toast from "react-hot-toast";
import webClient from "utils/webclient";

export const useFetchDocumentUrl = () => {
  return useAsyncCallback(async (id: string) => {
    try {
      const response = await webClient.get(`/document/${id}`);
      return response.data;
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
