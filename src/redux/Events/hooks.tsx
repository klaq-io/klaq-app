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
      customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };
    }) => {
      if (!(values.startTime <= values.endTime)) {
        toast.custom(
          <ToastNotification
            status="danger"
            titleId="new-event.toast.error.same-time.title"
            messageId="new-event.toast.error.same-time.message"
          />,
          { duration: 1000, position: "top-right" }
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
          />,
          { duration: 1000, position: "top-right" }
        );
        navigate(`${PATHS.EVENTS}/${res.data.id}`);
      } catch (error: any) {
        toast.custom(
          <ToastNotification
            status="danger"
            titleId="new-event.toast.error.default.title"
          />,
          { duration: 1000, position: "top-right" }
        );
        console.error(error);
        return error.response;
      }
    }
  );
};

export const useUpdateEvent = () => {
  const navigate = useNavigate();

  return useAsyncCallback(
    async (
      values: {
        date: Date;
        startTime: string;
        endTime: string;
        numberOfGuests: number;
        eventType: string;
        address: string;
        city: string;
        state: string;
        zipcode: string;
        customer: {
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
          type: string;
        };
        products?: any;
      },
      id
    ) => {
      try {
        await webClient.put(`/events/${id}`, values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId="edit-event.toast.success.title"
            messageId="edit-event.toast.success.message"
          />,
          { duration: 1000, position: "top-right" }
        );
        navigate(`${PATHS.EVENTS}/${id}`);
      } catch (error: any) {
        toast.custom(
          <ToastNotification
            status="danger"
            titleId="edit-event.toast.error.title"
            messageId="edit-event.toast.error.message"
          />,
          { duration: 1000, position: "top-right" }
        );
        console.error(error);
        return error.response;
      }
    }
  );
};
