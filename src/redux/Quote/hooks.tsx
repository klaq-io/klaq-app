import { useAsyncCallback } from '@react-hooks-library/core';
import { ToastNotification } from 'components';
import { NewQuote, Quote, QuoteStatus } from 'interface/Quote/quote.interface';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'routes';
import { KlaqToast } from 'utils/KlaqToast';
import webClient from 'utils/webclient';
import { setQuote, setQuotes } from './slices';

export const useFetchQuote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (id?: string) => {
    try {
      const { data } = await webClient.get(`/quote/${id}`);
      dispatch(setQuote(data));
    } catch (error: any) {
      KlaqToast('danger', 'quote-get-error');
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
      KlaqToast('danger', 'quote-get-error');
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
        { duration: 2, position: 'top-right' },
      );
      navigate(`${PATHS.QUOTE}/${data.id}/details`);
    } catch (error: any) {
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : null;
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.${code ? code : 'default'}.title`}
          messageId={`toast.error.${code ? code : 'default'}.message`}
        />,
        { duration: 1500, position: 'top-right' },
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
      if (quote.orderFormId === '') delete quote.orderFormId;
      const { data } = await webClient.put(`/quote/${id}`, quote);
      dispatch(setQuote(data));
      navigate(PATHS.QUOTE + '/' + id + '/details');
      toast.custom(
        <ToastNotification
          status="success"
          titleId="toast.success.quote-edited.title"
          messageId="toast.success.quote-edited.message"
        />,
        { duration: 2, position: 'top-right' },
      );
    } catch (error: any) {
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : null;
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.${code ? code : 'default'}.title`}
          messageId={`toast.error.${code ? code : 'default'}.message`}
        />,
        { duration: 1500, position: 'top-right' },
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
      id: string,
    ) => {
      try {
        const { data } = await webClient.post(`/quote/${id}/send`, values);
        dispatch(setQuote(data));
        KlaqToast('success', 'quote-send');
      } catch (error: any) {
        console.error(error);
        const code = error.response.data.code
          ? error.response.data.code.toLowerCase()
          : null;
        KlaqToast('danger', code);
      }
    },
  );
};

export const useUpdateQuoteStatus = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async (quote: Quote, status: QuoteStatus) => {
    const currentStatus = quote.status;
    dispatch(setQuote({ ...quote, status }));

    try {
      await webClient.put(`/quote/${quote.id}/status`, {
        status,
      });
    } catch (error: any) {
      dispatch(setQuote({ ...quote, status: currentStatus }));
      console.error(error);
    }
  });
};

export const useFetchQuoteDocument = () => {
  return useAsyncCallback(async (quoteDocumentId: string | undefined) => {
    if (!quoteDocumentId) return;
    try {
      const { data } = await webClient.get(
        `/quote/${quoteDocumentId}/document`,
        {
          responseType: 'blob',
        },
      );
      return data;
    } catch (error: any) {
      KlaqToast('danger', 'quote-pdf-error');
      console.error(error);
    }
  });
};

export const useDownloadQuoteDocument = () => {
  return useAsyncCallback(
    async (quoteDocumentId: string | undefined, quoteNumber: string) => {
      if (!quoteDocumentId) return;
      try {
        const { data } = await webClient.get(
          `/quote/${quoteDocumentId}/document`,
          {
            responseType: 'blob',
          },
        );
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', quoteNumber + '.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error: any) {
        KlaqToast('danger', 'quote-pdf-error');
        console.error(error);
      }
    },
  );
};

export const useFetchQuotesForCustomer = () => {
  return useAsyncCallback(async (customerId?: string) => {
    if (!customerId) return;
    try {
      const { data } = await webClient.get(`/quote/customer/${customerId}`);
      return data as Quote[];
    } catch (error: any) {
      KlaqToast('danger', 'quote-get-error');
      console.error(error);
    }
  });
};
