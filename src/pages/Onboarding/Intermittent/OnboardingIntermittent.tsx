import { useIntl } from "react-intl";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { Button } from "../../../components/Button/Button";
import { useEffect } from "react";
import { useFetchUser } from "../../../redux/Login/hooks";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/Login/selectors";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes";

type Props = {
  classes?: string;
};

export const OnboardingIntermittent = (props: Props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [{ isLoading }, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const handlePrevious = () => {
    navigate(PATHS.ONBOARDING_LEGAL_FORM_CHOICE);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <OnboardingLayout
      isLoading={isLoading}
      backgroundImg="https://images.unsplash.com/photo-1636654129379-e7ae6f30bfd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
    >
      <div>
        <h1 className="mt-8 text-lg leading-6 font-semibold text-blue-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: `onboarding.intermittent.header`,
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage({
            id: `onboarding.intermittent.description`,
          })}
        </p>
      </div>
      <div className="mt-8">
        <form className="space-y-6">
          <div>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: "onboarding.intermittent.input.email",
                })}
                defaultValue={user.email}
              />
            </div>
          </div>
          <div className="flex flex-row space-between justify-between">
            <Button
              type="button"
              variant="secondary"
              Icon={ArrowLeftIcon}
              iconPosition="leading"
              onClick={handlePrevious}
              text={intl.formatMessage({
                id: "onboarding.company-form.button.previous",
              })}
            />
            <Button
              type="submit"
              variant="primary"
              // TODO: link with mailchimp
              text={intl.formatMessage({
                id: "onboarding.intermittent.submit",
              })}
            />
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingIntermittent;
