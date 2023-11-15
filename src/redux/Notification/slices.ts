import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialState } from "redux/states";
import { Notification } from "interface/Notifications/notification.interface";

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
  },
});

export const { setNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
