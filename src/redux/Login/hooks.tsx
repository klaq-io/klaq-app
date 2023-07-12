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

export const useSignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useAsyncCallback(
    async (values: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone: string;
    }) => {
      try {
        const res = await webClient.post("auth/register", values);
        toast.custom(
          <ToastNotification
            status="success"
            titleId={"sign-up.toast.success.title"}
            messageId={"sign-up.toast.success.message"}
          />
        );
        dispatch(setUser(res.data));
        navigate(`${PATHS.CONFIRM_MAIL}?email=${values.email}`);
        return res.data;
      } catch (error: any) {
        console.error(error);
        toast.custom(
          <ToastNotification
            status="danger"
            titleId={`sign-up.toast.error.${error.response.data.code.toLowerCase()}.title`}
            messageId={`sign-up.toast.error.${error.response.data.code.toLowerCase()}.message`}
          />
        );
        return error.response;
      }
    }
  );
};
