import { useIntl } from "react-intl";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { type } from "@testing-library/user-event/dist/type";
import { initialValues, validationSchema } from "./form";
import Button from "../../../components/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useFetchUser } from "../../../redux/Login/hooks";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/Login/selectors";
import { subYears } from "date-fns";

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

export const OnboardingPerformer: React.FC<Props> = (props: Props) => {
  const intl = useIntl();
  const [step, setStep] = useState(STEP.STAGE_NAME);
  const [, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
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

  useEffect(() => {
    fetchUser();
  }, []);

  console.log(user);

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1520092792133-42473bd8aeab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-blue-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage(
            {
              id: `onboarding.performer.header.${translationsKeys[step]}`,
            },
            {
              blue: (chunks: any) => (
                <span className="text-blue-600">{chunks}</span>
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                  text={"Continuer"}
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                  text={"Précédent"}
                  Icon={ArrowLeftIcon}
                  iconPosition="leading"
                  onClick={() => setStep(STEP.STAGE_NAME)}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={"Continuer"}
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                  text={"Précédent"}
                  Icon={ArrowLeftIcon}
                  iconPosition="leading"
                  onClick={() => setStep(STEP.REAL_NAME)}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={"Continuer"}
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `onboarding.${type}-form.input.legal-form`,
                    })}
                  >
                    <option value="yes">
                      {intl.formatMessage({
                        id: `onboarding.performer.select.public-email.yes`,
                      })}
                    </option>
                    <option value="no">
                      {intl.formatMessage({
                        id: `onboarding.performer.select.public-email.no`,
                      })}
                    </option>
                  </select>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.publicEmail}
                    id="publicEmail"
                    name="publicEmail"
                    type="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
              <div className="flex flex-row justify-between space-between">
                <Button
                  type="button"
                  variant="secondary"
                  text={"Précédent"}
                  Icon={ArrowLeftIcon}
                  iconPosition="leading"
                  onClick={() => setStep(STEP.BIRTHDAY)}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={"Continuer"}
                  Icon={ArrowRightIcon}
                  iconPosition="trailing"
                  onClick={() => setStep(STEP.PUBLIC_PHONE)}
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
