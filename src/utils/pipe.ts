import { MainEvent } from "interface/Event/main-event.interface";
import {
  Invoice,
  InvoiceProduct,
  InvoiceStatus,
} from "interface/Invoice/invoice.interface";
import {
  DiscountType,
  Quote,
  QuoteProduct,
  QuoteStatus,
} from "interface/Quote/quote.interface";
import { getInvoiceSubtotal } from "./invoice";

const getQuoteProductSubtotal = (product: QuoteProduct) => {
  const discount =
    product.discountType === DiscountType.PERCENT
      ? product.price * (product.discount / 100)
      : product.discount;
  return product.price * product.quantity - discount;
};

const getQuoteSubtotal = (quote: Quote) => {
  return quote.products.reduce((acc, curr) => {
    return acc + getQuoteProductSubtotal(curr);
  }, 0);
};

export const getQuotePipeValueForEvent = (mainEvent: MainEvent) => {
  if (!mainEvent.quotes || !mainEvent.quotes.length) return 0;

  const acceptedQuotes = mainEvent.quotes.filter(
    (quote) => quote.status === QuoteStatus.ACCEPTED
  );

  if (acceptedQuotes.length)
    return acceptedQuotes
      .map((quote) => getQuoteSubtotal(quote))
      .reduce((acc, curr) => acc + curr);
};

export const getInvoicePipeValueForEvent = (mainEvent: MainEvent) => {
  if (!mainEvent.invoices || !mainEvent.invoices.length) return 0;

  const acceptedInvoices = mainEvent.invoices.filter(
    (invoice) => invoice.status === InvoiceStatus.PAID
  );

  if (acceptedInvoices.length)
    return acceptedInvoices
      .map((invoice) => getInvoiceSubtotal(invoice))
      .reduce((acc, curr) => acc + curr);
};

export const getPipeValueForEvent = (mainEvent: MainEvent) => {
  const quotePipeValue = getQuotePipeValueForEvent(mainEvent);
  const invoicePipeValue = getInvoicePipeValueForEvent(mainEvent);
  const value = invoicePipeValue ? invoicePipeValue : quotePipeValue;

  return value || 0;
};

export const getPipeValue = (mainEvents: MainEvent[]) =>
  mainEvents
    .map((event) => getPipeValueForEvent(event))
    .reduce((acc, curr) => acc + curr);
