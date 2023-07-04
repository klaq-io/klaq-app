import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { LoginLayout } from "../../layouts";
import { useLogin } from "../../redux/Login/hooks";
import { PATHS } from "../../routes";
import { initialValues, validationSchema } from "./form";

export const Login = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [{ isLoading }, fetchUseLogin] = useLogin();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      fetchUseLogin(values.email, values.password);
    },
  });

  const handleForgetPassword = () => {
    navigate(PATHS.FORGET_PASSWORD);
  };

  return (
    <LoginLayout>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h1 className="text-lg leading-6 font-semibold text-blue-600">
              Klaq.io
            </h1>
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
              <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                      onChange={formik.handleChange}
                      value={formik.values.email}
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
                      onChange={formik.handleChange}
                      value={formik.values.password}
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
                    className="flex w-full justify-center space-x-2 rounded-md items-center bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="3 3 18 18">
                        <path
                          className="fill-blue-800"
                          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                        ></path>
                        <path
                          className="fill-blue-100"
                          d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                        ></path>
                      </svg>
                    ) : (
                      <span>
                        {intl.formatMessage({
                          id: "login.submit",
                        })}
                      </span>
                    )}
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
