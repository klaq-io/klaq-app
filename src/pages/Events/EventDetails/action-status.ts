import { isPast } from "date-fns";
import { Status } from "enum/status.enum";
import { MainEvent } from "interface/Event/main-event.interface";
import { InvoiceStatus } from "interface/Invoice/invoice.interface";
import { QuoteStatus } from "interface/Quote/quote.interface";

export const getStatusForProductsAction = (event: MainEvent): Status => {
  return event.products && event.products.length
    ? Status.SUCCESS
    : Status.WARNING;
};

export const getStatusForPreQuoteAction = (event: MainEvent): Status => {
  if (
    event.products &&
    event.products.length &&
    event.quotes &&
    !event.quotes.length
  ) {
    return Status.PENDING;
  }
  if (event.quotes && !event.quotes.length) {
    return Status.WARNING;
  }
  return Status.SUCCESS;
};

export const getStatusForQuoteAction = (event: MainEvent): Status => {
  if (event.quotes?.some((quote) => quote.status === QuoteStatus.ACCEPTED)) {
    return Status.SUCCESS;
  }
  if (event.quotes?.some((quote) => quote.status === QuoteStatus.REJECTED)) {
    return Status.DANGER;
  }
  return Status.WARNING;
};

export const getStatusForInvoiceAction = (event: MainEvent): Status => {
  if (
    event.invoices?.some((invoice) => invoice.status === InvoiceStatus.PAID)
  ) {
    return Status.SUCCESS;
  }
  if (event.invoices?.some((invoice) => isPast(new Date(invoice.validUntil)))) {
    return Status.DANGER;
  }
  return Status.WARNING;
};
