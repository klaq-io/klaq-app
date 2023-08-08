import { useAsyncCallback } from "@react-hooks-library/core";
import { useDispatch } from "react-redux";
import webClient from "../../utils/webclient";
import { CommentaryType, setCommentaries, setCommentary } from "./slices";

export const useFetchCommentaries = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async (eventId: string) => {
    try {
      const res = await webClient.get(`/commentary/${eventId}`);
      dispatch(setCommentaries(res.data));
    } catch (error: any) {
      console.log(error);
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
        console.log(error);
      }
    }
  );
};
