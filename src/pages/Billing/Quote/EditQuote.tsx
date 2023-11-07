import { Combobox } from "@headlessui/react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, MapAutocompleteInput } from "components";
import { Alert } from "components/Alert/Alert";
import { add, format, isSameDay } from "date-fns";
import { useFormik } from "formik";
import { RetrieveAddress } from "interface/retrieve-address.interface";
import { InvoiceLayout } from "layouts";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchCompany } from "redux/Company/hooks";
import { getCompany } from "redux/Company/selectors";
import { useFetchCustomers, useUpdateCustomer } from "redux/Customer/hooks";
import { getCustomer } from "redux/Customer/selectors";
import { useFetchEvent } from "redux/Events/hooks";
import { getEventById } from "redux/Events/selectors";
import { useFetchUser } from "redux/Login/hooks";
import { getUser } from "redux/Login/selectors";
import { useFetchProductItems } from "redux/Products/hooks";
import { getAllProducts } from "redux/Products/selectors";
import { ProductItem } from "redux/Products/slices";
import {
  useCreateQuote,
  useEditQuote,
  useFetchQuote,
  useFetchQuotes,
} from "redux/Quote/hooks";
import { getNextQuoteNumber, getQuoteById } from "redux/Quote/selectors";
import { classNames, formatSiret, shortenString } from "utils/utils";
import { initialValues, validationSchema } from "./generateQuoteForm";
import { CustomerType } from "redux/Customer/slices";
import { getMainEvent } from "redux/MainEvent/selectors";
import { useFetchMainEvent } from "redux/MainEvent/hooks";

