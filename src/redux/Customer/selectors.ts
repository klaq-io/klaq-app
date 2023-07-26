import { RootState } from "../store";
import { Customer } from "./slices";

export const getCustomers = (state: RootState): Customer[] =>
  state.customers.customers;

export const getCustomer = (
  state: RootState,
  customerId: string
): Customer | undefined => {
  const customers: Customer[] = state.customers.customers;
  return customers.find((customer) => {
    console.log(customer.id, customerId);
    return customer.id === customerId;
  });
};
