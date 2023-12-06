import { Invoice, NewInvoice } from "interface/Invoice/invoice.interface";
import { createContext } from "react";

export const InvoiceContext = createContext<NewInvoice | null>(null);
