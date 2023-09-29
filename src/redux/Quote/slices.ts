import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialState } from "redux/states";

export interface Quote {
  issuedOn: Date | string;
  validUntil: Date | string;
  status: QuoteStatus;
  products: QuoteProduct[];
  event: Event;
  documentId: string;
}

export interface QuoteProduct {
  quantity: number;
  price: number;
  description: string;
  title: string;
  vtaRate: string;
}

export enum QuoteStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export const quoteSlice = createSlice({
  name: "quoteSlice",
  initialState,
  reducers: {
    setQuote: (state, action: PayloadAction<Quote>) => {
      state.quotes = [...state.quotes, action.payload];
    },
  },
});

export const { setQuote } = quoteSlice.actions;

export default quoteSlice.reducer;
