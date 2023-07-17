import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import { ToastNotification } from "../../components";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { deleteProduct, setProducts, updateProducts } from "./slices";

export const useFetchProductItems = () => {
  const dispatch = useDispatch();

  return useAsyncCallback(async () => {
    try {
      const res = await webClient.get("item");
      dispatch(setProducts(res.data));
    } catch (error: any) {
      console.error(error);
      return error.response;
    }
  });
};

export const useAddProductItem = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(
    async (values: {
      title: string;
      description: string;
      price: number;
      vtaRate: string;
    }) => {
      try {
        const res = await webClient.post("item", values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={"products.new-product.toast.success.title"}
            messageId={"products.new-product.toast.success.message"}
          />,
          { duration: 1000, position: "top-right" }
        );
        dispatch(updateProducts(res.data));
      } catch (error: any) {
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={"products.new-product.toast.error.add-product.title"}
            messageId={"products.new-product.toast.error.add-product.message"}
          />,
          { duration: 1000, position: "top-right" }
        );
        console.error(error.response);
      }
    }
  );
};

export const useDeleteProductItem = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async (id: string) => {
    try {
      const res = await webClient.delete(`/item/${id}`);
      toast.custom(
        <ToastNotification
          status="success"
          titleId={"products.delete-product.toast.success.title"}
          messageId={"products.delete-product.toast.success.message"}
        />,
        { duration: 1000, position: "top-right" }
      );
      dispatch(deleteProduct(id));
    } catch (error: any) {
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={"products.delete-product.toast.error.delete-product.title"}
          messageId={
            "products.delete-product.toast.error.delete-product.message"
          }
        />,
        { duration: 1000, position: "top-right" }
      );
      console.error(error.response);
    }
  });
};

export const useEditProductItem = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(
    async (
      values: {
        title?: string;
        description?: string;
        price?: number;
        vtaRate?: string;
      },
      id: string
    ) => {
      try {
        const res = await webClient.put(`/item/${id}`, values);
        dispatch(updateProducts(res.data));
        toast.custom(
          <ToastNotification
            status="success"
            titleId={"products.edit-product.toast.success.title"}
            messageId={"products.edit-product.toast.success.message"}
          />,
          { duration: 1000, position: "top-right" }
        );
      } catch (error: any) {
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={"products.edit-product.toast.error.edit-product.title"}
            messageId={"products.edit-product.toast.error.edit-product.message"}
          />,
          { duration: 1000, position: "top-right" }
        );
        console.error(error.response);
      }
    }
  );
};
