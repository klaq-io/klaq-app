import { Combobox } from '@headlessui/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import { Button } from 'components';
import { subYears } from 'date-fns';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  OnboardingStatus,
  PerformingCategory,
} from '../../../interface/user.interface';
import { OnboardingLayout } from '../../../layouts/OnboardingLayout/OnboardingLayout';
import { useFetchUser } from '../../../redux/Login/hooks';
import { getUser } from '../../../redux/Login/selectors';
import {
  useUpdateOnboardingStatus,
  useUpdateUser,
} from '../../../redux/User/hooks';
import { PATHS } from '../../../routes';
import { classNames } from '../../../utils/utils';
import { initialValues, validationSchema } from './form';

enum STEP {
  REAL_NAME,
  CATEGORY,
  STAGE_NAME,
}

export enum selectOptions {
  YES,
  NO,
}

export const OnboardingPerformer = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP.REAL_NAME);
  const [query, setQuery] = useState('');
  const [selectCategory, setSelectCategory] = useState(undefined);

  const [{ isLoading }, updateUser] = useUpdateUser();
  const [, updateOnboardingStatus] = useUpdateOnboardingStatus();

  const [, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await updateUser({
        ...values,
        category:
          selectCategory == PerformingCategory.OTHER
            ? values.category
            : selectCategory,
        publicEmail: user?.email,
        publicPhone: user?.phone,
      });
      await updateOnboardingStatus(OnboardingStatus.OFFICE);
      navigate(PATHS.ONBOARDING_OFFICE);
    },
    enableReinitialize: true,
  });

  const translationsKeys = {
    [STEP.REAL_NAME]: 'real-name',
    [STEP.STAGE_NAME]: 'stage-name',
    [STEP.CATEGORY]: 'category',
  };

  const perfCategoryKeys = Object.keys(PerformingCategory);

  const perfCategory = perfCategoryKeys.map((key) =>
    intl.formatMessage({
      id: `onboarding.performer.select.category.${key.toLowerCase()}`,
    }),
  );

  const filteredPerformingCategory =
    query === ''
      ? perfCategoryKeys
      : perfCategoryKeys.filter((key, index) => {
          return perfCategory[index]
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  const resultArray =
    filteredPerformingCategory.length === 0
      ? [PerformingCategory.OTHER]
      : filteredPerformingCategory;

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    formik.setFieldValue('category', query);
  }, [selectCategory === PerformingCategory.OTHER]);

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1520092792133-42473bd8aeab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage(
            {
              id: `onboarding.performer.header.${translationsKeys[step]}`,
            },
            {
              blue: (chunks: any) => (
                <span className="text-klaq-600">{chunks}</span>
              ),
              stageName: formik.values.stageName,
              firstName: formik.values.firstName,
              email: user?.email,
              phone: user?.phone,
              br: () => <br />,
            },
          )}
        </h2>
      </div>
      <div className="mt-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {step === STEP.REAL_NAME && (
            <>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: `onboarding.performer.label.real-name.first-name`,
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
                    placeholder={intl.formatMessage({
                      id: `onboarding.performer.input.real-name.first-name`,
                    })}
                  />
                  {formik.errors.firstName && formik.touched.firstName ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `onboarding.performer.error.real-name.first-name`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: `onboarding.performer.label.real-name.last-name`,
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
                    placeholder={intl.formatMessage({
                      id: `onboarding.performer.input.real-name.last-name`,
                    })}
                  />
                  {formik.errors.firstName && formik.touched.firstName ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `onboarding.performer.error.real-name.last-name`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <label
                  htmlFor="birthday"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: `onboarding.performer.label.birthday`,
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.birthDate}
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    required
                    max={subYears(new Date(), 18).toISOString().split('T')[0]}
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
                    placeholder={intl.formatMessage({
                      id: `onboarding.performer.input.birthday`,
                    })}
                  />
                  {formik.errors.birthDate && formik.touched.birthDate ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `onboarding.performer.error.birthday`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {intl.formatMessage({
                  id: `onboarding.performer.description.${translationsKeys[step]}`,
                })}
              </p>
              <div className="flex flex-row-reverse justify-between space-between">
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  trailingIcon={
                    <ArrowRightIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                  }
                  onClick={() => setStep(STEP.CATEGORY)}
                  disabled={
                    !formik.values.firstName ||
                    !formik.values.lastName ||
                    !formik.values.birthDate
                  }
                >
                  {intl.formatMessage({
                    id: 'onboarding.performer.button.next',
                  })}
                </Button>
              </div>
            </>
          )}
          {step === STEP.CATEGORY && (
            <>
              <div>
                <div className="mt-2">
                  <Combobox
                    as="div"
                    value={selectCategory}
                    onChange={setSelectCategory}
                  >
                    <div className="relative mt-2">
                      <Combobox.Input
                        className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(key: any) =>
                          key !== null
                            ? intl.formatMessage({
                                id: `onboarding.performer.select.category.${key.toLowerCase()}`,
                              })
                            : ''
                        }
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Combobox.Button>
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {resultArray.map((key) => (
                          <Combobox.Option
                            key={key}
                            value={key}
                            className={({ active }) =>
                              classNames(
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                                active
                                  ? 'bg-klaq-600 text-white'
                                  : 'text-gray-900',
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    'block truncate',
                                    selected && 'font-semibold',
                                  )}
                                >
                                  {intl.formatMessage({
                                    id: `onboarding.performer.select.category.${key.toLowerCase()}`,
                                  })}
                                </span>

                                {selected && (
                                  <span
                                    className={classNames(
                                      'absolute inset-y-0 right-0 flex items-center pr-4',
                                      active ? 'text-white' : 'text-klaq-600',
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                  {selectCategory == PerformingCategory.OTHER && (
                    <div>
                      <div className="mt-2">
                        <input
                          onChange={formik.handleChange}
                          defaultValue={query}
                          value={formik.values.category}
                          id="category"
                          name="category"
                          type="text"
                          required
                          className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
                          placeholder={intl.formatMessage({
                            id: `onboarding.performer.input.category`,
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {intl.formatMessage({
                  id: `onboarding.performer.description.${translationsKeys[step]}`,
                })}
              </p>
              <div className="flex flex-row justify-between space-between">
                <Button
                  type="button"
                  variant="text"
                  color="secondary"
                  leadingIcon={
                    <ArrowLeftIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                  }
                  onClick={() => setStep(STEP.REAL_NAME)}
                >
                  {intl.formatMessage({
                    id: 'onboarding.performer.button.previous',
                  })}
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  trailingIcon={
                    <ArrowRightIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                  }
                  onClick={() => setStep(STEP.STAGE_NAME)}
                >
                  {intl.formatMessage({
                    id: 'onboarding.performer.button.next',
                  })}
                </Button>
              </div>
            </>
          )}
          {step === STEP.STAGE_NAME && (
            <>
              <div>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.stageName}
                    id="stageName"
                    name="stageName"
                    type="text"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-klaq-500 focus:bg-white focus:outline-none focus:ring-klaq-500 sm:text-sm"
                    placeholder={intl.formatMessage({
                      id: `onboarding.performer.input.stage-name`,
                    })}
                  />
                  {formik.errors.stageName && formik.touched.stageName ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `onboarding.performer.error.stage-name`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {intl.formatMessage({
                  id: `onboarding.performer.description.${translationsKeys[step]}`,
                })}
              </p>
              <div className="flex flex-row justify-between space-between">
                <Button
                  type="button"
                  variant="text"
                  color="secondary"
                  leadingIcon={
                    <ArrowLeftIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                  }
                  onClick={() => setStep(STEP.CATEGORY)}
                >
                  {intl.formatMessage({
                    id: 'onboarding.performer.button.previous',
                  })}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading || !formik.values.stageName}
                  isLoading={isLoading}
                >
                  {intl.formatMessage({
                    id: 'onboarding.performer.button.submit',
                  })}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingPerformer;
