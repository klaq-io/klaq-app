import { useEffect } from "react";
import { useIntl } from "react-intl";
import { OnboardingLayout } from "../../layouts/OnboardingLayout/OnboardingLayout";
import {
  useResendVerificationEmail,
  useVerifyEmail,
} from "../../redux/Email/hooks";

export const ConfirmMail = () => {
  const params = new URLSearchParams(document.location.search);
  const token = params.get("token");
  const email = params.get("email");

  const intl = useIntl();

  const [{ isLoading }, verifyEmail] = useVerifyEmail();
  const [, resendVerificationEmail] = useResendVerificationEmail();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, []);

  return (
    <OnboardingLayout
      isLoading={isLoading}
      backgroundImg="https://images.unsplash.com/photo-1618060932014-4deda4932554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
    >
      <div>
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
      </div>
      <div className="mt-8">
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage({
            id: "confirm-mail.resend.text",
          })}
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
