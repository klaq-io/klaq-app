import { stat } from "fs";
import { Invoice } from "interface/Invoice/invoice.interface";
import { RootState } from "redux/store";

export const getInvoice = (
  state: RootState,
  id?: string
): Invoice | undefined =>
  id
    ? state.invoices.invoices.find((invoice: Invoice) => invoice.id === id)
    : undefined;

export const getInvoices = (state: RootState): Invoice[] =>
  state.invoices.invoices;
