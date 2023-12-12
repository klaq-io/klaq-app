import { useAsyncCallback } from "@react-hooks-library/core";
import { NewInvoice } from "interface/Invoice/invoice.interface";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes";
import { KlaqToast } from "utils/KlaqToast";
import webClient from "utils/webclient";
import { setInvoice } from "./slices";

export const useCreateInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useAsyncCallback(async (values: NewInvoice, id: string) => {
    try {
      const { data } = await webClient.post(`/invoice/${id}`, values);
      dispatch(setInvoice(data));
      navigate(`${PATHS.INVOICE}/${data.id}/details`);
      return data;
    } catch (error: any) {
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : null;
      KlaqToast("danger", code);
      console.error(error);
    }
  });
};

export const useUpdateInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useAsyncCallback(
    async (values: NewInvoice, mainEventId: string, invoiceId: string) => {
      try {
        const { data } = await webClient.put(
          `/invoice/${invoiceId}/${mainEventId}`,
          values
        );
        dispatch(setInvoice(data));
        navigate(`${PATHS.INVOICE}/${data.id}/details`);
        return data;
      } catch (error: any) {
        const code = error.response.data.code
          ? error.response.data.code.toLowerCase()
          : null;
        KlaqToast("danger", code);
        console.error(error);
      }
    }
  );
};

export const useFetchInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useAsyncCallback(async (id?: string) => {
    try {
      const { data } = await webClient.get(`/invoice/${id}`);
      dispatch(setInvoice(data));
      return data;
    } catch (error: any) {
      KlaqToast("danger", "invoice-get-error");
      console.error(error);
      navigate(PATHS.INVOICES);
    }
  });
};
