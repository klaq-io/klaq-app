import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { add, format, isSameDay } from "date-fns";
import { useFormik } from "formik";
import { InvoiceLayout } from "layouts";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchCompany } from "redux/Company/hooks";
import { getCompany } from "redux/Company/selectors";
import { useFetchCustomers } from "redux/Customer/hooks";
import { getCustomer } from "redux/Customer/selectors";
import { useFetchEvent } from "redux/Events/hooks";
import { getEventById } from "redux/Events/selectors";
import { useFetchUser } from "redux/Login/hooks";
import { getUser } from "redux/Login/selectors";
import { useFetchProductItems } from "redux/Products/hooks";
import { getAllProducts } from "redux/Products/selectors";
import { classNames, getEventSubtotal, getEventTax } from "utils/utils";
import { initialValues } from "./generateQuoteForm";
import { Combobox, Transition } from "@headlessui/react";
import { Button } from "components";

export const QuoteGenerate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const [, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const [{ isLoading }, fetchEvent] = useFetchEvent();
  const event = useSelector((state: any) => getEventById(state, id!));

  const [, fetchCompany] = useFetchCompany();
  const company = useSelector(getCompany);

  const [, fetchProducts] = useFetchProductItems();
  const products = useSelector(getAllProducts);

  const [, fetchCustomer] = useFetchCustomers();
  const customer = useSelector((state: any) =>
    getCustomer(state, event?.customer.id!)
  );

  const subtotal = event && getEventSubtotal(event.products, products);
  const tax = event && getEventTax(event.products, products);

  const formik = useFormik({
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const QUOTE_VALID_UNTIL: { [key: string]: Date } = {
    "15": add(new Date(formik.values.issuedOn), { days: 15 }),
    "30": add(new Date(formik.values.issuedOn), { days: 30 }),
    "45": add(new Date(formik.values.issuedOn), { days: 45 }),
    "90": add(new Date(formik.values.issuedOn), { days: 90 }),
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  const handleSetValidUntilDate = (date: Date) => {
    formik.setValues({
      ...formik.values,
      validUntil: format(date, "yyyy-MM-dd"),
    });
  };

  const handleAddElement = () => {
    formik.setValues({
      ...formik.values,
      products: [...formik.values.products, initialValues.products[0]],
    });
  };

  const handleDeleteElement = (index: number) => {
    formik.setValues({
      ...formik.values,
      products: formik.values.products.filter(
        (product, productIndex) => productIndex !== index
      ),
    });
  };

  useEffect(() => {
    fetchUser();
    fetchEvent(id!);
    fetchCompany();
    fetchProducts();
    fetchCustomer();
  }, []);

  return (
    <>
      <button onClick={() => alert(JSON.stringify(formik.values, null, 2))}>
        DEBUG
      </button>
      <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 min-h-screen">
        <div className="grid grid-cols-2 bg-gray-100 shadow-sm ring-1 ring-gray-900/5 sm:rounded-l-xl overflow-hidden col-span-2 py-12 px-12">
          <InvoiceLayout>
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              {intl.formatMessage({
                id: "quote.header",
              })}
            </h2>
            <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <div className="">
                  <dt className="inline text-gray-500">
                    {intl.formatMessage({
                      id: "quote.issued-on",
                    })}
                  </dt>{" "}
                  <dd className="inline text-gray-700">
                    <time dateTime={formik.values.issuedOn}>
                      {formik.values.issuedOn
                        ? format(new Date(formik.values.issuedOn), "dd/MM/yyyy")
                        : null}
                    </time>
                  </dd>
                </div>
                <div className="mt-2">
                  <dt className="inline text-gray-500">
                    {intl.formatMessage({
                      id: "quote.due-on",
                    })}
                  </dt>{" "}
                  <dd className="inline text-gray-700">
                    <time dateTime={formik.values.validUntil}>
                      {formik.values.validUntil
                        ? format(
                            new Date(formik.values.validUntil),
                            "dd/MM/yyyy"
                          )
                        : null}
                    </time>
                  </dd>
                </div>
              </div>
              <div className="sm:col-span-1 -mt-4 ml-64">
                {user.logoUrl ? (
                  <img src={user.logoUrl} width={64} height={64} />
                ) : null}
              </div>
              <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                <dt className="font-semibold text-gray-900">
                  {intl.formatMessage({
                    id: "quote.from",
                  })}
                </dt>
                <dd className="mt-2 text-gray-500">
                  <span className="font-medium text-gray-900">
                    {company.legalName}
                  </span>
                  <br />
                  {company.address}
                  <br />
                  {company.zip}, {company.city} - {company.country}
                </dd>
              </div>
              <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                <dt className="font-semibold text-gray-900">
                  {intl.formatMessage({
                    id: "quote.to",
                  })}
                </dt>
                {customer && (
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-gray-900">
                      {customer.name}
                    </span>
                    <br />
                    {customer.address}
                    <br />
                    {customer.zipcode}, {customer.city} - {customer.country}
                  </dd>
                )}
              </div>
            </dl>
            <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
              <colgroup>
                <col className="w-full" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="border-b border-gray-200 text-gray-900">
                <tr>
                  <th scope="col" className="px-0 py-3 font-semibold">
                    {intl.formatMessage({
                      id: "quote.table.products",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.table.quantity",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.table.unit-price",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="py-3 pl-8 pr-0 text-right font-semibold"
                  >
                    {intl.formatMessage({
                      id: "quote.table.total",
                    })}
                  </th>
                </tr>
              </thead>

              <tbody>
                {formik.values.products &&
                  formik.values.products.length > 0 &&
                  formik.values.products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="max-w-0 px-0 py-5 align-top">
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-gray-500">
                          {product.description}
                        </div>
                      </td>
                      <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                        {product.quantity}
                      </td>
                      <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                        {product.price} €
                      </td>
                      <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
                        {product.quantity * product.price}€
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </InvoiceLayout>
        </div>
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-r-xl overflow-hidden col-span-1 flex flex-col">
          <div className="py-6 px-4 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {intl.formatMessage({
                  id: "quote.generate.header",
                })}
              </h3>
              <button
                onClick={handlePrevious}
                type="button"
                className="ml-auto rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6">
              <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col space-y-4">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "quote.generate.label.customer",
                    })}
                  </h3>
                  <div>
                    <input
                      type="text"
                      name="issuedOn"
                      className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      value={event?.customer.name}
                      disabled
                    />
                  </div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "quote.generate.section.details",
                    })}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "quote.generate.label.issued-on",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="issuedOn"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        onChange={formik.handleChange}
                        value={formik.values.issuedOn}
                      />
                      {formik.errors.issuedOn && formik.touched.issuedOn ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: "",
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "quote.generate.label.valid-until",
                      })}
                    </label>
                    <div className="mt-2">
                      <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                        {Object.keys(QUOTE_VALID_UNTIL).map((validUntil) => (
                          <button
                            key={`valid-until-${validUntil}`}
                            type="button"
                            onClick={() =>
                              handleSetValidUntilDate(
                                QUOTE_VALID_UNTIL[validUntil]
                              )
                            }
                            className={classNames(
                              isSameDay(
                                new Date(formik.values.validUntil),
                                add(new Date(formik.values.issuedOn), {
                                  days: Number(validUntil),
                                })
                              )
                                ? "bg-klaq-600 text-white hover:bg-klaq-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaq-600"
                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                              "rounded-md px-3.5 py-2.5 text-sm font-semibold shadom-sm col-span-1"
                            )}
                          >
                            {intl.formatMessage({
                              id: `quote.generate.input.valid-until.${validUntil}`,
                            })}
                          </button>
                        ))}
                        <input
                          type="date"
                          name="validUntil"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6 font-semibold"
                          onChange={formik.handleChange}
                          value={formik.values.validUntil}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "quote.generate.section.products",
                    })}
                  </h3>
                  <div>
                    {formik.values.products.map((product, index) => (
                      <div className="bg-klaq-100 p-6 rounded-md mt-2 space-y-2">
                        <div>
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            {intl.formatMessage({
                              id: "products.new-product.label.name",
                            })}
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name={`products.${index}.name`}
                              placeholder={intl.formatMessage({
                                id: "products.new-product.input.name",
                              })}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                              onChange={formik.handleChange}
                              value={formik.values.products[index].name}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            {intl.formatMessage({
                              id: "products.new-product.label.short-description",
                            })}
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name={`products.${index}.description`}
                              placeholder={intl.formatMessage({
                                id: "products.new-product.input.short-description",
                              })}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                              onChange={formik.handleChange}
                              value={formik.values.products[index].description}
                            />
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="w-1/3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              {intl.formatMessage({
                                id: "quote.generate.label.products.quantity",
                              })}
                            </label>
                            <div className="mt-2">
                              <input
                                onChange={formik.handleChange}
                                value={formik.values.products[index].quantity}
                                type="number"
                                name={`products.${index}.quantity`}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="ml-2 w-2/3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              {intl.formatMessage({
                                id: "products.new-product.label.default-price",
                              })}
                            </label>
                            <div className="mt-2">
                              <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <span className="text-gray-500 sm:text-sm">
                                    €
                                  </span>
                                </div>
                                <input
                                  onChange={formik.handleChange}
                                  value={formik.values.products[index].price}
                                  type="number"
                                  name={`products.${index}.price`}
                                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                                  placeholder={intl.formatMessage({
                                    id: "products.new-product.input.default-price",
                                  })}
                                  aria-describedby="price-currency"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                  <span
                                    className="text-gray-500 sm:text-sm"
                                    id="price-currency"
                                  >
                                    EUR
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {formik.values.products.length !== 1 ? (
                          <div className="mt-4">
                            <Button
                              onClick={() => handleDeleteElement(index)}
                              type="button"
                              leadingIcon={<TrashIcon className="w-5 h-5" />}
                              variant="text"
                              color="primary"
                              size="sm"
                            >
                              {intl.formatMessage({
                                id: "quote.generate.button.delete-product",
                              })}
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <div>
                    <Button
                      onClick={handleAddElement}
                      type="button"
                      leadingIcon={<PlusIcon className="w-5 h-5" />}
                      variant="text"
                      color="primary"
                    >
                      {intl.formatMessage({
                        id: "quote.generate.button.add-product",
                      })}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
