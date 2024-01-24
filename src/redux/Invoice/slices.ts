import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Invoice } from "interface/Invoice/invoice.interface";
import { initialState } from "redux/states";

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices = state.invoices.filter(
        (invoice: Invoice) => invoice.id !== action.payload.id
      );
      state.invoices.push(action.payload);
    },
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload;
    },
  },
});

export const { setInvoice, setInvoices } = invoiceSlice.actions;

export default invoiceSlice.reducer;
