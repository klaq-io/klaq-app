import { MainEvent } from "interface/Event/main-event.interface";

export interface Invoice {
  id: string;
  number: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  issuedOn: Date | string;
  paymentDue: Date | string;
  status: InvoiceStatus;
  products: InvoiceProduct[];
  documentId?: string;
  orderFormId?: string;
  object?: string;
  mainEvent: MainEvent; // mainEvent is mandatory for invoice
}

export type NewInvoice = Omit<Invoice, "id" | "createdAt" | "updatedAt">;

export interface InvoiceProduct {
  quantity: number;
  price: number;
  description: string;
  title: string;
  vtaRate: string;
}

export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  PAID = "paid",
}