export const EditQuote = () => {
  const { id, eventId } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const [, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const [{ isLoading }, fetchEvent] = useFetchMainEvent();
  const event = useSelector((state: any) => getMainEvent(state, eventId!));

  const [, fetchCompany] = useFetchCompany();
  const company = useSelector(getCompany);

  const [, fetchProducts] = useFetchProductItems();
  const products = useSelector(getAllProducts);

  const [, fetchCustomer] = useFetchCustomers();
  const customer = useSelector((state: any) =>
    getCustomer(state, event?.customer.id!)
  );

  const [{ isLoading: isUpdatingQuote }, updateQuote] = useEditQuote();

  const [, updateCustomer] = useUpdateCustomer();

  const [, fetchQuote] = useFetchQuote();
  const quote = useSelector((state: any) => getQuoteById(state, id!));

  // todo: frais VHR à fill

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      ...quote,
      issuedOn: format(new Date(quote?.issuedOn || new Date()), "yyyy-MM-dd"),
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      updateQuote(values, id!);
      if (values.customer.address && values.customer.zipcode) {
        updateCustomer(
          {
            ...event?.customer!,
            address: values.customer.address,
            zipcode: values.customer.zipcode,
            city: values.customer.city,
            country: values.customer.country,
          },
          event?.customer.id!
        );
      }
    },
    enableReinitialize: true,
  });

  const filteredProducts = (idx: number) =>
    idx && formik.values.products[idx].title === ""
      ? []
      : products.filter((productItem) => {
          return productItem.title
            .toLowerCase()
            .includes(formik.values.products[idx].title.toLowerCase());
        });

  const QUOTE_VALID_UNTIL: { [key: string]: Date } = {
    "15": add(new Date(formik.values.issuedOn), { days: 15 }),
    "30": add(new Date(formik.values.issuedOn), { days: 30 }),
    "45": add(new Date(formik.values.issuedOn), { days: 45 }),
    "90": add(new Date(formik.values.issuedOn), { days: 90 }),
  };

  const VTA_RATE = ["0", "2.1", "5.5", "10", "20"];

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

  const handleAutocompleteElement = (
    index: number,
    suggestion: ProductItem
  ) => {
    formik.setValues({
      ...formik.values,
      products: formik.values.products.map((product, productIndex) =>
        productIndex === index
          ? {
              title: suggestion.title,
              vtaRate: suggestion.vtaRate,
              price: suggestion.price,
              description: suggestion.description ?? "",
              quantity: 1,
            }
          : product
      ),
    });
  };

  const handleVTARateChange = (rate: string, index: number) => {
    formik.setValues({
      ...formik.values,
      products: formik.values.products.map((product, productIndex) =>
        productIndex === index ? { ...product, vtaRate: rate } : product
      ),
    });
  };

  const subtotal = () => {
    return formik.values.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  };

  const tax = () => {
    return formik.values.products.reduce(
      (acc, product) =>
        acc +
        (product.price * product.quantity * Number(product.vtaRate)) / 100,
      0
    );
  };

  const total = () => {
    return subtotal() + tax();
  };

  const handleRetrieveAddress = (address: RetrieveAddress) => {
    formik.setValues({
      ...formik.values,
      customer: {
        ...formik.values.customer,
        address: address.address,
        zipcode: address.zipcode,
        city: address.city,
        country: address.country,
      },
    });
  };

  useEffect(() => {
    fetchUser();
    fetchEvent(eventId!);
    fetchCompany();
    fetchProducts();
    fetchCustomer();
    fetchQuote(id!);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 min-h-screen">
        <div className="grid grid-cols-2 bg-gray-100 shadow-sm ring-1 ring-gray-900/5 sm:rounded-l-xl overflow-hidden col-span-2 py-12 px-12">
          <InvoiceLayout>
            <h2 className="text-2xl font-semibold leading-6 text-gray-900">
              {intl.formatMessage({
                id: "quote.header",
              })}
            </h2>
            <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
              <div className="sm:col-span-1 w-full bg-klaq-100 p-2">
                <div className="flex">
                  <p className="flex-1 text-gray-500">
                    {intl.formatMessage({
                      id: "quote.number",
                    })}
                  </p>{" "}
                  <p className="flex-1 text-gray-700 font-semibold">
                    {quote?.number}
                  </p>
                </div>
                <div className="flex mt-2">
                  <p className="flex-1 text-gray-500 ">
                    {intl.formatMessage({
                      id: "quote.issued-on",
                    })}
                  </p>{" "}
                  <p className="flex-1 text-gray-700 font-semibold">
                    {formik.values.issuedOn
                      ? format(new Date(formik.values.issuedOn), "dd/MM/yyyy")
                      : null}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="flex-1 text-gray-500">
                    {intl.formatMessage({
                      id: "quote.due-on",
                    })}
                  </p>{" "}
                  <p className="flex-1 text-gray-700 font-semibold">
                    {formik.values.validUntil
                      ? format(new Date(formik.values.validUntil), "dd/MM/yyyy")
                      : null}
                  </p>
                </div>
                {formik.values.orderFormId ? (
                  <div className="flex mt-2">
                    <p className="flex-1 text-gray-500">
                      {intl.formatMessage({
                        id: "quote.order-form-id",
                      })}
                    </p>{" "}
                    <p className="flex-1 text-gray-700 font-semibold">
                      {shortenString(17, formik.values.orderFormId)}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="sm:col-span-1 -mt-4 ml-60">
                {user.logoUrl ? (
                  <img src={user.logoUrl} width={120} height="auto" />
                ) : null}
              </div>
              <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                <dd className="text-gray-500">
                  <span className="font-medium text-gray-900">
                    {company.legalName}
                  </span>
                  <br />
                  {company.address}
                  <br />
                  {company.zip} {company.city} {company.country}
                  <br />
                  {user.publicEmail}
                  <br />
                  {user.publicPhone}
                  <br />
                  {`SIRET: ${formatSiret(company.legalRegistrationNumber)}`}
                </dd>
              </div>
              <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                {customer && (
                  <dd className="text-gray-500">
                    <span className="font-medium text-gray-900">
                      {customer.name}
                    </span>
                    <br />
                    {formik.values.customer.address
                      ? formik.values.customer.address
                      : customer.address}
                    <br />
                    {formik.values.customer.zipcode
                      ? formik.values.customer.zipcode
                      : customer.zipcode}{" "}
                    {formik.values.customer.city
                      ? formik.values.customer.city
                      : customer.city}{" "}
                    {formik.values.customer.country
                      ? formik.values.customer.country
                      : customer.country}
                    <br />
                    {customer.email}
                    <br />
                    {customer.phone}
                    <br />
                    {customer.type === CustomerType.COMPANY &&
                      `SIRET: ${formatSiret(customer.legalRegistrationNumber)}`}
                  </dd>
                )}
              </div>
            </dl>
            <div className="mt-8">
              <p className="text-md font-semibold text-gray-900">
                {formik.values.object}
              </p>
            </div>
            <table className="mt-8 w-full text-left text-sm leading-6">
              <colgroup>
                <col className="w-full" />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead className="text-gray-900 whitespace-nowrap">
                <tr className="bg-klaq-100">
                  <th scope="col" className="px-0 py-3 font-semibold">
                    {intl.formatMessage({
                      id: "quote.table.products",
                    })}
                  </th>

                  <th
                    scope="col"
                    className="hidden py-3 pl-8 pr-0 text-center font-semibold sm:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.table.quantity",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pl-8 pr-0 text-center font-semibold sm:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.table.unit-price",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pl-8 pr-0 text-center font-semibold sm:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.table.vat",
                    })}
                  </th>

                  <th
                    scope="col"
                    className="py-3 pl-8 pr-0 text-left font-semibold"
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
                  formik.values.products.map((product, idx) => (
                    <tr
                      key={`${product.title}-${idx}`}
                      className="border-b-2 border-gray-100"
                    >
                      <td className="max-w-0 px-0 py-5 align-top overflow-wrap">
                        <div className="font-medium text-gray-900">
                          {product.title}
                        </div>
                        <div className="text-gray-500">
                          {product.description}
                        </div>
                      </td>
                      <td className="hidden py-5 pl-8 pr-0 text-center align-top tabular-nums text-gray-700 sm:table-cell">
                        {product.quantity}
                      </td>
                      <td className="hidden py-5 pl-8 pr-0 text-center align-top tabular-nums text-gray-700 sm:table-cell">
                        {product.price} €
                      </td>
                      <td className="hidden py-5 pl-8 pr-0 text-center align-top tabular-nums text-gray-700 sm:table-cell">
                        {product.vtaRate}%
                      </td>

                      <td className="py-5 pl-8 pr-0 text-left align-top tabular-nums text-gray-700">
                        {(product.quantity * product.price).toFixed(2)}€
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="whitespace-nowrap">
                <tr>
                  <th
                    scope="row"
                    className="px-0 pb-0 pt-6 font-normal text-gray-700 sm:hidden"
                  >
                    {intl.formatMessage({
                      id: "quote.table.subtotal",
                    })}
                  </th>
                  <th
                    scope="row"
                    colSpan={4}
                    className="hidden px-0 pb-0 pt-6 text-right font-normal text-gray-700 sm:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.table.subtotal",
                    })}
                  </th>
                  <td className="pb-0 pl-8 pr-0 pt-6 text-right tabular-nums text-gray-900">
                    {subtotal().toFixed(2)} €
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={4}
                    className="pt-4 font-normal text-gray-700 sm:hidden"
                  >
                    {intl.formatMessage({
                      id: "quote.table.tax",
                    })}
                  </th>
                  <th
                    scope="row"
                    colSpan={4}
                    className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.table.tax",
                    })}
                  </th>
                  <td className="pb-0 pl-8 pr-0 pt-4 text-right tabular-nums text-gray-900">
                    {tax().toFixed(2)} €
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="pt-4 font-semibold text-gray-900 sm:hidden"
                  >
                    {intl.formatMessage({
                      id: "quote.table.total-with-vat",
                    })}
                  </th>
                  <th
                    scope="row"
                    colSpan={4}
                    className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.table.total-with-vat",
                    })}
                  </th>
                  <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                    {total().toFixed(2)} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </InvoiceLayout>
        </div>
        <div className="overflow-y-scroll bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-r-xl overflow-hidden col-span-1 flex flex-col overflow-y-scroll">
          <div className="py-6 px-4 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {intl.formatMessage({
                  id: "quote.edit.header",
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
                      name="customer.name"
                      className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      value={event?.customer.name}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "quote.generate.label.address",
                      })}
                    </label>
                    <div className="mt-2">
                      {
                        <MapAutocompleteInput
                          defaultAddress={`${event?.customer.address}, ${event?.customer.zipcode} ${event?.customer.city}`}
                          setAddress={(address) =>
                            handleRetrieveAddress(address)
                          }
                        />
                      }
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "quote.generate.section.details",
                    })}
                  </h3>
                  <div>
                    <Alert
                      status="info"
                      text={intl.formatMessage(
                        {
                          id: "quote.generate.number",
                        },
                        {
                          number: quote?.number,
                        }
                      )}
                    />
                  </div>
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
                            id: "quote.generate.error.issued-on",
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
                          <>
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
                                "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 rounded-md px-3.5 py-2.5 text-sm font-semibold shadom-sm col-span-1"
                              )}
                              disabled={!formik.values.issuedOn}
                            >
                              {intl.formatMessage({
                                id: `quote.generate.input.valid-until.${validUntil}`,
                              })}
                            </button>
                          </>
                        ))}
                        <input
                          type="date"
                          name="validUntil"
                          className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6 font-semibold"
                          onChange={formik.handleChange}
                          value={format(
                            new Date(formik.values.validUntil),
                            "yyyy-MM-dd"
                          )}
                          disabled={!formik.values.issuedOn}
                        />
                      </div>
                      {!formik.values.issuedOn && (
                        <div className="mt-4">
                          <Alert
                            status="warning"
                            text="Vous devez d'abord remplir la date d'émission avant de pouvoir remplir une date de validité"
                          />
                        </div>
                      )}
                      {formik.errors.validUntil && formik.touched.validUntil ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: "quote.generate.error.issued-on",
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "quote.generate.label.order-form-id",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="orderFormId"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        onChange={formik.handleChange}
                        value={formik.values.orderFormId}
                        placeholder={intl.formatMessage({
                          id: "quote.generate.input.order-form-id",
                        })}
                      />
                      {formik.errors.orderFormId ? (
                        <p className="mt-2 text-sm text-danger-600">
                          {intl.formatMessage({
                            id: "quote.generate.error.order-form-id",
                          })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "quote.generate.label.object",
                      })}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="object"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        onChange={formik.handleChange}
                        value={formik.values.object}
                        placeholder={intl.formatMessage({
                          id: "quote.generate.input.object",
                        })}
                      />
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "quote.generate.section.products",
                    })}
                  </h3>
                  <div className="flex flex-col space-y-2">
                    {formik.values.products.map((product, index) => (
                      <div
                        className="bg-klaq-100 p-6 rounded-md space-y-2"
                        key={`product-${index}`}
                      >
                        <div>
                          <label className="flex flex-row text-sm font-medium leading-6 text-gray-900">
                            {intl.formatMessage({
                              id: "products.new-product.label.name",
                            })}
                            {formik.values.products.length !== 1 ? (
                              <div className="ml-auto -m-2">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteElement(index)}
                                >
                                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                                </button>
                              </div>
                            ) : null}
                          </label>
                          <Combobox
                            as="div"
                            className="mt-2 relative"
                            value={formik.values.products[index].title}
                          >
                            <Combobox.Input
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                              placeholder={intl.formatMessage({
                                id: "products.new-product.input.name",
                              })}
                              value={formik.values.products[index].title}
                              onChange={formik.handleChange}
                              name={`products.${index}.title`}
                            />
                            {/* {formik.touched.products &&
                            formik.touched.products.length > 0 &&
                            formik.touched.products[index].title ? (
                              <p className="mt-2 text-sm text-danger-600">
                                {intl.formatMessage({
                                  id: "quote.generate.error.products.name",
                                })}
                              </p>
                            ) : null} */}
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredProducts(index) &&
                                filteredProducts(index).length > 0 &&
                                filteredProducts(index).map(
                                  (productItem: ProductItem) => (
                                    <Combobox.Option
                                      value={productItem}
                                      className={({ active }) =>
                                        classNames(
                                          "relative cursor-default select-none py-2 pl-3 pr-9 flex",
                                          active
                                            ? "bg-klaq-600 text-white"
                                            : "text-gray-900"
                                        )
                                      }
                                      onClick={() =>
                                        handleAutocompleteElement(
                                          index,
                                          productItem
                                        )
                                      }
                                    >
                                      <p className="font-bold">
                                        {productItem.title}
                                      </p>
                                      <p className="ml-auto">
                                        {productItem.price}€
                                      </p>
                                    </Combobox.Option>
                                  )
                                )}
                            </Combobox.Options>
                          </Combobox>
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
                            {/* {formik.touched.products &&
                            formik.touched.products.length > 0 &&
                            formik.touched.products[index].description ? (
                              <p className="mt-2 text-sm text-danger-600">
                                {intl.formatMessage({
                                  id: "quote.generate.error.products.short-description",
                                })}
                              </p>
                            ) : null} */}
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
                                min={1}
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
                        <div>
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            {intl.formatMessage({
                              id: "quote.generate.label.products.default-vta-rate",
                            })}
                          </label>
                          <div className="mt-2 flex flex-row justify-between">
                            {VTA_RATE.map((rate) => (
                              <button
                                key={`tva-${rate}`}
                                type="button"
                                onClick={() => handleVTARateChange(rate, index)}
                                className={classNames(
                                  rate === formik.values.products[index].vtaRate
                                    ? "bg-klaq-600 text-white hover:bg-klaq-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaq-600"
                                    : "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                                  "rounded-md px-3.5 py-2.5 text-sm font-semibold shadom-sm"
                                )}
                              >
                                {rate}%
                              </button>
                            ))}
                          </div>
                        </div>
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
                <div className="mt-4 flex flex-row-reverse">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    isLoading={isUpdatingQuote}
                  >
                    {intl.formatMessage({
                      id: "quote.generate.button.save",
                    })}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
