import { RootState } from "../store";
import { Quote } from "./slices";

export const getQuoteById = (
  state: RootState,
  id: string
): Quote | undefined => {
  return state.quotes.quotes.find((quote: Quote) => quote.id === id);
};
