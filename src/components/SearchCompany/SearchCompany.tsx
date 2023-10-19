import { Combobox } from "@headlessui/react";
import { FC, useState } from "react";
import { useFetchSuggestions } from "../../redux/Company/hooks";
import {
  CompanyLegalForm,
  Suggestion,
} from "../../interface/suggestion.interface";
import { classNames } from "../../utils/utils";
import {
  BuildingLibraryIcon,
  CheckIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";

type Props = {
  customerCompany?: Suggestion;
  setCustomerCompany: (suggestions: Suggestion) => void;
  placeholder: string;
  onboarding?: boolean;
};

export const SearchCompany: FC<Props> = (props: Props) => {
  const { customerCompany, setCustomerCompany, onboarding, placeholder } =
    props;
  const params = new URLSearchParams(document.location.search);
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [, fetchSuggestions] = useFetchSuggestions();

  const fetchCompanySuggestions = async (query: string) => {
    setSuggestions(await fetchSuggestions(query));
  };

  const handleOnboarding = (suggestion: Suggestion) => {
    navigate(
      `${PATHS.ONBOARDING_COMPANY}?companyType=${params.get(
        "companyType"
      )}&activityType=${suggestion.activityType}&inseeLegalFormCode=${
        suggestion.inseeLegalFormCode
      }&legalForm=${suggestion.legalForm}&legalName=${
        suggestion.legalName
      }&legalRegistrationNumber=${
        suggestion.legalRegistrationNumber
      }&legalVATNumber=${suggestion.legalVATNumber}&registrationDate=${
        suggestion.registrationDate
      }&address=${suggestion.address}&city=${suggestion.city}&zip=${
        suggestion.zip
      }&tradeName=${suggestion.tradeName}&country=${suggestion.country}`
    );
  };

  return (
    <Combobox as="div" value={customerCompany} onChange={setCustomerCompany}>
      <div className="relative mt-2">
        <Combobox.Input
          placeholder={placeholder}
          className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
          onChange={(event) => fetchCompanySuggestions(event.target.value)}
          displayValue={(suggestion: Suggestion) =>
            suggestion !== null ? suggestion?.legalName : ""
          }
        />
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {suggestions &&
            suggestions.length > 0 &&
            suggestions.map((suggestion: Suggestion) => (
              <Combobox.Option
                key={suggestion.legalRegistrationNumber}
                value={suggestion}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-klaq-600 text-white" : "text-gray-900"
                  )
                }
                onClick={() => onboarding && handleOnboarding(suggestion)}
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "flex flex-row truncate space-x-2",
                        selected && "font-semibold"
                      )}
                    >
                      {suggestion.legalForm === CompanyLegalForm.ASSOCIATION ? (
                        <UserGroupIcon className="h-5 w-5" aria-hidden="true" />
                      ) : suggestion.legalForm ===
                        CompanyLegalForm["Entrepreneur individuel"] ? (
                        <UserIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <BuildingLibraryIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-bold">{suggestion.legalName}</span>
                      <span>({suggestion.zip})</span>
                    </span>
                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-klaq-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default SearchCompany;
