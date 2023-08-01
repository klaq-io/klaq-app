import { useIntl } from "react-intl";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { type } from "@testing-library/user-event/dist/type";
import { initialValues, validationSchema } from "./form";
import Button from "../../../components/Button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useFetchUser } from "../../../redux/Login/hooks";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/Login/selectors";
import { subYears } from "date-fns";
import { PerformingCategory } from "../../../interface/user.interface";
import { Combobox } from "@headlessui/react";
import { classNames } from "../../../utils/utils";
import { useUpdateUser } from "../../../redux/User/hooks";

type Props = {
  classes?: string;
};

enum STEP {
  STAGE_NAME,
  REAL_NAME,
  BIRTHDAY,
  PUBLIC_EMAIL,
  PUBLIC_PHONE,
  CATEGORY,
}

export enum selectOptions {
  YES,
  NO,
}

export const OnboardingPerformer: React.FC<Props> = (props: Props) => {
  const intl = useIntl();
  const [step, setStep] = useState(STEP.STAGE_NAME);
  const [query, setQuery] = useState("");
  const [selectCategory, setSelectCategory] = useState(undefined);

  const [{ isLoading }, updateUser] = useUpdateUser();

  const [, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      updateUser({
        ...values,
        category:
          selectCategory == PerformingCategory.OTHER
            ? values.category
            : selectCategory,
      });
    },
    enableReinitialize: true,
  });

  const translationsKeys = {
    [STEP.STAGE_NAME]: "stage-name",
    [STEP.REAL_NAME]: "real-name",
    [STEP.BIRTHDAY]: "birthday",
    [STEP.PUBLIC_EMAIL]: "public-email",
    [STEP.PUBLIC_PHONE]: "public-phone",
    [STEP.CATEGORY]: "category",
  };

  const perfCategoryKeys = Object.keys(PerformingCategory);

  const perfCategory = perfCategoryKeys.map((key) =>
    intl.formatMessage({
      id: `onboarding.performer.select.category.${key.toLowerCase()}`,
    })
  );

  const filteredPerformingCategory =
    query === ""
      ? perfCategoryKeys
      : perfCategoryKeys.filter((key, index) => {
          return perfCategory[index]
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  const handlePublicEmail = () => {
    if (formik.values.selectPublicMail == selectOptions.YES) {
      formik.setFieldValue("publicEmail", user.email);
    }
    setStep(STEP.PUBLIC_PHONE);
  };

  const handlePublicPhone = () => {
    if (formik.values.selectPublicPhone == selectOptions.YES) {
      formik.setFieldValue("publicPhone", user.phone);
    }
    setStep(STEP.CATEGORY);
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
            }
          )}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage({
            id: `onboarding.performer.description.${translationsKeys[step]}`,
          })}
        </p>
      </div>
      <div className="mt-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
              <div className="flex flex-row-reverse justify-between space-between">
                <Button
                  type="button"
                  variant="primary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.next",
                  })}
                  Icon={ArrowRightIcon}
                  iconPosition="trailing"
                  onClick={() => setStep(STEP.REAL_NAME)}
                  disabled={!formik.values.stageName}
                />
              </div>
            </>
          )}
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
              <div className="flex flex-row justify-between space-between">
                <Button
                  type="button"
                  variant="secondary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.previous",
                  })}
                  Icon={ArrowLeftIcon}
                  iconPosition="leading"
                  onClick={() => setStep(STEP.STAGE_NAME)}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.next",
                  })}
                  Icon={ArrowRightIcon}
                  iconPosition="trailing"
                  onClick={() => setStep(STEP.BIRTHDAY)}
                  disabled={!formik.values.firstName || !formik.values.lastName}
                />
              </div>
            </>
          )}
          {step === STEP.BIRTHDAY && (
            <>
              <div>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.birthDate}
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    required
                    max={subYears(new Date(), 18).toISOString().split("T")[0]}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `onboarding.performer.input.birthday`,
                    })}
                  />
                  {formik.errors.firstName && formik.touched.firstName ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `onboarding.performer.error.birthday`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-row justify-between space-between">
                <Button
                  type="button"
                  variant="secondary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.previous",
                  })}
                  Icon={ArrowLeftIcon}
                  iconPosition="leading"
                  onClick={() => setStep(STEP.REAL_NAME)}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.next",
                  })}
                  Icon={ArrowRightIcon}
                  iconPosition="trailing"
                  onClick={() => setStep(STEP.PUBLIC_EMAIL)}
                  disabled={!formik.values.birthDate}
                />
              </div>
            </>
          )}
          {step === STEP.PUBLIC_EMAIL && (
            <>
              <div>
                <div className="mt-2">
                  <select
                    required
                    onChange={formik.handleChange}
                    value={formik.values.selectPublicMail}
                    name="selectPublicMail"
                    id="selectPublicMail"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                  >
                    <option key={selectOptions.YES} value={selectOptions.YES}>
                      {intl.formatMessage({
                        id: `onboarding.performer.select.public-email.yes`,
                      })}
                    </option>
                    <option key={selectOptions.NO} value={selectOptions.NO}>
                      {intl.formatMessage({
                        id: `onboarding.performer.select.public-email.no`,
                      })}
                    </option>
                  </select>
                </div>
                {formik.values.selectPublicMail == selectOptions.NO && (
                  <div>
                    <div className="mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.publicEmail}
                        id="publicEmail"
                        name="publicEmail"
                        type="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: `onboarding.performer.input.public-email`,
                        })}
                      />
                      {formik.errors.firstName && formik.touched.firstName ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `onboarding.performer.error.public-email`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-between space-between">
                <Button
                  type="button"
                  variant="secondary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.previous",
                  })}
                  Icon={ArrowLeftIcon}
                  iconPosition="leading"
                  onClick={() => setStep(STEP.BIRTHDAY)}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.next",
                  })}
                  Icon={ArrowRightIcon}
                  iconPosition="trailing"
                  onClick={handlePublicEmail}
                  disabled={
                    !formik.values.publicEmail &&
                    formik.values.selectPublicMail == selectOptions.NO
                  }
                />
              </div>
            </>
          )}
          {step === STEP.PUBLIC_PHONE && (
            <>
              <div>
                <div className="mt-2">
                  <select
                    required
                    onChange={formik.handleChange}
                    value={formik.values.selectPublicPhone}
                    name="selectPublicPhone"
                    id="selectPublicPhone"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                  >
                    <option key={selectOptions.YES} value={selectOptions.YES}>
                      {intl.formatMessage({
                        id: `onboarding.performer.select.public-phone.yes`,
                      })}
                    </option>
                    <option key={selectOptions.NO} value={selectOptions.NO}>
                      {intl.formatMessage({
                        id: `onboarding.performer.select.public-phone.no`,
                      })}
                    </option>
                  </select>
                </div>
                {formik.values.selectPublicPhone == selectOptions.NO && (
                  <div>
                    <div className="mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.publicPhone}
                        id="publicPhone"
                        name="publicPhone"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: `onboarding.performer.input.public-phone`,
                        })}
                      />
                      {formik.errors.firstName && formik.touched.firstName ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `onboarding.performer.error.public-phone`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-between space-between">
                <Button
                  type="button"
                  variant="secondary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.previous",
                  })}
                  Icon={ArrowLeftIcon}
                  iconPosition="leading"
                  onClick={() => setStep(STEP.PUBLIC_EMAIL)}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.next",
                  })}
                  Icon={ArrowRightIcon}
                  iconPosition="trailing"
                  onClick={handlePublicPhone}
                  disabled={
                    !formik.values.publicPhone &&
                    formik.values.selectPublicPhone == selectOptions.NO
                  }
                />
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
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(key: any) =>
                          key !== null
                            ? intl.formatMessage({
                                id: `onboarding.performer.select.category.${key.toLowerCase()}`,
                              })
                            : ""
                        }
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Combobox.Button>
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPerformingCategory.map((key) => (
                          <Combobox.Option
                            key={key}
                            value={key}
                            className={({ active }) =>
                              classNames(
                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                active
                                  ? "bg-klaq-600 text-white"
                                  : "text-gray-900"
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    "block truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                  {intl.formatMessage({
                                    id: `onboarding.performer.select.category.${key.toLowerCase()}`,
                                  })}
                                </span>

                                {selected && (
                                  <span
                                    className={classNames(
                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                      active ? "text-white" : "text-klaq-600"
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
                          value={formik.values.category}
                          id="category"
                          name="category"
                          type="text"
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                          placeholder={intl.formatMessage({
                            id: `onboarding.performer.input.category`,
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-between">
                <Button
                  type="button"
                  variant="secondary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.previous",
                  })}
                  Icon={ArrowLeftIcon}
                  iconPosition="leading"
                  onClick={() => setStep(STEP.PUBLIC_PHONE)}
                />
                <Button
                  isLoading={isLoading}
                  type="submit"
                  variant="primary"
                  text={intl.formatMessage({
                    id: "onboarding.performer.button.submit",
                  })}
                  disabled={!selectCategory}
                />
              </div>
            </>
          )}
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingPerformer;
