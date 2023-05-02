import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../routes";
import webClient from "./webclient";

interface Props {
  children?: ReactNode;
}

const UNAUTHORIZED = 401;

const PrivateRoute = (props: Props) => {
  const { children } = props;

  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await webClient.get("auth");
      } catch (error: any) {
        const status = error.response?.status || 500;

        if (status === UNAUTHORIZED) {
          navigate(PATHS.LOGIN, { replace: true });
        }
      }
    };
    checkLogin();
  });

  return <>{children}</>;
};

export default PrivateRoute;
