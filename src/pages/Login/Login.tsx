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
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
              alt="klaq.io"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {intl.formatMessage({
                id: "login.header",
              })}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {intl.formatMessage({
                id: "login.signup.text",
              })}
              <a
                href="#"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                {intl.formatMessage({
                  id: "login.signup.link",
                })}
              </a>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: "login.label.email",
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "login.input.email",
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: "login.label.password",
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: "login.input.password",
                      })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm leading-6 text-gray-700"
                    >
                      {intl.formatMessage({
                        id: "login.remember-me",
                      })}
                    </label>
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      onClick={handleForgetPassword}
                      className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
                    >
                      {intl.formatMessage({
                        id: "login.forget-password",
                      })}
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {intl.formatMessage({
                      id: "login.submit",
                    })}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};

export default Login;
