import { useAsyncCallback } from "@react-hooks-library/core";
import { useDispatch } from "react-redux";
import webClient from "../../utils/webclient";
import { setEvents } from "./slices";

export const useFetchEvents = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async () => {
    try {
      const res = await webClient.get("/events");
      dispatch(setEvents(res.data));
    } catch (error: any) {
      console.error(error);
      return error.response;
    }
  });
};

export const useAddEvent = () => {
  return useAsyncCallback(
    async (values: {
      date: string;
      startTime: string;
      endTime: string;
      numberOfGuests: number;
      eventType: string;
      address: string;
      city: string;
      state: string;
      zipcode: string;
    }) => {
      try {
        const res = await webClient.post("/events", values);
      } catch (error: any) {
        console.error(error);
        return error.response;
      }
    }
  );
};
