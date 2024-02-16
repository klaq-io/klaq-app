import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button } from "components";
import { OnboardingLayout } from "layouts/OnboardingLayout/OnboardingLayout";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

export const OnboardingNoLegalFormPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1636654129379-e7ae6f30bfd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80">
      <div>
        <h1 className="mt-8 text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: "onboarding.legal-form-choice.no-status.header",
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage({
            id: "onboarding.legal-form-choice.no-status.description",
          })}
        </p>
        <div className="mt-8">
          <Button
            type="button"
            variant="text"
            color="secondary"
            leadingIcon={
              <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            }
            onClick={() => navigate(-1)}
          >
            {intl.formatMessage({
              id: "onboarding.company-form.button.previous",
            })}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};
