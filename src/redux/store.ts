import { configureStore } from '@reduxjs/toolkit';
import { commentarySlice } from './Commentary/slices';
import { companySlice } from './Company/slices';
import { customerSlice } from './Customer/slices';
import { eventsSlice } from './Events/slices';
import { userSlice } from './Login/slice';
import { productItemSlice } from './Products/slices';
import { quoteSlice } from './Quote/slices';
import { mainEventSlice } from './MainEvent/slices';
import { notificationSlice } from './Notification/slices';
import { invoiceSlice } from './Invoice/slices';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    events: eventsSlice.reducer,
    productItems: productItemSlice.reducer,
    company: companySlice.reducer,
    customers: customerSlice.reducer,
    commentaries: commentarySlice.reducer,
    quotes: quoteSlice.reducer,
    mainEvents: mainEventSlice.reducer,
    notifications: notificationSlice.reducer,
    invoices: invoiceSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
