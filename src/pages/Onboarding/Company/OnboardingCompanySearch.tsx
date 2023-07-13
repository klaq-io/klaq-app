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

export const OnboardingCompanySearch = () => {
  const intl = useIntl();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [, fetchSuggestions] = useFetchSuggestions();
  const navigate = useNavigate();

  const fetchCompanySuggestions = async (query: string) => {
    setSuggestions(await fetchSuggestions(query));
  };

  const handleCompany = (suggestion: Suggestion) => {
    navigate(
      `${PATHS.ONBOARDING_COMPANY}?activityType=${suggestion.activityType}&inseeLegalFormCode=${suggestion.inseeLegalFormCode}&legalForm=${suggestion.legalForm}&legalName=${suggestion.legalName}&legalRegistrationNumber=${suggestion.legalRegistrationNumber}&legalVATNumber=${suggestion.legalVATNumber}&registrationDate=${suggestion.registrationDate}&address=${suggestion.address}&city=${suggestion.city}&zip=${suggestion.zip}&tradeName=${suggestion.tradeName}&country=${suggestion.country}`
    );
  };

  const handleFillCompany = () => {
    navigate(PATHS.ONBOARDING_COMPANY);
  };

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1484069560501-87d72b0c3669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-blue-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: "onboarding.search-company.header",
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500"></p>
      </div>
      <div className="mt-10">
        <div>
          <div className="mx-auto shadow-2xl max-w-xl transform rounded-xl bg-white p-2 ring-1 ring-black ring-opacity-5 transition-all">
            <Combobox>
              <Combobox.Input
                className="w-full rounded-md border-0 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
                placeholder={intl.formatMessage({
                  id: "onboarding.search-company.input",
                })}
                onChange={(event) =>
                  fetchCompanySuggestions(event.target.value)
                }
              />
              {suggestions.length > 0 && (
                <Combobox.Options
                  static
                  className="-mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                >
                  {suggestions.map((suggestion: Suggestion) => (
                    <Combobox.Option
                      key={suggestion.legalRegistrationNumber}
                      value={suggestion.legalName}
                      className={({ active }) =>
                        classNames(
                          "cursor-default select-none px-4 py-2",
                          active && "bg-blue-600 text-white"
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
          </div>
          <div className="relative mt-16">
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
          <Button
            type="button"
            onClick={handleFillCompany}
            classes="mt-10 w-full"
            variant="primary"
            text={intl.formatMessage({
              id: "onboarding.search-company.goto-next",
            })}
          />
        </div>
      </div>
    </OnboardingLayout>
  );
};
