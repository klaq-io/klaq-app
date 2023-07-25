import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import { setCustomer, setCustomers } from "./slices";

export const useFetchCustomers = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async () => {
    try {
      const response = await webClient.get("/customer");
      dispatch(setCustomers(response.data));
    } catch (error: any) {
      console.error(error);
      return error.data;
    }
  });
};

export const useCreateCustomer = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async (data: any) => {
    try {
      const response = await webClient.post("/customer", data);
      dispatch(setCustomer(response.data));
    } catch (error: any) {
      console.error(error);
      return error.data;
    }
  });
};
