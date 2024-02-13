import { useAsyncCallback } from "@react-hooks-library/core";
import { InvoiceStatus, NewInvoice } from "interface/Invoice/invoice.interface";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes";
import { KlaqToast } from "utils/KlaqToast";
import webClient from "utils/webclient";
import { setInvoice, setInvoices } from "./slices";
import { useSelector } from "react-redux";
import { getInvoice } from "./selectors";

export const useCreateInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useAsyncCallback(async (values: NewInvoice, id: string) => {
    try {
      const { data } = await webClient.post(`/invoice/${id}`, values);
      dispatch(setInvoice(data));
      KlaqToast("success", "invoice-created");
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
        KlaqToast("success", "invoice-edit");
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

export const useFetchInvoices = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async () => {
    try {
      const { data } = await webClient.get(`/invoice`);
      dispatch(setInvoices(data));
      return data;
    } catch (error: any) {
      KlaqToast("danger", "invoice-get-error");
      console.error(error);
    }
  });
};

export const useUpdateInvoiceStatus = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async (status: InvoiceStatus, id: string) => {
    try {
      const { data } = await webClient.put(`/invoice/${id}/status/${status}`);
      dispatch(setInvoice(data));
      KlaqToast("success", "invoice-status");
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

export const useFetchInvoicePDF = () => {
  return useAsyncCallback(async (id: string | undefined) => {
    if (!id) return;
    try {
      const { data } = await webClient.get(`/invoice/render/pdf/${id}/`, {
        responseType: "blob",
      });
      return data;
    } catch (error: any) {
      KlaqToast("danger", "invoice-pdf-error");
      console.error(error);
    }
  });
};

export const useDownloadInvoicePDF = () => {
  return useAsyncCallback(
    async (id: string | undefined, invoiceNumber: string) => {
      if (!id) return;
      try {
        await webClient.get(`/invoice/render/pdf/${id}`);
        const { data } = await webClient.get(`/invoice/render/pdf/${id}`, {
          responseType: "blob",
        });
        const blob = new Blob([data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", invoiceNumber + ".pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error: any) {
        KlaqToast("danger", "invoice-pdf-error");
        console.error(error);
      }
    }
  );
};

export const useMarkAsFinal = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async (id: string | undefined) => {
    if (!id) return;
    try {
      const { data } = await webClient.patch(`/invoice/${id}`);
      dispatch(setInvoice(data));
      KlaqToast("success", "invoice-final");
    } catch (error: any) {
      console.error(error);
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : null;
      KlaqToast("danger", code);
    }
  });
};

export const useDeleteInvoice = () => {
  const navigate = useNavigate();

  return useAsyncCallback(async (id: string | undefined) => {
    if (!id) return;
    try {
      await webClient.delete(`/invoice/${id}`);
      KlaqToast("success", "invoice-delete");
      navigate(PATHS.INVOICES);
    } catch (error: any) {
      console.error(error);
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : null;
      KlaqToast("danger", code);
    }
  });
};

export const useSendInvoiceByEmail = () => {
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
      if (!id) return;
      try {
        await webClient.post(`/invoice/${id}/send`, values);
        KlaqToast("success", "invoice-send");
      } catch (error: any) {
        console.error(error);
        const code = error.response.data.code
          ? error.response.data.code.toLowerCase()
          : null;
        KlaqToast("danger", code);
      }
    }
  );
};

export const useFetchInvoicesForCustomer = () => {
  return useAsyncCallback(async (customerId: string | undefined) => {
    if (!customerId) return;
    try {
      const { data } = await webClient.get(`/invoice/customer/${customerId}`);
      return data;
    } catch (error: any) {
      console.error(error);
    }
  });
};

export const useFetchInvoiceDocument = () => {
  return useAsyncCallback(async (invoiceDocumentId: string | undefined) => {
    if (!invoiceDocumentId) return;
    try {
      const { data } = await webClient.get(
        `/invoice/${invoiceDocumentId}/document`,
        {
          responseType: "blob",
        }
      );
      return data;
    } catch (error: any) {
      console.error(error);
    }
  });
};

export const useDownloadInvoiceDocument = () => {
  return useAsyncCallback(
    async (invoiceDocumentId: string | undefined, invoiceNumber: string) => {
      if (!invoiceDocumentId) return;
      try {
        const { data } = await webClient.get(
          `/invoice/${invoiceDocumentId}/document`,
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", invoiceNumber + ".pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error: any) {
        console.error(error);
      }
    }
  );
};
