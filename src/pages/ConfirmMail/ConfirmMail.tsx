import { useEffect } from "react";
import { useIntl } from "react-intl";
import { OnboardingLayout } from "layouts/OnboardingLayout/OnboardingLayout";
import {
  useCheckEmailVerifyingStatus,
  useResendVerificationEmail,
  useVerifyEmail,
} from "redux/Email/hooks";
import { Ping } from "@uiball/loaders";

const SECONDS = 1000;
const INITIAL_DELAY = 15 * SECONDS;

export const ConfirmMail = () => {
  const params = new URLSearchParams(document.location.search);
  const email = params.get("email");

  const intl = useIntl();

  const [, resendVerificationEmail] = useResendVerificationEmail();
  const [{ data }, checkEmailVerifyingStatus] = useCheckEmailVerifyingStatus();

  useEffect(() => {
    setTimeout(() => {
      checkEmailVerifyingStatus();

      const interval = setInterval(() => {
        checkEmailVerifyingStatus(interval);
      }, 5000);

      return () => clearInterval(interval);
    }, INITIAL_DELAY);
  }, []);

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1618060932014-4deda4932554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80">
      <div className="flex flex-col">
        <h1 className="text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: "confirm-mail.header",
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage(
            {
              id: "confirm-mail.description",
            },
            {
              b: (chunks: any) => <b>{chunks}</b>,
              email,
            }
          )}
        </p>
        <div className="mt-6 mx-auto">
          <Ping size={90} speed={3} color="#40615d" />
        </div>
        <div className="mx-auto">
          <h1 className="text-lg leading-6 text-klaq-600">
            {intl.formatMessage({
              id: "confirm-mail.waiting-reception",
            })}
          </h1>
        </div>
      </div>

      <div className="mt-8">
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage({
            id: "confirm-mail.resend.text",
          })}{" "}
          <button
            onClick={() => resendVerificationEmail()}
            className="font-semibold text-klaq-600 hover:text-klaq-500"
          >
            {intl.formatMessage({
              id: "confirm-mail.resend.link",
            })}
          </button>
        </p>
      </div>
    </OnboardingLayout>
  );
};

export default ConfirmMail;
