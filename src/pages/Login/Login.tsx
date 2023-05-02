import React, { useEffect } from "react";
import { useLogin } from "../../redux/Login/hooks";

export const Login = () => {
  const [{ isLoading, error, data }, fetchUseLogin] = useLogin(
    "fermey.paul@gmail.com",
    "Jeanlasalle10!"
  );

  useEffect(() => {
    fetchUseLogin();
  }, []);
  return (
    <>
      <div>
        Login:
        {isLoading ? "loading" : error ? error : "good"}
      </div>
    </>
  );
};

export default Login;
