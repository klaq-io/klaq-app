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
      const code = error.response.data.code
        ? error.response.data.code.toLowerCase()
        : "default";
      toast.custom(
        <ToastNotification
          status="danger"
          titleId={`toast.error.${code}.title`}
          messageId={`toast.error.${code}.message`}
        />,
        { duration: 1000, position: "top-right" }
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

export const useSignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useAsyncCallback(
    async (values: { email: string; password: string; phone: string }) => {
      try {
        const res = await webClient.post("auth/register", values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={"toast.success.register.title"}
            messageId={"toast.success.register.message"}
          />,
          { duration: 1000, position: "top-right" }
        );
        dispatch(setUser(res.data));
        navigate(`${PATHS.CONFIRM_MAIL}?email=${values.email}`);
        return res.data;
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
          { duration: 1000, position: "top-right" }
        );
        console.error(error);
        return error.response;
      }
    }
  );
};

export const useCheckAuth = () => {
  return useAsyncCallback(async () => {
    try {
      await webClient.get("auth");
      return true;
    } catch (error: any) {
      return false;
    }
  });
};
