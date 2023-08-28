import { useAsyncCallback } from "@react-hooks-library/core";
import { useDispatch } from "react-redux";
import webClient from "../../utils/webclient";
import { CommentaryType, setCommentaries, setCommentary } from "./slices";
import toast from "react-hot-toast";
import { ToastNotification } from "../../components";

export const useFetchCommentaries = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async (eventId: string) => {
    try {
      const res = await webClient.get(`/commentary/${eventId}`);
      dispatch(setCommentaries(res.data));
    } catch (error: any) {
      console.error(error);
    }
  });
};

export const useAddCommentary = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(
    async (eventId: string, text: string, type: CommentaryType) => {
      try {
        const res = await webClient.post(`/commentary/${eventId}`, {
          text,
          type,
        });
        dispatch(setCommentary(res.data));
        return res.data;
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
    }
  );
};
