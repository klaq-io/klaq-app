import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import { ToastNotification } from "../../components";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { setProducts } from "./slices";

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
          />
        );
        return false;
      } catch (error: any) {
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={"products.new-product.toast.error.add-product.title"}
            messageId={"products.new-product.toast.error.add-product.message"}
          />
        );
        console.log(error.response);
        console.error(error);
        return true;
      }
    }
  );
};
