import { format } from 'date-fns';
import { RootState } from '../store';
import { Quote } from 'interface/Quote/quote.interface';

export const getQuoteById = (
  state: RootState,
  id?: string | null,
): Quote | undefined => {
  if (!id) return undefined;
  return state.quotes.quotes.find((quote: Quote) => quote.id === id);
};

export const getNextQuoteNumber = (state: RootState): string =>
  `D-${format(new Date(), 'yyyy')}-${(state.quotes.quotes.length + 1)
    .toString()
    .padStart(4, '0')}`;

export const getQuotes = (state: RootState): Quote[] => state.quotes.quotes;

export const getQuotesByStatus = (
  state: RootState,
  ...status: string[]
): Quote[] | undefined =>
  state.quotes.quotes.filter((quote: Quote) => status.includes(quote.status));
