import { useFormik } from "formik";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { companyFormSchema, initialCompanyFormValues } from "./form";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { CompanyLegalForm } from "../../../interface/suggestion.interface";

type CompanyLegalFormType = keyof typeof CompanyLegalForm;

export const OnboardingCompany = () => {
  const params = new URLSearchParams(document.location.search);

  const intl = useIntl();
  const formik = useFormik({
    initialValues:
      {
        activityType: params.get("activityType")!,
        inseeLegalFormCode: params.get("inseeLegalFormCode")!,
        legalForm: params.get("legalForm")!,
        legalName: params.get("legalName")!,
        legalRegistrationNumber: params.get("legalRegistrationNumber")!,
        legalVATNumber: params.get("legalVATNumber")!,
        registrationDate: params.get("registrationDate")!,
        address: params.get("address")!,
        city: params.get("city")!,
        zip: params.get("zip")!,
        tradeName: params.get("tradeName")!,
        country: params.get("country")!,
      } || initialCompanyFormValues,
    validationSchema: companyFormSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <OnboardingLayout backgroundImg="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80">
      <div>
        <h1 className="text-lg leading-6 font-semibold text-blue-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage({
            id: "onboarding.company-form.header",
          })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500"></p>
      </div>
      <div className="mt-8">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
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
                  Object.keys(CompanyLegalForm) as Array<CompanyLegalFormType>
                ).map((key) => (
                  <option key={key} value={CompanyLegalForm[key]}>
                    {CompanyLegalForm[key]}
                  </option>
                ))}
              </select>
              {formik.errors.legalName && formik.touched.legalForm ? (
                <p className="mt-2 text-sm text-danger-600">
                  {intl.formatMessage({
                    id: "onboarding.company-form.error.legal-form",
                  })}
                </p>
              ) : null}
            </div>
          </div>
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
                id="legalName"
                name="legalName"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: "onboarding.company-form.input.legal-registration-number",
                })}
              />
              {formik.errors.legalName && formik.touched.legalName ? (
                <p className="mt-2 text-sm text-danger-600">
                  {intl.formatMessage({
                    id: "onboarding.company-form.error.legal-registration-number",
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor="inseeLegalFormCode"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "onboarding.company-form.label.insee-code",
              })}
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.inseeLegalFormCode}
                id="inseeLegalFormCode"
                name="inseeLegalFormCode"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: "onboarding.company-form.input.insee-code",
                })}
              />
              {formik.errors.legalName && formik.touched.legalName ? (
                <p className="mt-2 text-sm text-danger-600">
                  {intl.formatMessage({
                    id: "onboarding.company-form.error.insee-code",
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor="activityType"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "onboarding.company-form.label.activity-type",
              })}
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.activityType}
                id="activityType"
                name="activityType"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: "onboarding.company-form.input.activity-type",
                })}
              />
              {formik.errors.legalName && formik.touched.legalName ? (
                <p className="mt-2 text-sm text-danger-600" id="email-error">
                  {intl.formatMessage({
                    id: "onboarding.company-form.error.activity-type",
                  })}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingCompany;
