import {
  DiscountType,
  Invoice,
  InvoiceProduct,
} from "interface/Invoice/invoice.interface";

export const getInvoiceProductSubtotal = (product: InvoiceProduct) => {
  const discount =
    product.discountType === DiscountType.PERCENT
      ? product.price * (product.discount / 100)
      : product.discount;
  return product.price * product.quantity - discount;
};

export const getInvoiceSubtotal = (invoice: Invoice) =>
  invoice?.products.reduce(
    (acc, product) => acc + getInvoiceProductSubtotal(product),
    0
  ) || 0;

export const getInvoiceTaxes = (invoice: Invoice) =>
  invoice?.products.reduce(
    (acc, product) =>
      acc +
      getInvoiceProductSubtotal(product) * (Number(product.vtaRate) / 100),
    0
  ) || 0;

export const getInvoiceTotal = (invoice: Invoice) =>
  getInvoiceSubtotal(invoice) + getInvoiceTaxes(invoice);
