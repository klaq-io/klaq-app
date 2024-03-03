import { Invoice, InvoiceStatus } from 'interface/Invoice/invoice.interface';
import { getInvoiceSubtotal } from './invoice';

export const formatPhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) return ''; // Handling null input

  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if the cleaned number starts with '0'
  if (cleaned.startsWith('0')) {
    const formatted = cleaned.match(/.{1,2}/g)?.join(' ') || '';
    return '+33 ' + formatted.slice(1);
  }

  // If the number doesn't start with '0', return as is
  return phoneNumber;
};

export const getCustomerValue = (invoices: Invoice[]) => {
  if (!invoices || !invoices.length) {
    return (0).toFixed(2);
  }
  return invoices
    .filter((invoice) => invoice.status === InvoiceStatus.PAID)
    .reduce((acc, invoice) => acc + getInvoiceSubtotal(invoice), 0)
    .toFixed(2);
};
