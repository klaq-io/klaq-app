import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialState } from "redux/states";
import { Event } from "../Events/slices";

export interface Quote {
  id: string;
  number: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  issuedOn: Date | string;
  validUntil: Date | string;
  status: QuoteStatus;
  products: QuoteProduct[];
  event: Event;
  documentId: string;
  orderFormId?: string;
  object?: string;
}

export interface QuoteProduct {
  quantity: number;
  price: number;
  description: string;
  title: string;
  vtaRate: string;
}

export enum QuoteStatus {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export const quoteSlice = createSlice({
  name: "quoteSlice",
  initialState,
  reducers: {
    setQuote: (state, action: PayloadAction<Quote>) => {
      const existingQuoteIndex = state.quotes.findIndex(
        (quote: Quote) => quote.id === action.payload.id
      );

      if (existingQuoteIndex !== -1) {
        state.quotes[existingQuoteIndex] = action.payload;
      } else {
        state.quotes.push(action.payload);
      }
    },
    setQuotes: (state, action: PayloadAction<Quote[]>) => {
      state.quotes = action.payload;
    },
  },
});

export const { setQuote, setQuotes } = quoteSlice.actions;

export default quoteSlice.reducer;
