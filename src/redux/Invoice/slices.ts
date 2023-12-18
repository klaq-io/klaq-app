import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Invoice } from "interface/Invoice/invoice.interface";
import { initialState } from "redux/states";

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices =
        state.invoices.length === 0
          ? [action.payload]
          : state.invoices.map((invoice: Invoice) => {
              if (invoice.id === action.payload.id) {
                return action.payload;
              }
              return invoice;
            });
    },
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload;
    },
  },
});

export const { setInvoice, setInvoices } = invoiceSlice.actions;

export default invoiceSlice.reducer;
