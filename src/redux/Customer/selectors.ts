import { RootState } from "../store";
import { Customer } from "./slices";

export const getCustomers = (state: RootState): Customer[] =>
  state.customers.customers;
