import { useIntl } from "react-intl";
import { OnboardingLayout } from "../../../layouts/OnboardingLayout/OnboardingLayout";
import { useFormik } from "formik";
import { SelectOptions, initialValues, validationSchema } from "./form";
import {
  useFetchCompany,
  useUpdateCompany,
} from "../../../redux/Company/hooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCompany } from "../../../redux/Company/selectors";
import { Button } from "../../../components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes";
import { useUpdateOnboardingStatus } from "../../../redux/User/hooks";
import { OnboardingStatus } from "../../../interface/user.interface";

type Props = {};

export const OnboardingOffice: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [{ isLoading: isFetchLoading }, fetchCompany] = useFetchCompany();
  const company = useSelector(getCompany);

  const [{ isLoading }, updateCompany] = useUpdateCompany();
  const [, updateOnboardingStatus] = useUpdateOnboardingStatus();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (values.select == SelectOptions.YES) {
        values.officeAddress = company?.address;
        values.officeCity = company?.city;
        values.officeZip = company?.zip;
        values.officeCountry = company?.country;
      }
      updateCompany(values);
      updateOnboardingStatus(OnboardingStatus.DONE);
      navigate(PATHS.DASHBOARD);
    },
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  return (
    <OnboardingLayout isLoading={isFetchLoading}>
      <div>
        <h1 className="text-lg leading-6 font-semibold text-klaq-600">
          Klaq.io
        </h1>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {intl.formatMessage(
            {
              id: `onboarding.office.header`,
            },
            {
              blue: (chunks: any) => (
                <span className="text-klaq-600">{chunks}</span>
              ),
              address: company?.address,
              city: company?.city,
              zip: company?.zip,
              country: company?.country,
            }
          )}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {intl.formatMessage({
            id: `onboarding.office.description`,
          })}
        </p>
      </div>
      <div className="mt-8">
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-6">
            <div className="mt-2">
              <select
                required
                onChange={formik.handleChange}
                value={formik.values.select}
                name="select"
                id="select"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
              >
                <option key={SelectOptions.YES} value={SelectOptions.YES}>
                  {intl.formatMessage({
                    id: `onboarding.office.select.yes`,
                  })}
                </option>
                <option key={SelectOptions.NO} value={SelectOptions.NO}>
                  {intl.formatMessage({
                    id: `onboarding.office.select.no`,
                  })}
                </option>
              </select>
            </div>
            {formik.values.select == SelectOptions.NO && (
              <>
                <div>
                  <label
                    htmlFor="officeAddress"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: `onboarding.office.label.address`,
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.officeAddress}
                      id="officeAddress"
                      name="officeAddress"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: `onboarding.office.input.address`,
                      })}
                    />
                    {formik.errors.officeAddress &&
                    formik.touched.officeAddress ? (
                      <p className="mt-2 text-sm text-danger-600">
                        {intl.formatMessage({
                          id: `onboarding.office.error.address`,
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="officeCity"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: `onboarding.office.label.city`,
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.officeCity}
                      id="officeCity"
                      name="officeCity"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: `onboarding.office.input.city`,
                      })}
                    />
                    {formik.errors.officeCity && formik.touched.officeCity ? (
                      <p className="mt-2 text-sm text-danger-600">
                        {intl.formatMessage({
                          id: `onboarding.office.error.city`,
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="officeZip"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: `onboarding.office.label.zip`,
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.officeZip}
                      id="officeZip"
                      name="officeZip"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: `onboarding.office.input.zip`,
                      })}
                    />
                    {formik.errors.officeZip && formik.touched.officeZip ? (
                      <p className="mt-2 text-sm text-danger-600">
                        {intl.formatMessage({
                          id: `onboarding.office.error.zip`,
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="officeCountry"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {intl.formatMessage({
                      id: `onboarding.office.label.country`,
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.officeCountry}
                      id="officeCountry"
                      name="officeCountry"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      placeholder={intl.formatMessage({
                        id: `onboarding.office.input.country`,
                      })}
                    />
                    {formik.errors.officeCountry &&
                    formik.touched.officeCountry ? (
                      <p className="mt-2 text-sm text-danger-600">
                        {intl.formatMessage({
                          id: `onboarding.office.error.country`,
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-row-reverse justify-between space-between">
              <Button
                isLoading={isLoading}
                type="submit"
                color="primary"
                variant="contained"
                disabled={
                  formik.values.select == SelectOptions.NO &&
                  (!formik.values.officeAddress ||
                    !formik.values.officeCity ||
                    !formik.values.officeZip ||
                    !formik.values.officeCountry)
                }
              >
                {intl.formatMessage({
                  id: "onboarding.office.submit",
                })}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingOffice;
