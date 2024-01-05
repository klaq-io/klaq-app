import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "utils/webclient";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ToastNotification } from "components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes";
import { NewQuote, Quote, QuoteStatus } from "interface/Quote/quote.interface";
import { KlaqToast } from "utils/KlaqToast";
import { setQuote, setQuotes } from "./slices";

export const useFetchQuote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (id?: string) => {
    try {
      const { data } = await webClient.get(`/quote/${id}`);
      dispatch(setQuote(data));
    } catch (error: any) {
      KlaqToast("danger", "quote-get-error");
      console.error(error);
      navigate(PATHS.QUOTES);
    }
  });
};

export const useFetchQuotes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async () => {
    try {
      const { data } = await webClient.get(`/quote`);
      dispatch(setQuotes(data));
    } catch (error: any) {
      KlaqToast("danger", "quote-get-error");
      console.error(error);
      navigate(PATHS.QUOTES);
    }
  });
};

export const useCreateQuote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (quote: NewQuote, eventId: string) => {
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
      navigate(PATHS.QUOTE_DETAILS);
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
    }
  });
};

export const useEditQuote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (quote: NewQuote, id: string) => {
    try {
      if (quote.orderFormId === "") delete quote.orderFormId;
      const { data } = await webClient.put(`/quote/${id}`, quote);
      dispatch(setQuote(data));
      navigate(PATHS.QUOTE + "/" + id + "/details");
      toast.custom(
        <ToastNotification
          status="success"
          titleId="toast.success.quote-edited.title"
          messageId="toast.success.quote-edited.message"
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
      console.error(error);
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
        console.error(error);
      }
    }
  );
};

export const useUpdateQuoteStatus = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async (quote: Quote, status: QuoteStatus) => {
    const currentStatus = quote.status;
    dispatch(setQuote({ ...quote, status }));

    try {
      const { data } = await webClient.put(`/quote/${quote.id}/status`, {
        status,
      });
    } catch (error: any) {
      dispatch(setQuote({ ...quote, status: currentStatus }));
      console.error(error);
    }
  });
};

export const useDownloadQuote = () => {
  return useAsyncCallback(async (quote: Quote) => {
    try {
      const { data } = await webClient.get(`/quote/${quote.id}/streamable`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quote.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
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
    }
  });
};

export const useGetQuoteBlob = () => {
  return useAsyncCallback(async (quoteId: string) => {
    try {
      const { data } = await webClient.get(`/quote/${quoteId}/streamable`, {
        responseType: "blob",
      });
      return data;
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
    }
  });
};
