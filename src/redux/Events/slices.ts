import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../states";
import { Customer } from "../Customer/slices";

export interface Event {
  id: string;
  date: Date;
  arrivalTime: string;
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
  placeName?: string;
  contactPhone?: string;
  additionalInfo?: string;
  status: string;
  desiredProduct?: string;
  customer: Customer;
  products?: EventProduct[];
}

export interface EventProduct {
  id: string;
  productId: string;
  quantity: number;
  event: Event;
}

type EventsSliceType = [];

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventsSliceType>) => {
      state.events = action.payload;
    },
  },
});

export const { setEvents } = eventsSlice.actions;

export default eventsSlice.reducer;
