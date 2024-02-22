import { MainEvent } from 'interface/Event/main-event.interface';

export type NewQuoteProduct = Omit<QuoteProduct, 'id'>;

export type NewQuote = Omit<
  Quote,
  | 'id'
  | 'status'
  | 'documentId'
  | 'number'
  | 'mainEvent'
  | 'products'
  | 'createdAt'
  | 'updatedAt'
> & {
  products: NewQuoteProduct[];
};

export interface Quote {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  issuedOn: Date | string;
  validUntil: Date | string;
  status: QuoteStatus;
  products: QuoteProduct[];
  documentId?: string;
  mainEvent: MainEvent;
  number: string;
  orderFormId?: string;
  object?: string;
}

export interface QuoteProduct {
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
  PERCENT = 'percent',
  FIXED = 'fixed',
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}
