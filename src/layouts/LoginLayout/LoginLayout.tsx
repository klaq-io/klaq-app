import { useIntl } from "react-intl";
import AppScreenshot from "../../assets/login-screenshot.png";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

export const LoginLayout = (props: Props) => {
  const intl = useIntl();
  const { children } = props;
  return (
    <div className="flex flex-row min-h-screen bg-white h-screen">
      <div className="flex justify-center w-1/2">{children}</div>
      <div className="flex flex-col bg-primary text-center h-screen w-1/2 p-8 justify-center">
        <div className="mb-24">
          <h1 className="text-2xl font-bold text-base-100">
            {intl.formatMessage({ id: "layout.login.header" })}
          </h1>
        </div>
        <div className="mockup-window border bg-base-300 drop-shadow-lg mx-24">
          <img src={AppScreenshot} />
        </div>
      </div>
    </div>
  );
};
