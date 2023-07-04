import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import { setUser, resetUser } from "./slice";
import { ToastNotification } from "../../components";
import toast from "react-hot-toast";

export const useLogin = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async (email: string, password: string) => {
    try {
      const res = await webClient.post("auth/login", {
        email,
        password,
      });
      dispatch(setUser(res.data));
    } catch (error: any) {
      toast.custom(
        <ToastNotification
          status="danger"
          title={error.response.data.message}
        />
      );

      console.error(error);
      return error.response;
    }
  });
};

export const useFetchUser = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async () => {
    try {
      const res = await webClient.get("auth");
      dispatch(setUser(res.data));
      return res.data;
    } catch (error: any) {
      dispatch(resetUser());
      return error.response;
    }
  });
};
