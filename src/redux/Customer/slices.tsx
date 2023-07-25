import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../states";

export interface Customer {
  id: string;
  type: CustomerType;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  legalVATNumber?: string;
  legalRegistrationNumber?: string;
  name?: string;
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
    setCustomer: (state, action) => {
      state.customers = [...state.customers, action.payload];
    },
    updateCustomers: (state, action) => {
      state.customers = state.customers.map((customer: Customer) => {
        if (customer.id === action.payload.id) {
          return action.payload;
        }
        return customer;
      });
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter((customer: Customer) => {
        return customer.id !== action.payload;
      });
    },
  },
});

export const { setCustomers, setCustomer, updateCustomers, deleteCustomer } =
  customerSlice.actions;

export default customerSlice.reducer;
