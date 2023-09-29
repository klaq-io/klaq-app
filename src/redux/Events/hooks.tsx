import { useAsyncCallback } from "@react-hooks-library/core";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastNotification } from "components";
import { PATHS } from "../../routes";
import webClient from "../../utils/webclient";
import { setEvent, setEvents } from "./slices";
import { format, formatISO } from "date-fns";

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

export const useFetchEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (id: string) => {
    try {
      const res = await webClient.get(`/events/${id}`);
      dispatch(setEvent(res.data));
    } catch (error: any) {
      navigate(PATHS.EVENTS);
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
        name: string;
      };
      coordinates: {
        longitude: number;
        latitude: number;
      };
    }) => {
      try {
        const res = await webClient.post("/events", values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId="toast.success.add-event.title"
            messageId="toast.success.add-event.message"
          />,
          { duration: 1500, position: "top-right" }
        );
        navigate(`${PATHS.EVENTS}/${res.data.id}`);
      } catch (error: any) {
        const code = error.response.data.code
          ? error.response.data.code.toLowerCase()
          : "default";
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={`toast.error.${code}.title`}
            messageId={`toast.error.${code}.message`}
          />,
          { duration: 1500, position: "top-right" }
        );
        console.error(error);
        return error.response;
      }
    }
  );
};

export const useUpdateEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        const { data } = await webClient.put(`/events/${id}`, values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId="toast.success.edit-event.title"
            messageId="toast.success.edit-event.message"
          />,
          { duration: 1500, position: "top-right" }
        );
        dispatch(setEvent(data));
        navigate(`${PATHS.EVENTS}/${id}?from=edit`);
      } catch (error: any) {
        const code = error.response.data.code
          ? error.response.data.code.toLowerCase()
          : "default";
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={`toast.error.${code}.title`}
            messageId={`toast.error.${code}.message`}
          />,
          { duration: 1500, position: "top-right" }
        );
        console.error(error);
        return error.response;
      }
    }
  );
};

export const useUpdateEventStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useAsyncCallback(async (status: string, id: string) => {
    try {
      // todo: dispatch before request
      const res = await webClient.put(`/events/${id}/status`, { status });
      dispatch(setEvent(res.data));
    } catch (error: any) {
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : "default";
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.${code}.title`}
          messageId={`toast.error.${code}.message`}
        />,
        { duration: 1500, position: "top-right" }
      );
      console.error(error);
      return error.response;
    }
  });
};
