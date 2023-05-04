import React, { useEffect } from "react";
import { useLogin } from "../../redux/Login/hooks";
import AppScreenshot from "../../assets/login-screenshot.png";
import { LoginLayout } from "../../layouts";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { useIntl } from "react-intl";

export const Login = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [{ isLoading, error, data }, fetchUseLogin] = useLogin(
    "fermey.paul@gmail.com",
    "Jeanlasalle10!"
  );

  const handleForgetPassword = () => {
    navigate(PATHS.FORGET_PASSWORD);
  };

  useEffect(() => {
    // fetchUseLogin();
  }, []);
  return (
    <LoginLayout>
      <div className="flex flex-col justify-center content-center w-1/2">
        {/* <h1 className="text-xl text-primary font-bold">⚡ Klaq.io</h1> */}
        <h1 className="text-xl text-primary font-bold mb-8">
          {intl.formatMessage({ id: "login.header" })}
        </h1>
        <label className="label">
          <span className="label-text">
            {intl.formatMessage({ id: "login.label.email" })}
          </span>
        </label>
        <input
          type="email"
          placeholder={intl.formatMessage({ id: "login.input.email" })}
          className="input input-bordered w-full max-w-xs"
        />
        <label className="label">
          <span className="label-text">
            {intl.formatMessage({ id: "login.label.password" })}
          </span>
        </label>
        <input
          type="password"
          placeholder={intl.formatMessage({ id: "login.input.password" })}
          className="input input-bordered w-full max-w-xs"
        />
        <div className="flex flex-row items-center space-x-4 mt-8">
          <button className="btn btn-primary text-white">
            {intl.formatMessage({ id: "login.submit" })}
          </button>
          <a className="link link-primary" onClick={handleForgetPassword}>
            {intl.formatMessage({ id: "login.forget-password" })}
          </a>
        </div>
        <div className="divider"></div>
        <p>
          {intl.formatMessage({ id: "login.signup" })}{" "}
          <a className="link link-primary">
            {intl.formatMessage({ id: "login.signup.cta" })}
          </a>
        </p>
      </div>
    </LoginLayout>
  );
};

export default Login;
