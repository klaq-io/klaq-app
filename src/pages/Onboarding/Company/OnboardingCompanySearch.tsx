import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { SearchCompany } from "components";
import { Button } from "components";
import { Suggestion } from "../../../interface/suggestion.interface";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { useFetchSuggestions } from "../../../redux/Company/hooks";
import { PATHS } from "../../../routes";

type Props = {
  classes?: string;
};

const companyType = {
  association: "association",
  company: "company",
};

export const OnboardingCompanySearch: React.FC<Props> = (props: Props) => {
  const intl = useIntl();
  const params = new URLSearchParams(document.location.search);
  const type =
    params.get("companyType") === companyType.association
      ? companyType.association
      : companyType.company;

  const [customerCompany, setCustomerCompany] = useState<
    Suggestion | undefined
  >();

  const navigate = useNavigate();

  const handleFillCompany = () => {
    navigate(`${PATHS.ONBOARDING_COMPANY}?companyType=${type}`);
  };

  const handlePrevious = () => {
    navigate(PATHS.ONBOARDING_LEGAL_FORM_CHOICE);
  };

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1484069560501-87d72b0c3669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: `onboarding.search-${type}.header`,
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500"></p>
      </div>
      <div className="mt-10">
        <div>
          <SearchCompany
            setCustomerCompany={setCustomerCompany}
            customerCompany={customerCompany}
            onboarding={true}
            placeholder={intl.formatMessage({
              id: `onboarding.search-${type}.input`,
            })}
          />

          <div className="relative mt-10">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-100 px-2 text-sm text-gray-500">
                {intl.formatMessage({
                  id: "onboarding.search-company.divider",
                })}
              </span>
            </div>
          </div>
          <div className="mt-6 flex flex-row justify-between space-between">
            <Button
              type="button"
              variant="text"
              color="secondary"
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
              type="button"
              onClick={handleFillCompany}
              variant="contained"
              color="primary"
            >
              {intl.formatMessage({
                id: "onboarding.search-company.goto-next",
              })}
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};
