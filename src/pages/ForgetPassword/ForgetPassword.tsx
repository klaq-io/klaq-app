import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { LoginLayout } from "../../layouts";
import { PATHS } from "../../routes";

export const ForgetPassword = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const handleLogin = () => {
    navigate(PATHS.LOGIN);
  };
  return (
    <LoginLayout backgroundImg="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h1 className="text-lg leading-6 font-semibold text-blue-600">
              Klaq.io
            </h1>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {intl.formatMessage({
                id: "forget-password.header",
              })}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {intl.formatMessage({
                id: "forget-password.text",
              })}
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
                      id: "forget-password.label.email",
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
                        id: "forget-password.input.email",
                      })}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {intl.formatMessage({
                      id: "forget-password.submit",
                    })}
                  </button>
                </div>

                <div className="mt-auto">
                  <div className="relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm font-medium leading-6"></div>
                  </div>
                </div>
                <div>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {intl.formatMessage({
                      id: "forget-password.login.text",
                    })}{" "}
                    <a
                      onClick={handleLogin}
                      className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
                    >
                      {intl.formatMessage({
                        id: "forget-password.login.link",
                      })}
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LoginLayout>
  );
};
