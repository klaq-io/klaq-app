import { stat } from "fs";
import { Invoice } from "interface/Invoice/invoice.interface";
import { RootState } from "redux/store";

export const getInvoice = (
  state: RootState,
  id?: string
): Invoice | undefined => {
  return state.invoices.invoices.find((invoice: Invoice) => invoice.id === id);
};

export const getInvoices = (state: RootState): Invoice[] =>
  state.invoices.invoices;
