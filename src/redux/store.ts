import { configureStore } from "@reduxjs/toolkit";
import { eventsSlice } from "./Events/slices";
import { userSlice } from "./Login/slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    events: eventsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
