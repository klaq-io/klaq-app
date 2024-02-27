import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { OnboardingLayout } from '../../../layouts/OnboardingLayout/OnboardingLayout';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes';
import { Button } from 'components';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const companyType = {
  association: 'association',
  company: 'company',
};

export const OnboardingLegalFormChoice = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const legalForm = [
    {
      id: 1,
      title: 'company.title',
      description: 'company.description',
      onClick: () => {
        navigate(
          `${PATHS.ONBOARDING_COMPANY_SEARCH}?companyType=${companyType.company}`,
        );
      },
    },
    {
      id: 2,
      title: 'association.title',
      description: 'association.description',
      onClick: () => {
        navigate(
          `${PATHS.ONBOARDING_COMPANY_SEARCH}?companyType=${companyType.association}`,
        );
      },
    },
    {
      id: 3,
      title: 'intermittent.title',
      description: 'intermittent.description',
      onClick: () => {
        navigate(PATHS.ONBOARDING_INTERMITTENT);
      },
    },
  ];

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1627735747011-b8d19caf7645?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=465&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: 'onboarding.legal-form-choice.header',
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500"></p>
      </div>
      <div className="mt-10">
        <ul role="list" className="space-y-3">
          {legalForm.map((item) => (
            <li
              onClick={item.onClick}
              key={item.id}
              className="overflow-hidden rounded-md border border-gray-200 bg-gray-50 px-6 py-4 shadow flex hover:bg-white cursor-pointer"
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
              <div className="flex items-center justify-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 flex items-center justify-center">
        <Button
          type="button"
          variant="text"
          color="secondary"
          trailingIcon={
            <ArrowRightIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          }
          onClick={() => {
            navigate(PATHS.ONBOARDING_NO_LEGAL_FORM);
          }}
        >
          {intl.formatMessage({
            id: 'onboarding.legal-form-choice.no-status.header',
          })}
        </Button>
      </div>
    </OnboardingLayout>
  );
};
