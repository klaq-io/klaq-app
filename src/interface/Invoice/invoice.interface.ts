import { MainEvent } from "interface/Event/main-event.interface";

export type NewInvoiceProduct = Omit<InvoiceProduct, "id">;

export type NewInvoice = Omit<
  Invoice,
  | "id"
  | "status"
  | "documentId"
  | "number"
  | "mainEvent"
  | "products"
  | "createdAt"
  | "updatedAt"
> & {
  products: NewInvoiceProduct[];
};

export interface Invoice {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  issuedOn: Date | string;
  validUntil: Date | string;
  status: InvoiceStatus;
  products: InvoiceProduct[];
  documentId?: string;
  mainEvent: MainEvent;
  number: string;
  orderFormId?: string;
  object?: string;
  paymentMethod: PaymentMethod;
  onlinePaymentAccepted: boolean;
}

export interface InvoiceProduct {
  id: string;
  quantity: number;
  price: number;
  description: string;
  title: string;
  vtaRate: string;
  discount: number;
  discountType: DiscountType;
}

export enum DiscountType {
  PERCENT = "percent",
  FIXED = "fixed",
}

export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  LATE = "late",
  PAID = "paid",
  CANCELED = "canceled",
}

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PAYPAL = "PAYPAL",
  TRANSFER = "TRANSFER",
  CHECK = "CHECK",
  OTHER = "OTHER",
}
