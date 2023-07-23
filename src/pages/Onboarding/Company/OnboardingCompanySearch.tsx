import { Combobox } from "@headlessui/react";
import { useState } from "react";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { useFetchSuggestions } from "../../../redux/Company/hooks";
import { classNames } from "../../../utils/utils";
import { useIntl } from "react-intl";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes";
import { Suggestion } from "../../../interface/suggestion.interface";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

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

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [, fetchSuggestions] = useFetchSuggestions();
  const navigate = useNavigate();

  const fetchCompanySuggestions = async (query: string) => {
    setSuggestions(await fetchSuggestions(query));
  };

  const handleCompany = (suggestion: Suggestion) => {
    navigate(
      `${PATHS.ONBOARDING_COMPANY}?companyType=${type}&activityType=${suggestion.activityType}&inseeLegalFormCode=${suggestion.inseeLegalFormCode}&legalForm=${suggestion.legalForm}&legalName=${suggestion.legalName}&legalRegistrationNumber=${suggestion.legalRegistrationNumber}&legalVATNumber=${suggestion.legalVATNumber}&registrationDate=${suggestion.registrationDate}&address=${suggestion.address}&city=${suggestion.city}&zip=${suggestion.zip}&tradeName=${suggestion.tradeName}&country=${suggestion.country}`
    );
  };

  const handleFillCompany = () => {
    navigate(`${PATHS.ONBOARDING_COMPANY}?companyType=${type}`);
  };

  const handlePrevious = () => {
    navigate(PATHS.ONBOARDING_LEGAL_FORM_CHOICE);
  };

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1484069560501-87d72b0c3669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-blue-600">
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
          <Combobox as="div">
            <div className="relative mt-2">
              <Combobox.Input
                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: `onboarding.search-${type}.input`,
                })}
                onChange={(event) =>
                  fetchCompanySuggestions(event.target.value)
                }
              />
            </div>
            {suggestions && suggestions.length > 0 && (
              <Combobox.Options
                static
                className=" z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {suggestions.map((suggestion: Suggestion) => (
                  <Combobox.Option
                    key={suggestion.legalRegistrationNumber}
                    value={suggestion.legalName}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        active ? "bg-blue-600 text-white" : "text-gray-900"
                      )
                    }
                    onClick={() => handleCompany(suggestion)}
                  >
                    {suggestion.legalName} ({suggestion.zip})
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </Combobox>

          <div className="relative mt-10">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                {intl.formatMessage({
                  id: "onboarding.search-company.divider",
                })}
              </span>
            </div>
          </div>
          <div className="mt-6 flex flex-row justify-between space-between">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="secondary"
              Icon={ArrowLeftIcon}
              iconPosition="leading"
              text={intl.formatMessage({
                id: "onboarding.company-form.button.previous",
              })}
            />
            <Button
              type="button"
              onClick={handleFillCompany}
              variant="primary"
              iconPosition="trailing"
              Icon={ArrowRightIcon}
              text={intl.formatMessage({
                id: "onboarding.search-company.goto-next",
              })}
            />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};
