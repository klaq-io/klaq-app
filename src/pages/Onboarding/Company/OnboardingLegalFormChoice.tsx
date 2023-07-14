import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes";

const companyType = {
  association: "association",
  company: "company",
};

export const OnboardingLegalFormChoice = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const legalForm = [
    {
      id: 1,
      title: "company.title",
      description: "company.description",
      onClick: () => {
        navigate(
          `${PATHS.ONBOARDING_COMPANY_SEARCH}?companyType=${companyType.company}`
        );
      },
    },
    {
      id: 2,
      title: "association.title",
      description: "association.description",
      onClick: () => {
        navigate(
          `${PATHS.ONBOARDING_COMPANY_SEARCH}?companyType=${companyType.association}`
        );
      },
    },
    {
      id: 3,
      title: "intermittent.title",
      description: "intermittent.description",
      onClick: () => {},
    },
  ];

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1627735747011-b8d19caf7645?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=465&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-blue-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: "onboarding.legal-form-choice.header",
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500"></p>
      </div>
      <div className="mt-10">
        <ul
          role="list"
          className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm cursor-pointer"
        >
          {legalForm.map((item) => (
            <li
              onClick={item.onClick}
              key={item.id}
              className="relative flex items-center space-x-4 py-4 hover:bg-gray-50 "
            >
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">
                  <h2 className="min-w-0 text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: `onboarding.legal-form-choice.legal-form-type.${item.title}`,
                    })}
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                  <p className="truncate">
                    {intl.formatMessage({
                      id: `onboarding.legal-form-choice.legal-form-type.${item.description}`,
                    })}
                  </p>
                </div>
              </div>
              <ChevronRightIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      </div>
    </OnboardingLayout>
  );
};
