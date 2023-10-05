import { useAsyncCallback } from "@react-hooks-library/core";
import { Quote, setQuote, setQuotes } from "./slices";
import webClient from "utils/webclient";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ToastNotification } from "components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes";

export const useFetchQuote = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async (id: string) => {
    try {
      const { data } = await webClient.get(`/quote/${id}`);
      dispatch(setQuote(data));
    } catch (error: any) {
      console.log(error);
    }
  });
};

export const useFetchQuotes = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async () => {
    try {
      const { data } = await webClient.get(`/quote`);
      dispatch(setQuotes(data));
    } catch (error: any) {
      console.log(error);
    }
  });
};

export const useCreateQuote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (quote: Partial<Quote>, eventId: string) => {
    try {
      const { data } = await webClient.post(`/quote/${eventId}`, quote);
      dispatch(setQuote(data));
      //TODO: toast
      toast.custom(
        <ToastNotification
          status="success"
          titleId="toast.success.quote-created.title"
          messageId="toast.success.quote-created.message"
        />,
        { duration: 2, position: "top-right" }
      );
      navigate(`/quote/send/${data.id}`);
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
      console.log(error);
    }
  });
};

export const useSendQuote = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(
    async (
      values: {
        subject: string;
        message: string;
        to: string;
        cc: boolean;
      },
      id: string
    ) => {
      try {
        const { data } = await webClient.post(`/quote/${id}/send`, values);
        dispatch(setQuote(data));
        toast.custom(
          <ToastNotification
            status="success"
            titleId="toast.success.quote-sent.title"
            messageId="toast.success.quote-sent.message"
          />,
          { duration: 2, position: "top-right" }
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
        console.log(error);
      }
    }
  );
};
