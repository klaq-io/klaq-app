import { useAsyncCallback } from "@react-hooks-library/core";
import { useDispatch } from "react-redux";
import webClient from "utils/webclient";
import { setNotifications } from "./slices";

export const useFetchNotifications = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async () => {
    try {
      const { data } = await webClient.get("/notification");
      dispatch(setNotifications(data));
    } catch (error) {
      console.error(error);
    }
  });
};
