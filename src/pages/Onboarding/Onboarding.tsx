import { useIntl } from "react-intl";
import { OnboardingLayout } from "../../layouts/OnboardingLayout/OnboardingLayout";

export const Onboarding = () => {
  const intl = useIntl();
  return (
    <OnboardingLayout>
      <div>
        <h1 className="text-lg leading-6 font-semibold text-blue-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: "confirm-sms.header",
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500"></p>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding;
