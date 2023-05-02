import { initialState } from "../states";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Event {
  id: string;
  date: Date;
  arrivalTime: string;
  startTime: string;
  duration: number;
  price: number;
  numberOfPeople: number;
  eventType: string;
  address: string;
  placeName: string;
  contactPhone: string;
  additionalInfo: string;
  status: string;
  desiredProduct: string;
}

type EventsSliceType = Event[];

// export const eventsSlice = createSlice({
//   name: "events",
//   initialState,
//   reducers: {
//     setEvents: (state, action: PayloadAction<EventsSliceType>) => ({
//       ...state.user,
//       events: action.payload,
//     }),
//   },
// });

// export const { setEvents } = eventsSlice.actions;

// export default eventsSlice.reducer;
