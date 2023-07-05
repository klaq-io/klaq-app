import { configureStore } from "@reduxjs/toolkit";
import { eventsSlice } from "./Events/slices";
import { userSlice } from "./Login/slice";
import { productItemSlice } from "./Products/slices";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    events: eventsSlice.reducer,
    productItems: productItemSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
