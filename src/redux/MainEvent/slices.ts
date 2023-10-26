import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MainEvent } from "interface/Event/main-event.interface";
import { initialState } from "redux/states";

export const mainEventSlice = createSlice({
  name: "mainEvent",
  initialState,
  reducers: {
    setMainEvent: (state, action: PayloadAction<MainEvent>) => {
      state.mainEvents = [...state.mainEvents, action.payload];
    },
    setMainEvents: (state, action: PayloadAction<MainEvent[]>) => {
      state.mainEvents = action.payload;
    },
    // Define your reducers here
  },
});

export const { setMainEvent, setMainEvents } = mainEventSlice.actions;

export default mainEventSlice.reducer;
