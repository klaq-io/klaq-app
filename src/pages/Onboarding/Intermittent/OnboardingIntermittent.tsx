import { useIntl } from "react-intl";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { Button } from "components";
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
        <h1 className="mt-8 text-lg leading-6 font-semibold text-klaq-600">
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
                className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
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
              color="secondary"
              variant="text"
              leadingIcon={
                <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              }
              onClick={handlePrevious}
            >
              {intl.formatMessage({
                id: "onboarding.company-form.button.previous",
              })}
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              // TODO: link with mailchimp
            >
              {intl.formatMessage({
                id: "onboarding.intermittent.submit",
              })}
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingIntermittent;
