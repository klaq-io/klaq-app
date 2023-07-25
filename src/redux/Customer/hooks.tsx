import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import {
  Customer,
  CustomerType,
  deleteCustomer,
  setCustomer,
  setCustomers,
  updateCustomers,
} from "./slices";
import toast from "react-hot-toast";
import { ToastNotification } from "../../components";

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
  return useAsyncCallback(
    async (values: {
      name?: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address?: string;
      city?: string;
      state?: string;
      zipcode?: string;
      country?: string;
      type?: CustomerType;
      legalVATNumber?: string;
      legalRegistrationNumber?: string;
    }) => {
      try {
        const response = await webClient.post("/customer", values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={"toast.success.create-customer.title"}
            messageId={"toast.success.create-customer.message"}
          />,
          {
            duration: 1000,
            position: "top-right",
          }
        );
        dispatch(setCustomer(response.data));
      } catch (error: any) {
        console.error(error);
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={`toast.success.${error.response.data.code.toLowerCase()}.title`}
            messageId={`toast.success.${error.response.data.code.toLowerCase()}.message`}
          />,
          {
            duration: 1000,
            position: "top-right",
          }
        );
        return error.data;
      }
    }
  );
};

export const useUpdateCustomer = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(
    async (
      values: {
        name?: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address?: string;
        city?: string;
        state?: string;
        zipcode?: string;
        country?: string;
        type: CustomerType;
        legalVATNumber?: string;
        legalRegistrationNumber?: string;
      },
      id: string
    ) => {
      try {
        const response = await webClient.put(`/customer/${id}`, values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={"toast.success.update-customer.title"}
            messageId={"toast.success.update-customer.message"}
          />,
          {
            duration: 1000,
            position: "top-right",
          }
        );
        dispatch(updateCustomers(response.data));
      } catch (error: any) {
        console.error(error);
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={`toast.success.${error.response.data.code.toLowerCase()}.title`}
            messageId={`toast.success.${error.response.data.code.toLowerCase()}.message`}
          />,
          {
            duration: 1000,
            position: "top-right",
          }
        );
        return error.data;
      }
    }
  );
};

export const useDeleteCustomer = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async (id: string) => {
    try {
      await webClient.delete(`/customer/${id}`);
      toast.custom(
        <ToastNotification
          status="success"
          titleId={"toast.success.delete-customer.title"}
          messageId={"toast.success.delete-customer.message"}
        />,
        {
          duration: 1000,
          position: "top-right",
        }
      );
      dispatch(deleteCustomer(id));
    } catch (error: any) {
      console.error(error);
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.success.${error.response.data.code.toLowerCase()}.title`}
          messageId={`toast.success.${error.response.data.code.toLowerCase()}.message`}
        />,
        {
          duration: 1000,
          position: "top-right",
        }
      );
      return error.data;
    }
  });
};
