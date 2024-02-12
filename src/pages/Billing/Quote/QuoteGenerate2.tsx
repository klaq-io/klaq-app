import { PageLayout } from "layouts";
import { useIntl } from "react-intl";
import { initialValues, validationSchema } from "./generateQuoteForm";
import { useFormik } from "formik";
import {
  Button,
  CardContainer,
  Label,
  SelectField,
  TextField,
} from "components";
import { Combobox, Transition } from "@headlessui/react";
import { MainEvent } from "interface/Event/main-event.interface";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useFetchMainEvents } from "redux/MainEvent/hooks";
import { useSelector } from "react-redux";
import { getMainEventsByStatus } from "redux/MainEvent/selectors";
import { EventStatus } from "redux/Events/slices";
import { Alert } from "components/Alert/Alert";
import { classNames } from "utils/utils";
import { useFetchProductItems } from "redux/Products/hooks";
import { getAllProducts } from "redux/Products/selectors";
import { ProductItem } from "redux/Products/slices";
import { DiscountType } from "interface/Invoice/invoice.interface";
import { add, formatISO } from "date-fns";
import { useCreateQuote } from "redux/Quote/hooks";
import { useParams, useSearchParams } from "react-router-dom";

export const QuoteGeneratePage = () => {
  const intl = useIntl();

  const [searchParams, setSearchParams] = useSearchParams();
  const fromEventId = searchParams.get("fromEventId");
  const [query, setQuery] = useState("");
  const [mainEventId, setMainEventId] = useState("");
  const [, fetchMainEvents] = useFetchMainEvents();
  const [{ isLoading: isSubmitting }, createQuote] = useCreateQuote();

  const mainEvents =
    useSelector((state: any) =>
      getMainEventsByStatus(
        state,
        EventStatus.INBOX,
        EventStatus.QUOTE_SENT,
        EventStatus.QUOTE_REJECTED
      )
    ) || [].reverse();

  const filteredEvents =
    query === ""
      ? []
      : mainEvents.filter((event) => {
          return (
            event.customer.phone.toLowerCase().includes(query.toLowerCase()) ||
            event.subEvents[0].type
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            event.customer.name.toLowerCase().includes(query.toLowerCase()) ||
            new Date(event.subEvents[0].date)
              .toLocaleDateString()
              .toLowerCase()
              .includes(query.toLowerCase())
          );
        });

  const [, fetchProducts] = useFetchProductItems();
  const products = useSelector(getAllProducts);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      createQuote(values, mainEventId);
    },
  });

  const QUOTE_VALID_UNTIL: { [key: string]: Date } = {
    "15": add(new Date(formik.values.issuedOn), { days: 15 }),
    "30": add(new Date(formik.values.issuedOn), { days: 30 }),
    "45": add(new Date(formik.values.issuedOn), { days: 45 }),
    "90": add(new Date(formik.values.issuedOn), { days: 90 }),
  };

  const filteredProducts = (idx: number) =>
    idx && formik.values.products[idx].title === ""
      ? []
      : products.filter((productItem) => {
          return productItem.title
            .toLowerCase()
            .includes(formik.values.products[idx].title.toLowerCase());
        });

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
              discount: 0,
              discountType: DiscountType.PERCENT,
            }
          : product
      ),
    });
  };

  const VTA_RATE = ["0", "2.1", "5.5", "10", "20"];

  const handleSetMainEvent = (mainEvent: MainEvent) => {
    setMainEventId(mainEvent.id);
    formik.setFieldValue("customer", mainEvent.customer);
    if (mainEvent && mainEvent.products && mainEvent.products.length > 0) {
      formik.setFieldValue(
        "products",
        mainEvent.products.map((eventProduct) => {
          const actualProduct = products.find(
            (product) => product.id === eventProduct.productId
          );
          return actualProduct
            ? {
                title: actualProduct.title,
                vtaRate: actualProduct.vtaRate,
                price: actualProduct.price,
                description: actualProduct.description ?? "",
                quantity: 1,
                discount: 0,
                discountType: DiscountType.PERCENT,
              }
            : initialValues.products[0];
        })
      );
    }
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

  const handleDuplicateElement = (index: number) => {
    formik.setValues({
      ...formik.values,
      products: [...formik.values.products, formik.values.products[index]],
    });
  };

  const handleMovePositionElement = (index: number, direction: string) => {
    const newIndex =
      direction === "up" ? index - 1 : direction === "down" ? index + 1 : index;
    const products = [...formik.values.products];
    const product = products[index];
    products[index] = products[newIndex];
    products[newIndex] = product;
    formik.setValues({
      ...formik.values,
      products,
    });
  };

  const getProductSubtotal = (index: number) => {
    const product = formik.values.products[index];
    const discount =
      product.discountType === DiscountType.PERCENT
        ? product.price * (product.discount / 100)
        : product.discount;
    return product.price * product.quantity - discount;
  };

  const getProductTotal = (index: number) => {
    const product = formik.values.products[index];
    const subtotal = getProductSubtotal(index);
    return subtotal + subtotal * (Number(product.vtaRate) / 100);
  };

  const subtotal = formik.values.products.reduce(
    (acc, product) =>
      acc + getProductSubtotal(formik.values.products.indexOf(product)),
    0
  );

  const tax = formik.values.products.reduce(
    (acc, product) =>
      acc +
      getProductSubtotal(formik.values.products.indexOf(product)) *
        (Number(product.vtaRate) / 100),
    0
  );

  const total = subtotal + tax;

  useEffect(() => {
    fetchMainEvents();
    fetchProducts();
    formik.setFieldValue("issuedOn", new Date().toISOString().split("T")[0]);
    formik.setFieldValue(
      "validUntil",
      add(new Date(), { days: 15 }).toISOString().split("T")[0]
    );
  }, []);

  useEffect(() => {
    if (fromEventId) {
      const mainEvent = mainEvents.find(
        (mainEvent) => mainEvent.id === fromEventId
      );
      if (mainEvent) {
        handleSetMainEvent(mainEvent);
      }
    }
  }, [fromEventId]);

  return (
    <PageLayout>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {intl.formatMessage({
              id: "quote-generate.header",
            })}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {intl.formatMessage({
              id: "quote-generate.description",
            })}
          </p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-8 flex flex-col">
          <CardContainer className="grow px-4 py-5 sm:p-6 flex flex-col space-y-8">
            {!formik.values.customer.name && (
              <div className="flex flex-col space-y-4">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  {intl.formatMessage({
                    id: "quote-generate.attach-event.title",
                  })}
                </h1>
                <Combobox
                  as="div"
                  onChange={(mainEvent: MainEvent) => {
                    handleSetMainEvent(mainEvent);
                  }}
                >
                  {({ activeOption }) => (
                    <>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon
                            className="pointer-events-none absolute h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <Combobox.Input
                          className="w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                          placeholder={intl.formatMessage({
                            id: "quote.attach-to-event.search",
                          })}
                          onChange={(event) => setQuery(event.target.value)}
                          displayValue={(mainEvent: MainEvent) =>
                            mainEvent
                              ? `${new Date(
                                  mainEvent.subEvents[0].date
                                ).toLocaleDateString()} - ${
                                  mainEvent.customer.name
                                } - ${
                                  mainEvent.subEvents[0].type
                                } - ${intl.formatMessage({
                                  id: `events.status.${mainEvent.status}`,
                                })}`
                              : ""
                          }
                        />
                        <Combobox.Button className="absolute inset-y-0 pl-3 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Combobox.Button>
                      </div>
                      <Combobox.Options className="flex absolute z-10 mt-1 max-h-60 w-1/2 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {query === "" || filteredEvents.length > 0 ? (
                          <div
                            className={classNames(
                              "max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4"
                            )}
                          >
                            {query === "" && (
                              <h2 className="mb-4 mt-2 text-xs font-semibold text-gray-500">
                                {intl.formatMessage({
                                  id: "quote.attach-to-event.recent",
                                })}
                              </h2>
                            )}
                            <div className="-mx-2 text-sm text-gray-700">
                              {(query === ""
                                ? mainEvents.slice(0, 5)
                                : filteredEvents
                              ).map((mainEvent) => (
                                <Combobox.Option
                                  as="div"
                                  key={mainEvent.id}
                                  value={mainEvent}
                                  className={({ active }) =>
                                    classNames(
                                      "relativeflex cursor-default select-none items-center rounded-md p-2",
                                      active && "bg-gray-100 text-gray-900"
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <span className="ml-3 flex-auto truncate">
                                        {new Date(
                                          mainEvent.subEvents[0].date
                                        ).toLocaleDateString()}{" "}
                                        - {mainEvent.customer.name} -{" "}
                                        {mainEvent.subEvents[0].type} -{" "}
                                        {intl.formatMessage({
                                          id: `events.status.${mainEvent.status}`,
                                        })}{" "}
                                      </span>
                                      {selected && (
                                        <span
                                          className={classNames(
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                            active && "text-klaq-600"
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
                            </div>
                          </div>
                        ) : (
                          query !== "" &&
                          filteredEvents.length === 0 && (
                            <div className="px-6 py-14 text-center text-sm sm:px-14">
                              <UsersIcon
                                className="mx-auto h-6 w-6 text-gray-400"
                                aria-hidden="true"
                              />
                              <p className="mt-4 font-semibold text-gray-900">
                                {intl.formatMessage({
                                  id: "quote.attach-to-event.not-found.title",
                                })}
                              </p>
                              <p className="mt-2 text-gray-500">
                                {intl.formatMessage(
                                  {
                                    id: "quote.attach-to-event.not-found.description",
                                  },
                                  {
                                    btn: (...chunks: any) => (
                                      <Button
                                        type="button"
                                        variant="link"
                                        color="primary"
                                      >
                                        {chunks.join()}
                                      </Button>
                                    ),
                                  }
                                )}
                              </p>
                              <p className="mt-2 text-gray-500">
                                {intl.formatMessage({
                                  id: "quote.attach-to-event.not-found.info",
                                })}
                              </p>
                            </div>
                          )
                        )}
                      </Combobox.Options>
                    </>
                  )}
                </Combobox>
                {!formik.values.customer.name && (
                  <Alert
                    status="info"
                    title={intl.formatMessage({
                      id: "quote-generate.attach-event.info.title",
                    })}
                    text={intl.formatMessage({
                      id: "quote-generate.attach-event.info.description",
                    })}
                  />
                )}
              </div>
            )}
            <Transition
              show={!!formik.values.customer.name}
              enter="transition ease duration-500 transform"
              enterFrom="opacity-0 translate-y-12"
              enterTo="opacity-100 translate-y-0"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="flex flex-col space-y-8">
                <div className="flex flex-col space-y-4">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "invoice-generate.informations.title",
                    })}
                  </h1>
                  <div className="grid grid-cols-3 gap-4">
                    <TextField
                      className="col-span-1"
                      label={intl.formatMessage({
                        id: "quote-generate.informations.quote-number.label",
                      })}
                      name="invoice-number"
                      value={"D-001-2024"}
                      disabled
                    />
                    <TextField
                      className="col-span-1"
                      label={intl.formatMessage({
                        id: "invoice-generate.informations.issued-on.label",
                      })}
                      type="date"
                      name="issuedOn"
                      onChange={formik.handleChange}
                      value={formik.values.issuedOn}
                      error={
                        formik.errors.issuedOn && formik.touched.issuedOn
                          ? intl.formatMessage({
                              id: "quote.generate.error.issued-on",
                            })
                          : null
                      }
                    />
                    <div className="col-span-1" />
                    <TextField
                      label={intl.formatMessage({
                        id: "quote-generate.informations.object.label",
                      })}
                      placeholder={intl.formatMessage({
                        id: "quote-generate.informations.object.placeholder",
                      })}
                      name="object"
                      onChange={formik.handleChange}
                      value={formik.values.object}
                    />
                    <TextField
                      label={intl.formatMessage({
                        id: "invoice-generate.informations.order-form-id.label",
                      })}
                      placeholder={intl.formatMessage({
                        id: "invoice-generate.informations.order-form-id.placeholder",
                      })}
                      name="orderFormId"
                      onChange={formik.handleChange}
                      value={formik.values.orderFormId}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "invoice-generate.products.title",
                    })}
                  </h1>
                  {formik.values.products.map((product, index) => (
                    <div className="flex flex-col">
                      <div className="flex p-2">
                        <div className="flex">
                          <button
                            type="button"
                            disabled={
                              formik.values.products.length === 1 || index === 0
                            }
                            onClick={() =>
                              handleMovePositionElement(index, "up")
                            }
                            className="disabled:cursor-not-allowed disabled:opacity-30 text-gray-900"
                          >
                            <ChevronUpIcon className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleMovePositionElement(index, "down")
                            }
                            disabled={
                              formik.values.products.length === 1 ||
                              index === formik.values.products.length - 1
                            }
                            className="disabled:cursor-not-allowed disabled:opacity-30 text-gray-900"
                          >
                            <ChevronDownIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="ml-auto flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleDuplicateElement(index)}
                            className="disabled:cursor-not-allowed disabled:opacity-30 text-gray-900"
                          >
                            <DocumentDuplicateIcon className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteElement(index)}
                            disabled={formik.values.products.length === 1}
                            className="disabled:cursor-not-allowed disabled:opacity-30 text-gray-900"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div
                        className="bg-klaq-100 p-6 rounded-md shadow-md grid grid-cols-4 gap-4"
                        key={`product-${index}`}
                      >
                        <div className="col-span-full">
                          <Label htmlFor={`product-name-{index}`}>
                            {intl.formatMessage({
                              id: "invoice-generate.products.name.label",
                            })}
                          </Label>
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
                            {filteredProducts(index) &&
                              filteredProducts(index).length > 0 && (
                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {filteredProducts(index).map(
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
                              )}
                          </Combobox>
                        </div>
                        <TextField
                          label={intl.formatMessage({
                            id: "invoice-generate.products.quantity.label",
                          })}
                          type="number"
                          min={1}
                          name={`products.${index}.quantity`}
                          onChange={formik.handleChange}
                          value={formik.values.products[index].quantity}
                          className="col-span-1"
                        />

                        <div className="col-span-1">
                          <Label htmlFor={`product-price-{index}`}>
                            {intl.formatMessage({
                              id: "invoice-generate.products.default-price.label",
                            })}
                          </Label>
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
                        <SelectField
                          label={intl.formatMessage({
                            id: "invoice-generate.products.default-vta-rate.label",
                          })}
                          name={`products.${index}.vtaRate`}
                          onChange={formik.handleChange}
                          value={formik.values.products[index].vtaRate}
                          className="col-span-1"
                        >
                          {VTA_RATE.map((rate) => (
                            <option key={rate} value={rate}>
                              {rate}%
                            </option>
                          ))}
                        </SelectField>
                        <div className="col-span-1 flex space-x-2">
                          <TextField
                            label={intl.formatMessage({
                              id: "invoice-generate.products.discount.label",
                            })}
                            name={`products.${index}.discount`}
                            onChange={formik.handleChange}
                            value={formik.values.products[index].discount}
                            type="number"
                            className="w-2/3"
                            min={0}
                            onBlur={() =>
                              formik.values.products[index].discount
                                ? formik.values.products[index].discount
                                : formik.setFieldValue(
                                    `products.${index}.discount`,
                                    0
                                  )
                            }
                          />
                          <span className="w-1/3">
                            <Label htmlFor={`product-discount-type-{index}`}>
                              &zwnj;
                            </Label>
                            <SelectField
                              name={`products.${index}.discountType`}
                              onChange={formik.handleChange}
                              value={formik.values.products[index].discountType}
                            >
                              <option value={DiscountType.PERCENT}>%</option>
                              <option value={DiscountType.FIXED}>€</option>
                            </SelectField>
                          </span>
                        </div>
                        <TextField
                          label={intl.formatMessage({
                            id: "invoice-generate.products.short-description.label",
                          })}
                          placeholder={intl.formatMessage({
                            id: "invoice-generate.products.short-description.placeholder",
                          })}
                          name={`products.${index}.description`}
                          onChange={formik.handleChange}
                          value={formik.values.products[index].description}
                          className="col-span-2"
                          error={
                            formik.errors.products &&
                            formik.errors.products.length > 0 &&
                            formik.errors.products[index] &&
                            formik.touched.products &&
                            formik.touched.products.length > 0 &&
                            formik.touched.products[index] &&
                            formik.touched.products[index].description
                              ? intl.formatMessage({
                                  id: "invoice-generate.products.short-description.error",
                                })
                              : null
                          }
                        />
                        <div className="col-span-1">
                          <Label htmlFor={`product-price-{index}`}>
                            {intl.formatMessage({
                              id: "invoice-generate.products.total.label.subtotal",
                            })}
                          </Label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                €
                              </span>
                            </div>
                            <input
                              type="number"
                              value={getProductSubtotal(index)}
                              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200"
                              disabled
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
                        <div className="col-span-1">
                          <Label htmlFor={`product-price-{index}`}>
                            {intl.formatMessage({
                              id: "invoice-generate.products.total.label.total",
                            })}
                          </Label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                €
                              </span>
                            </div>
                            <input
                              value={getProductTotal(index).toFixed(2)}
                              type="number"
                              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200"
                              disabled
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
                  ))}
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
                <div className="flex flex-col space-y-4">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "invoice-generate.total.title",
                    })}
                  </h1>

                  <div className="bg-gray-50 p-4 flex">
                    <div className="ml-auto flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          {intl.formatMessage({
                            id: "invoice-generate.total.label.subtotal",
                          })}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {subtotal.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex space-x-12">
                        <span className="font-semibold text-gray-900">
                          {intl.formatMessage({
                            id: "invoice-generate.total.label.tax",
                          })}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {tax.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          {intl.formatMessage({
                            id: "invoice-generate.total.label.total",
                          })}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {total.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "quote-generate.payment-condition.title",
                    })}
                  </h1>
                  <div className="grid grid-cols-3 gap-4">
                    {formik.values.issuedOn && (
                      <SelectField
                        className="col-span-1"
                        label={intl.formatMessage({
                          id: "invoice-generate.informations.due-on.label",
                        })}
                        name="validUntil"
                        onChange={formik.handleChange}
                        value={formik.values.validUntil}
                        disabled={!formik.values.issuedOn}
                      >
                        {Object.keys(QUOTE_VALID_UNTIL).map((validUntil) => (
                          <option
                            key={validUntil}
                            value={
                              QUOTE_VALID_UNTIL[validUntil]
                                ? formatISO(QUOTE_VALID_UNTIL[validUntil])
                                : validUntil
                            }
                          >
                            {intl.formatMessage({
                              id: `invoice-generate.informations.due-on.days.${validUntil}`,
                            })}{" "}
                            (
                            {QUOTE_VALID_UNTIL[validUntil].toLocaleDateString()}
                            )
                          </option>
                        ))}
                      </SelectField>
                    )}
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    isLoading={isSubmitting}
                  >
                    Créer le devis
                  </Button>
                </div>
              </div>
            </Transition>
          </CardContainer>
        </div>
      </form>
    </PageLayout>
  );
};
