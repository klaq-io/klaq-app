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
    setQuotes: (state, action: PayloadAction<Quote[]>) => {
      state.quotes = action.payload;
    },
  },
});

export const { setQuote, setQuotes } = quoteSlice.actions;

export default quoteSlice.reducer;
