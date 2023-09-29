import { configureStore } from "@reduxjs/toolkit";
import { commentarySlice } from "./Commentary/slices";
import { companySlice } from "./Company/slices";
import { customerSlice } from "./Customer/slices";
import { eventsSlice } from "./Events/slices";
import { userSlice } from "./Login/slice";
import { productItemSlice } from "./Products/slices";
import { quoteSlice } from "./Quote/slices";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    events: eventsSlice.reducer,
    productItems: productItemSlice.reducer,
    company: companySlice.reducer,
    customers: customerSlice.reducer,
    commentaries: commentarySlice.reducer,
    quotes: quoteSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
