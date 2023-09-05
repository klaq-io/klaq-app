import { FC, useEffect } from "react";
import { PageLayout } from "../../../layouts";
import { useIntl } from "react-intl";
import { initialValues } from "./form";
import { useFormik } from "formik";
import { Button, MapAutocompleteInput } from "components";
import {
  useFetchCompany,
  useUpdateCompany,
} from "../../../redux/Company/hooks";
import { useSelector } from "react-redux";
import { getCompany } from "../../../redux/Company/selectors";
import { CompanyLegalForm } from "../../../interface/suggestion.interface";
import { PATHS } from "../../../routes";
import { useNavigate } from "react-router-dom";
import { Alert } from "components/Alert/Alert";
import { LegalInformationSkeleton, OfficeSkeleton } from "./Skeleton";
import { RetrieveAddress } from "interface/retrieve-address.interface";

type CompanyLegalFormType = keyof typeof CompanyLegalForm;

export const Company: FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [{ isLoading: isFetchingCompany }, fetchCompany] = useFetchCompany();
  const company = useSelector(getCompany);

  const [{ isLoading }, updateCompany] = useUpdateCompany();

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...company,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateCompany(values);
    },
  });

  const handleGoToSettings = () => {
    navigate(PATHS.SETTINGS);
  };

  const handleResetOffice = () => {
    formik.setValues({
      ...formik.values,
      officeAddress: company.officeAddress,
      officeCity: company.officeCity,
      officeCountry: company.officeCountry,
      officeZip: company.officeZip,
    });
  };

  const handleResetCompany = () => {
    formik.setValues({
      ...formik.values,
      address: company.address,
      city: company.city,
      country: company.country,
      zip: company.zip,
      legalRegistrationNumber: company.legalRegistrationNumber,
      legalVATNumber: company.legalVATNumber || "",
      legalForm: company.legalForm,
      legalName: company.legalName,
    });
  };

  const setAddressAutocompleteValues = (retrieveAddress: RetrieveAddress) => {
    formik.setValues({
      ...formik.values,
      officeAddress: retrieveAddress.address,
      officeCity: retrieveAddress.city,
      officeCountry: retrieveAddress.country,
      officeZip: retrieveAddress.zipcode,
    });
    formik.setFieldValue("officeCoordinates", retrieveAddress.coordinates);
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  return (
    <PageLayout>
      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.company.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.company.description",
              })}
            </p>
          </div>
          {isFetchingCompany ? (
            <LegalInformationSkeleton />
          ) : (
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.company.label.legal-name",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        value={formik.values.legalName}
                        onChange={formik.handleChange}
                        type="text"
                        name="legalName"
                        id="legalName"
                        placeholder={intl.formatMessage({
                          id: "settings.company.input.legal-name",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.legalName && formik.touched.legalName ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.company.error.legal-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.company.label.legal-form",
                      })}
                    </label>
                    <div className="mt-2">
                      <select
                        value={formik.values.legalForm}
                        onChange={formik.handleChange}
                        name="legalForm"
                        id="legalForm"
                        placeholder={intl.formatMessage({
                          id: "settings.company.input.legal-form",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
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
                            id: `settings.company.error.legal-form`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.company.label.legal-registration-number",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        value={formik.values.legalRegistrationNumber}
                        onChange={formik.handleChange}
                        type="text"
                        name="legalRegistrationNumber"
                        id="legalRegistrationNumber"
                        placeholder={intl.formatMessage({
                          id: "settings.company.input.legal-registration-number",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.legalRegistrationNumber &&
                      formik.touched.legalRegistrationNumber ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.company.error.legal-registration-number`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.company.label.legal-vat-number",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        value={formik.values.legalVATNumber}
                        onChange={formik.handleChange}
                        type="text"
                        name="legalVATNumber"
                        id="legalVATNumber"
                        placeholder={intl.formatMessage({
                          id: "settings.company.input.legal-vat-number",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.legalVATNumber &&
                      formik.touched.legalVATNumber ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.company.error.legal-vat-number`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.company.label.address",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.company.input.address",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.address && formik.touched.address ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.company.error.address`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {intl.formatMessage({
                        id: "settings.company.label.city",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.company.input.city",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.city && formik.touched.city ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.company.error.legal-vat-number`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.company.label.zip",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="zip"
                        id="zip"
                        value={formik.values.zip}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.company.input.zip",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.zip && formik.touched.zip ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.company.error.zip`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.company.label.country",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="country"
                        id="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.company.input.country",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.country && formik.touched.country ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.company.error.country`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Button
                  type="button"
                  variant="text"
                  color="secondary"
                  onClick={handleResetCompany}
                >
                  {intl.formatMessage({
                    id: "settings.button.cancel",
                  })}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="lg"
                  isLoading={isLoading}
                >
                  {intl.formatMessage({
                    id: "settings.button.submit",
                  })}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.office.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.office.description",
              })}
            </p>
          </div>
          {isFetchingCompany ? (
            <OfficeSkeleton />
          ) : (
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.office.label.autocomplete",
                      })}
                    </label>
                    <MapAutocompleteInput
                      setAddress={setAddressAutocompleteValues}
                      defaultAddress={`${formik.values.officeAddress} ${formik.values.officeZip} ${formik.values.officeCity} ${formik.values.officeCountry}`}
                    />
                  </div>
                  <div className="sm:col-span-full">
                    <div className="relative w-full mt-2">
                      <div
                        className="absolute inset-0 flex items-center w-full"
                        aria-hidden="true"
                      >
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                          {intl.formatMessage({
                            id: "settings.office.label.manual",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.office.label.address",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        value={formik.values.officeAddress}
                        onChange={formik.handleChange}
                        type="text"
                        name="officeAddress"
                        id="officeAddress"
                        placeholder={intl.formatMessage({
                          id: "settings.office.input.address",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.legalName &&
                      formik.touched.officeAddress ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.office.error.legal-name`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.office.label.city",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="officeCity"
                        id="officeCity"
                        value={formik.values.officeCity}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.office.input.city",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.officeCity && formik.touched.officeCity ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.office.error.city`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.office.label.zip",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="officeZip"
                        id="officeZip"
                        value={formik.values.officeZip}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.office.input.country",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.officeZip && formik.touched.officeZip ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.office.error.zip`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "settings.office.label.country",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="officeCountry"
                        id="officeCountry"
                        value={formik.values.officeCountry}
                        onChange={formik.handleChange}
                        placeholder={intl.formatMessage({
                          id: "settings.office.input.country",
                        })}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.country && formik.touched.country ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: `settings.office.error.country`,
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="sm:col-span-full">
                    <Alert
                      status="info"
                      text={intl.formatMessage(
                        {
                          id: "settings.office.moving-fees",
                        },
                        {
                          fee: "0.5",
                          b: (chunk: any) => (
                            <span className="text-blue-600 font-semibold">
                              {chunk.join()}
                            </span>
                          ),
                          a: (chunk: any) => (
                            <button
                              className="text-blue-600 font-semibold"
                              type={"button"}
                              onClick={handleGoToSettings}
                            >
                              {chunk}
                            </button>
                          ),
                        }
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Button
                  type="button"
                  variant="text"
                  color="secondary"
                  onClick={handleResetOffice}
                >
                  {intl.formatMessage({
                    id: "settings.button.cancel",
                  })}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="lg"
                  isLoading={isLoading}
                >
                  {intl.formatMessage({
                    id: "settings.button.submit",
                  })}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
