import { useFormik } from "formik";
import SidePanel from "components/SidePanel";
import { initialValues, validationSchema } from "./form";
import { useIntl } from "react-intl";
import { Button } from "components";
import { BuildingLibraryIcon, UserIcon } from "@heroicons/react/24/outline";
import { CustomerType } from "../../redux/Customer/slices";
import { SearchCompany } from "components";
import { Suggestion } from "../../interface/suggestion.interface";
import { FC, useState } from "react";
import { useCreateCustomer } from "../../redux/Customer/hooks";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const NewCustomer: FC<Props> = (props: Props) => {
  const intl = useIntl();
  const { open, setOpen } = props;
  const [customerCompany, setCustomerCompany] = useState<
    Suggestion | undefined
  >();

  const [, createCustomer] = useCreateCustomer();

  const formik = useFormik({
    initialValues: customerCompany
      ? {
          ...initialValues,
          type: CustomerType.COMPANY,
          name: customerCompany.legalName,
          legalRegistrationNumber: customerCompany.legalRegistrationNumber,
          legalVATNumber: customerCompany.legalVATNumber,
          address: customerCompany.address,
          zipcode: customerCompany.zip,
          city: customerCompany.city,
          country: customerCompany.country,
        }
      : initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (formik.values.type === CustomerType.PRIVATE) {
        values.legalRegistrationNumber = "";
        values.legalVATNumber = "";
        values.address = "";
        values.zipcode = "";
        values.city = "";
        values.country = "";
      }
      createCustomer(values);
      setOpen(false);
      resetForm();
      setCustomerCompany(undefined);
    },
    enableReinitialize: true,
  });

  const handleSetCompany = (customerType: CustomerType) => {
    formik.setValues({ ...formik.values, type: customerType }, false);
  };

  return (
    <SidePanel
      open={open}
      setOpen={setOpen}
      titleId={"customers.new-customer.header"}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div>
            <label
              htmlFor="client-type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "customers.new-customer.label.client-type",
              })}
            </label>
            <div className="mt-2 flex flex-row space-x-4">
              <Button
                variant="contained"
                color={
                  formik.values.type === CustomerType.COMPANY
                    ? "primary"
                    : "secondary"
                }
                onClick={() => handleSetCompany(CustomerType.COMPANY)}
                type="button"
                leadingIcon={
                  <BuildingLibraryIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                }
              >
                {intl.formatMessage({
                  id: "customers.new-customer.input.client-type.company",
                })}
              </Button>
              <Button
                variant="contained"
                color={
                  formik.values.type === CustomerType.PRIVATE
                    ? "primary"
                    : "secondary"
                }
                onClick={() => handleSetCompany(CustomerType.PRIVATE)}
                type="button"
                leadingIcon={
                  <UserIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                }
              >
                {intl.formatMessage({
                  id: "customers.new-customer.input.client-type.private",
                })}
              </Button>
            </div>
          </div>
          {formik.values.type === CustomerType.COMPANY ? (
            <>
              <div>
                <label
                  htmlFor="look-for-company"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "customers.new-customer.label.look-for-company",
                  })}
                </label>
                <div className="mt-2">
                  <SearchCompany
                    customerCompany={customerCompany}
                    setCustomerCompany={setCustomerCompany}
                    placeholder={intl.formatMessage({
                      id: "onboarding.search-company.input",
                    })}
                  />
                </div>
              </div>
              {/** divider */}
              <div className="mt-4">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-gray-500">
                      <BuildingLibraryIcon
                        className="h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </div>
              {/** name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "customers.new-customer.label.name",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    id="name"
                    name="name"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `customers.new-customer.input.name`,
                    })}
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `customers.new-customer.error.name`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/** address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "customers.new-customer.label.address",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.address}
                    id="address"
                    name="address"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `customers.new-customer.input.address`,
                    })}
                  />
                  {formik.errors.address && formik.touched.address ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `customers.new-customer.error.address`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/** city */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "customers.new-customer.label.city",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.city}
                    id="city"
                    name="city"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `customers.new-customer.input.city`,
                    })}
                  />
                  {formik.errors.city && formik.touched.city ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `customers.new-customer.error.city`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/** zipcode */}
              <div>
                <label
                  htmlFor="zipcode"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "customers.new-customer.label.zip",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.zipcode}
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `customers.new-customer.input.zip`,
                    })}
                  />
                  {formik.errors.zipcode && formik.touched.zipcode ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `customers.new-customer.error.zip`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/** country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "customers.new-customer.label.country",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.country}
                    id="country"
                    name="country"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `customers.new-customer.input.country`,
                    })}
                  />
                  {formik.errors.country && formik.touched.country ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `customers.new-customer.error.country`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/** legalRegistrationNumber */}
              <div>
                <label
                  htmlFor="siret"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "customers.new-customer.label.siret",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.legalRegistrationNumber}
                    id="legalRegistrationNumber"
                    name="legalRegistrationNumber"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `customers.new-customer.input.siret`,
                    })}
                  />
                  {formik.errors.legalRegistrationNumber &&
                  formik.touched.legalRegistrationNumber ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `customers.new-customer.error.siret`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
              {/** VAT */}
              <div>
                <label
                  htmlFor="vat-number"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {intl.formatMessage({
                    id: "customers.new-customer.label.vat-number",
                  })}
                </label>
                <div className="mt-2">
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.legalVATNumber}
                    id="legalVATNumber"
                    name="legalVATNumber"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: `customers.new-customer.input.vat-number`,
                    })}
                  />
                  {formik.errors.legalVATNumber &&
                  formik.touched.legalVATNumber ? (
                    <p className="mt-2 text-sm text-danger-600">
                      {intl.formatMessage({
                        id: `customers.new-customer.error.vat-number`,
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
          {/** divider */}
          <div>
            <div className="mt-4 relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-gray-500">
                  <UserIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
          </div>
          {/** firstname */}
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "customers.new-customer.label.first-name",
              })}
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.firstName}
                id="firstname"
                name="firstName"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: `customers.new-customer.input.first-name`,
                })}
              />
              {formik.errors.firstName && formik.touched.firstName ? (
                <p className="mt-2 text-sm text-danger-600">
                  {intl.formatMessage({
                    id: `customers.new-customer.error.first-name`,
                  })}
                </p>
              ) : null}
            </div>
          </div>
          {/** lastname */}
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "customers.new-customer.label.last-name",
              })}
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.lastName}
                id="lastName"
                name="lastName"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: `customers.new-customer.input.last-name`,
                })}
              />
              {formik.errors.lastName && formik.touched.lastName ? (
                <p className="mt-2 text-sm text-danger-600">
                  {intl.formatMessage({
                    id: `customers.new-customer.error.last-name`,
                  })}
                </p>
              ) : null}
            </div>
          </div>
          {/** email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "customers.new-customer.label.email",
              })}
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.email}
                id="email"
                name="email"
                type="email"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: `customers.new-customer.input.email`,
                })}
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="mt-2 text-sm text-danger-600">
                  {intl.formatMessage({
                    id: `customers.new-customer.error.email`,
                  })}
                </p>
              ) : null}
            </div>
          </div>
          {/** phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {intl.formatMessage({
                id: "customers.new-customer.label.phone",
              })}
            </label>
            <div className="mt-2">
              <input
                onChange={formik.handleChange}
                value={formik.values.phone}
                id="phone"
                name="phone"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                placeholder={intl.formatMessage({
                  id: `customers.new-customer.input.phone`,
                })}
              />
              {formik.errors.phone && formik.touched.phone ? (
                <p className="mt-2 text-sm text-danger-600">
                  {intl.formatMessage({
                    id: `customers.new-customer.error.phone`,
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" color="primary" variant="contained">
              {intl.formatMessage({ id: `customers.new-customer.submit` })}
            </Button>
          </div>
        </div>
      </form>
    </SidePanel>
  );
};

export default NewCustomer;
