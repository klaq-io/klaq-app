import { useAsyncCallback } from "@react-hooks-library/core";
import { useDispatch } from "react-redux";
import webClient from "../../utils/webclient";
import { setEvents } from "./slices";
import toast from "react-hot-toast";
import { ToastNotification } from "../../components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { isBefore } from "date-fns";

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
  const navigate = useNavigate();

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
      if (!(values.startTime <= values.endTime)) {
        toast.custom(
          <ToastNotification
            status="danger"
            titleId="new-event.toast.error.same-time.title"
            messageId="new-event.toast.error.same-time.message"
          />
        );
        return;
      }
      try {
        const res = await webClient.post("/events", values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId="new-event.toast.success.title"
            messageId="new-event.toast.success.message"
          />
        );
        navigate(`${PATHS.EVENTS}/${res.data.id}`);
      } catch (error: any) {
        toast.custom(
          <ToastNotification
            status="danger"
            titleId="new-event.toast.error.default.title"
          />
        );
        console.error(error);
        return error.response;
      }
    }
  );
};
