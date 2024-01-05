import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Quote } from "interface/Quote/quote.interface";
import { initialState } from "redux/states";

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
