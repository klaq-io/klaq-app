import { MainEvent } from 'interface/Event/main-event.interface';
import { Quote, QuoteStatus } from 'interface/Quote/quote.interface';
import { Event } from 'redux/Events/slices';

export const getSubtotalForQuote = (quote: Quote) => {
  const subtotal = quote.products.reduce((acc, curr) => {
    if (curr.price) {
      return acc + Number(curr.price) * curr.quantity;
    } else {
      return acc;
    }
  }, 0);
  return subtotal;
};

export const getQuotePipeValue = (events: Event[]) => {
  const pipeValue = events.map((event) => {
    if (event.quotes_ && event.quotes_.length > 0) {
      const quotes = event.quotes_.filter(
        (quote) => quote.status !== QuoteStatus.REJECTED,
      );

      const acceptedQuotes = quotes.filter(
        (quote) => quote.status === QuoteStatus.ACCEPTED,
      );
      if (acceptedQuotes.length)
        return acceptedQuotes
          .map((quote) => getSubtotalForQuote(quote))
          .reduce((acc, curr) => acc + curr);

      const quoteValues = quotes.map((quote) => {
        return getSubtotalForQuote(quote);
      });
      return Math.min(...quoteValues);
    }
    return 0;
  });

  const value = pipeValue.reduce((acc, curr) => acc + curr, 0);

  return value === Infinity ? '0.00' : value.toFixed(2);
};

export const getQuotePipeValueV2 = (events: MainEvent[]) => {
  if (!events) return '0.00';

  const pipeValue = events.map((event) => {
    if (event.quotes && event.quotes.length > 0) {
      const quotes = event.quotes.filter(
        (quote) => quote.status !== QuoteStatus.REJECTED,
      );

      const acceptedQuotes = quotes.filter(
        (quote) => quote.status === QuoteStatus.ACCEPTED,
      );
      if (acceptedQuotes.length)
        return acceptedQuotes
          .map((quote) => getSubtotalForQuote(quote))
          .reduce((acc, curr) => acc + curr);

      const quoteValues = quotes.map((quote) => {
        return getSubtotalForQuote(quote);
      });
      return Math.min(...quoteValues);
    }
    return 0;
  });

  const value = pipeValue.reduce((acc, curr) => acc + curr, 0);

  return value === Infinity ? '0.00' : value.toFixed(2);
};
