import { useAsyncCallback } from "@react-hooks-library/core";
import { ToastNotification } from "components";
import { MainEvent } from "interface/Event/main-event.interface";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import webClient from "utils/webclient";

export const useCreateEvent = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(
    async (values: Partial<MainEvent> & { note?: string }) => {
      try {
        const { data } = await webClient.post("/event", values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId="toast.success.add-event.title"
            messageId="toast.success.add-event.message"
          />,
          { duration: 1500, position: "top-right" }
        );
      } catch (error: any) {
        const code = error.response.data.code
          ? error.response.data.code.toLowerCase()
          : null;
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={`toast.error.${code ? code : "default"}.title`}
            messageId={`toast.error.${code ? code : "default"}.message`}
          />,
          { duration: 1500, position: "top-right" }
        );
        console.error(error);
        return error.response;
      }
    }
  );
};
