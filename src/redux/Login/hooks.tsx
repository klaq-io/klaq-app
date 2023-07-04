import { useAsyncCallback } from "@react-hooks-library/core";
import webClient from "../../utils/webclient";
import { useDispatch } from "react-redux";
import { setUser, resetUser } from "./slice";
import { ToastNotification } from "../../components";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useAsyncCallback(async (email: string, password: string) => {
    try {
      const res = await webClient.post("auth/login", {
        email,
        password,
      });
      dispatch(setUser(res.data));
      navigate(PATHS.DASHBOARD);
    } catch (error: any) {
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={"login.toast.error.title"}
          messageId={"login.toast.error.message"}
        />
      );

      console.error(error);
      return error.response;
    }
  });
};

export const useSignout = () => {
  const dispatch = useDispatch();
  return useAsyncCallback(async () => {
    try {
      await webClient.get("auth/logout");
      dispatch(resetUser());
    } catch (error: any) {
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
