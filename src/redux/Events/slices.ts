import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../states';
import { Customer } from '../Customer/slices';
import { Quote } from 'interface/Quote/quote.interface';

export interface Event {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  price: number;
  numberOfGuests: number;
  eventType: string;
  publicEvent: string;
  phoneNumber?: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  placeName?: string;
  contactPhone?: string;
  additionalInfo?: string;
  status: EventStatus;
  desiredProduct?: string;
  customer: Customer;
  products?: EventProduct[];
  coordinates?: Coordinates;
  quotes_?: Quote[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export enum EventStatus {
  INBOX = 'INBOX',
  QUALIFICATION = 'QUALIFICATION',
  QUOTE_SENT = 'QUOTE_SENT',
  // QUOTE_OPENED = "QUOTE_OPENED",
  QUOTE_ACCEPTED = 'QUOTE_ACCEPTED',
  QUOTE_REJECTED = 'QUOTE_REJECTED',
  // CONTRACT_SENT = "CONTRACT_SENT",
  // CONTRACT_OPENED = "CONTRACT_OPENED",
  // CONTRACT_ACCEPTED = "CONTRACT_ACCEPTED",
  // CONTRACT_REJECTED = "CONTRACT_REJECTED",
  // DEPOSIT_REQUESTED = "DEPOSIT_REQUESTED",
  // DEPOSIT_LATE = "DEPOSIT_LATE",
  READY = 'READY',
  DONE = 'DONE',
  INVOICE_SENT = 'INVOICE_SENT',
  // INVOICE_OPENED = "INVOICE_OPENED",
  INVOICE_OVERDUE = 'INVOICE_OVERDUE',
  WIN = 'WIN',
  LOST = 'LOST',
}

export interface EventProduct {
  id: string;
  productId: string;
  quantity: number;
  event: Event;
}

type EventsSliceType = [];

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventsSliceType>) => {
      state.events = action.payload;
    },
    setEvent: (state, action: PayloadAction<Event>) => {
      state.events = [...state.events, action.payload];
    },
  },
});

export const { setEvents, setEvent } = eventsSlice.actions;

export default eventsSlice.reducer;
