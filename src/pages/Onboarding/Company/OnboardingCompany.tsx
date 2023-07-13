import { useFormik } from "formik";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { companyFormSchema, initialCompanyFormValues } from "./form";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyLegalForm } from "../../../interface/suggestion.interface";
import { Button } from "../../../components/Button/Button";
import { useCreateCompany } from "../../../redux/Company/hooks";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

type CompanyLegalFormType = keyof typeof CompanyLegalForm;

const STEP = {
  COMPANY_INFORMATION: 1,
  VTA: 2,
  ADDRESS: 3,
};

export const OnboardingCompany = () => {
  const params = new URLSearchParams(document.location.search);
  const navigate = useNavigate();
  const [{ isLoading }, createCompany] = useCreateCompany();
  const [step, setStep] = useState(STEP.COMPANY_INFORMATION);

  const intl = useIntl();
  const formik = useFormik({
    initialValues:
      {
        activityType: params.get("activityType")!,
        inseeLegalFormCode: params.get("inseeLegalFormCode")!,
        legalForm: params.get("legalForm")!,
        legalName: params.get("legalName")!,
        legalRegistrationNumber: params.get("legalRegistrationNumber")!,
        legalVATNumber:
          params.get("legalVATNumber") === "null" ||
          !!params.get("legalVATNumber")
            ? ""
            : params.get("legalVATNumber") || "",
        registrationDate: params.get("registrationDate")!,
        address: params.get("address")!,
        city: params.get("city")!,
        zip: params.get("zip")!,
        tradeName: params.get("tradeName")!,
        country: params.get("country")!,
      } || initialCompanyFormValues,
    validationSchema: companyFormSchema,
    onSubmit: (values) => {
      const registrationDate = new Date(values.registrationDate);
      createCompany({ ...values, registrationDate });
    },
  });

  const handleBackToLastPage = () => {
    navigate(-1);
  };

  const handleStep = (n: number) => {
    setStep(n);
  };

  const translationKeys = {
    [STEP.COMPANY_INFORMATION]: "company",
    [STEP.VTA]: "vta",
    [STEP.ADDRESS]: "address",
  };

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80">
      <div>
        <h1 className="mt-8 text-lg leading-6 font-semibold text-blue-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: `onboarding.company-form.header.${translationKeys[step]}`,
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage({
            id: `onboarding.company-form.description.${translationKeys[step]}`,
          })}
        </p>
      </div>
      <div className="mt-8">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {step === STEP.COMPANY_INFORMATION && (
            <>
              {/** legalName */}
              <div>
                <label
                  htmlFor="legalName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "onboarding.company-form.label.legal-name",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.legalName}
                    id="legalName"
                    name="legalName"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "onboarding.company-form.input.legal-name",
                    })}
                  />
                  {formik.errors.legalName && formik.touched.legalName ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: "onboarding.company-form.error.legal-name",
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/** legalForm */}
              <div>
                <label
                  htmlFor="legalForm"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "onboarding.company-form.label.legal-form",
                  })}
                </label>
                <div className="mt-2">
                  <select
                    onChange={formik.handleChange}
                    value={formik.values.legalForm}
                    id="legalForm"
                    name="legalForm"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "onboarding.company-form.input.legal-form",
                    })}
                  >
                    {(
                      Object.keys(
                        CompanyLegalForm
                      ) as Array<CompanyLegalFormType>
                    ).map((key) => (
                      <option key={key} value={CompanyLegalForm[key]}>
                        {CompanyLegalForm[key]}
                      </option>
                    ))}
                  </select>
                  {formik.errors.legalForm && formik.touched.legalForm ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: "onboarding.company-form.error.legal-form",
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/** legalRegistrationNumber */}
              <div>
                <label
                  htmlFor="legalRegistrationNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "onboarding.company-form.label.legal-registration-number",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.legalRegistrationNumber}
                    id="legalRegistrationNumber"
                    name="legalRegistrationNumber"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "onboarding.company-form.input.legal-registration-number",
                    })}
                  />
                  {formik.errors.legalRegistrationNumber &&
                  formik.touched.legalRegistrationNumber ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: "onboarding.company-form.error.legal-registration-number",
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
                  onClick={handleBackToLastPage}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={"Continuer"}
                  Icon={ArrowRightIcon}
                  iconPosition="trailing"
                  onClick={() => handleStep(STEP.VTA)}
                  disabled={
                    !formik.values.legalName ||
                    !formik.values.legalForm ||
                    !formik.values.legalRegistrationNumber
                  }
                />
              </div>
            </>
          )}
          {step === STEP.VTA && (
            <>
              {/**  legalVATNumber */}
              <div>
                <label
                  htmlFor="legalVATNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "onboarding.company-form.label.legal-vat-number",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.legalVATNumber}
                    id="legalVATNumber"
                    name="legalVATNumber"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "onboarding.company-form.input.legal-vat-number",
                    })}
                  />
                  {formik.errors.legalVATNumber &&
                  formik.touched.legalVATNumber ? (
                    <p
                      className="mt-2 text-sm text-danger-600"
                      id="email-error"
                    >
                      {intl.formatMessage({
                        id: "onboarding.company-form.error.legal-vat-number",
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
                  onClick={() => handleStep(STEP.COMPANY_INFORMATION)}
                />
                <Button
                  type="button"
                  variant="primary"
                  text={"Continuer"}
                  Icon={ArrowRightIcon}
                  iconPosition="trailing"
                  onClick={() => handleStep(STEP.ADDRESS)}
                  disabled={
                    !formik.values.legalName ||
                    !formik.values.legalForm ||
                    !formik.values.legalRegistrationNumber
                  }
                />
              </div>
            </>
          )}
          {step === STEP.ADDRESS && (
            <>
              {/**  address*/}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "onboarding.company-form.label.address",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.address}
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "onboarding.company-form.input.address",
                    })}
                  />
                  {formik.errors.address && formik.touched.address ? (
                    <p
                      className="mt-2 text-sm text-danger-600"
                      id="email-error"
                    >
                      {intl.formatMessage({
                        id: "onboarding.company-form.error.address",
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/**  city*/}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "onboarding.company-form.label.city",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.city}
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "onboarding.company-form.input.city",
                    })}
                  />
                  {formik.errors.city && formik.touched.city ? (
                    <p
                      className="mt-2 text-sm text-danger-600"
                      id="email-error"
                    >
                      {intl.formatMessage({
                        id: "onboarding.company-form.error.city",
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/**  zip*/}
              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "onboarding.company-form.label.zip",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.zip}
                    id="zip"
                    name="zip"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "onboarding.company-form.input.zip",
                    })}
                  />
                  {formik.errors.zip && formik.touched.zip ? (
                    <p
                      className="mt-2 text-sm text-danger-600"
                      id="email-error"
                    >
                      {intl.formatMessage({
                        id: "onboarding.company-form.error.zip",
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/**  country*/}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "onboarding.company-form.label.country",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.country}
                    id="country"
                    name="country"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "onboarding.company-form.input.country",
                    })}
                  />
                  {formik.errors.country && formik.touched.country ? (
                    <p
                      className="mt-2 text-sm text-danger-600"
                      id="email-error"
                    >
                      {intl.formatMessage({
                        id: "onboarding.company-form.error.country",
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
                  onClick={() => handleStep(STEP.VTA)}
                />
                <Button
                  type="submit"
                  variant="primary"
                  text={"Ajouter mon entreprise "}
                />
              </div>
            </>
          )}
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingCompany;
