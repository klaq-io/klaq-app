import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import { setCustomers } from "./slices";

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
