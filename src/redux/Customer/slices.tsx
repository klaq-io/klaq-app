import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../states";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  type: CustomerType;
}

export enum CustomerType {
  PRIVATE = "PRIVATE",
  COMPANY = "COMPANY",
}

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
  },
});

export const { setCustomers } = customerSlice.actions;

export default customerSlice.reducer;
