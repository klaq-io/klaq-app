import { useNavigate } from "react-router-dom";
import { LoginLayout } from "../../layouts";
import { PATHS } from "../../routes";
import { useIntl } from "react-intl";

export const ForgetPassword = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const handleLogin = () => {
    navigate(PATHS.LOGIN);
  };
  return (
    <LoginLayout>
      <div className="flex flex-col justify-center content-center w-1/2">
        {/* <h1 className="text-xl text-primary font-bold">⚡ Klaq.io</h1> */}
        <h1 className="text-xl text-primary font-bold mb-4">
          {intl.formatMessage({ id: "forget-password.header" })}
        </h1>
        <p className="my-4">
          {intl.formatMessage({ id: "forget-password.text" })}
        </p>
        <label className="label">
          <span className="label-text">
            {" "}
            {intl.formatMessage({ id: "forget-password.label.email" })}
          </span>
        </label>
        <input
          type="email"
          placeholder={intl.formatMessage({
            id: "forget-password.input.email",
          })}
          className="input input-bordered w-full max-w-xs"
        />
        <div className="flex flex-row items-center space-x-4 mt-8">
          <button className="btn btn-primary">
            {intl.formatMessage({
              id: "forget-password.submit",
            })}
          </button>
        </div>
        <div className="divider"></div>
        <p>
          {intl.formatMessage({
            id: "forget-password.login.text",
          })}{" "}
          <a className="link link-primary" onClick={handleLogin}>
            {intl.formatMessage({
              id: "forget-password.login.link",
            })}
          </a>
        </p>
      </div>
    </LoginLayout>
  );
};
