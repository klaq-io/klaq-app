import { Customer } from "redux/Customer/slices";
import { Event } from "redux/Events/slices";
import { Quote, QuoteStatus } from "redux/Quote/slices";

export const getCustomerValue = (customer: Customer) => {
  // todo: sum of billed invoice
  // if (!customer) return 0;
  // if (customer.events === undefined) return 0;
  // if (customer.events)
  // const customerValue = customer.events.reduce((acc, curr) => {
  //     if (curr.price) {
  //     return acc + curr.price;
  //     } else {
  //     return acc;
  //     }
  // }, 0);
  // return customerValue.toFixed(2);
};

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
        (quote) => quote.status !== QuoteStatus.REJECTED
      );

      const acceptedQuotes = quotes.filter(
        (quote) => quote.status === QuoteStatus.ACCEPTED
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

  return value === Infinity ? "0.00" : value.toFixed(2);
};
