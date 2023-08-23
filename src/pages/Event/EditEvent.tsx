import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  CheckIcon,
  PaperClipIcon,
  PlusIcon,
  ShoppingBagIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../layouts";
import { useFetchEvents, useUpdateEvent } from "../../redux/Events/hooks";
import { getEventById } from "../../redux/Events/selectors";
import { CustomerType } from "../../redux/Customer/slices";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { ProductItem } from "../../redux/Products/slices";
import { classNames, shortenString } from "../../utils/utils";
import { NewProducts } from "../Products";
import { initialValuesEditEvent, validationSchemaEditEvent } from "./form";
import { Button, CommentaryFeed } from "../../components";

const EditEvent = () => {
  const { id } = useParams();
  const intl = useIntl();

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const event = useSelector((state: any) => getEventById(state, id!));

  const [{ isLoading: updateEventLoading }, updateEvent] = useUpdateEvent();

  const [, fetchProducts] = useFetchProductItems();
  const productItems = useSelector(getAllProducts);

  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [query, setQuery] = useState("");

  const [openProductSidePanel, setOpenProductSidePanel] = useState(false);

  const formik = useFormik({
    initialValues: event || initialValuesEditEvent,
    validationSchema: validationSchemaEditEvent,
    enableReinitialize: true,
    onSubmit: (values) => {
      const date = new Date(values.date);
      updateEvent({ ...values, date }, id!);
    },
  });

  const eventType = ["wedding", "birthday", "corporate"];

  const filteredProducts =
    query === ""
      ? []
      : productItems.filter((productItem) => {
          return productItem.title.toLowerCase().includes(query.toLowerCase());
        });

  const handleOpenAddProductToEvent = () => {
    setOpenAddProductModal(true);
  };

  const handleAddProductToEvent = (productId: string) => {
    if (!formik.values.products)
      formik.setFieldValue("products", [{ productId, quantity: 1 }]);
    else
      formik.setFieldValue("products", [
        ...formik.values.products,
        { productId, quantity: 1 },
      ]);
    setOpenAddProductModal(false);
  };

  const handleOpenProductSidePanel = () => {
    setOpenProductSidePanel(true);
  };

  const handleDeleteProductItem = (productId: string) => {
    if (!formik.values.products) return;
    formik.setFieldValue(
      "products",
      formik.values.products.filter(
        (product) => product.productId !== productId
      )
    );
  };

  useEffect(() => {
    fetchEvents();
    fetchProducts();
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      {event ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {intl.formatMessage(
                  {
                    id: "edit-event.header",
                  },
                  {
                    date: new Date(event.date).toLocaleDateString(),
                    customerName: event.customer.name
                      ? event.customer.name
                      : `${event.customer.firstName} ${event.customer.lastName}`,
                  }
                )}
              </h2>
            </div>
            <div>
              <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
                <Button
                  type="submit"
                  isLoading={updateEventLoading}
                  color="primary"
                  variant="contained"
                  leadingIcon={
                    <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  }
                >
                  {intl.formatMessage({
                    id: "edit-event.submit",
                  })}
                </Button>
              </div>
            </div>
          </div>
          {/** Date */}
          <div className="flex flex-row mt-10">
            <div className="flex-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "new-event.date.header",
                  })}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  {intl.formatMessage({
                    id: "new-event.date.description",
                  })}
                </p>
              </div>
              <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.date",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.date.toString()}
                        type="date"
                        name="date"
                        id="date"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.date && formik.touched.date ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.date.error.date",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.number-of-guest",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.numberOfGuests}
                        type="number"
                        name="numberOfGuests"
                        id="numberOfGuest"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.start-time",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.startTime}
                        type="time"
                        name="startTime"
                        id="startTime"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.startTime && formik.touched.startTime ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.date.error.start-time",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.end-time",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.endTime}
                        type="time"
                        name="endTime"
                        id="endTime"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      />
                      {formik.errors.endTime && formik.touched.endTime ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.date.error.end-time",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.event-type",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <select
                        onChange={formik.handleChange}
                        value={formik.values.eventType}
                        id="eventType"
                        name="eventType"
                        className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      >
                        {eventType.map((type) => (
                          <option key={type} value={type}>
                            {intl.formatMessage({
                              id: `new-event.date.input.event-type.${type}`,
                            })}
                          </option>
                        ))}
                      </select>
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.public-event",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <select
                        onChange={formik.handleChange}
                        value={formik.values.publicEvent}
                        id="publicEvent"
                        name="publicEvent"
                        className="mt-2 block w-4/5 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      >
                        <option value="yes">
                          {intl.formatMessage({
                            id: "new-event.date.input.public-event.yes",
                          })}
                        </option>
                        <option value="no">
                          {intl.formatMessage({
                            id: "new-event.date.input.public-event.no",
                          })}
                        </option>
                      </select>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
          {/** Location */}
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "new-event.location.header",
                  })}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  {intl.formatMessage({
                    id: "new-event.location.description",
                  })}
                </p>
              </div>
              <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.address",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.address}
                        type="text"
                        name="address"
                        id="address"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: "new-event.location.input.address",
                        })}
                      />
                      {formik.errors.address && formik.touched.address ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.location.error.address",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.city",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.city}
                        type="text"
                        name="city"
                        id="city"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: "new-event.location.input.city",
                        })}
                      />
                      {formik.errors.city && formik.touched.city ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.location.error.city",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.state",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.state}
                        type="text"
                        name="state"
                        id="state"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: "new-event.location.input.state",
                        })}
                      />
                      {formik.errors.state && formik.touched.state ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.location.error.state",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.zipcode",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.zipcode}
                        type="text"
                        name="zipcode"
                        id="zipcode"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: "new-event.location.input.zipcode",
                        })}
                      />
                      {formik.errors.zipcode && formik.touched.zipcode ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.location.error.zipcode",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
          {/** Customer */}
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "new-event.customer.header",
                  })}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  {intl.formatMessage({
                    id: "new-event.customer.description",
                  })}
                </p>
              </div>
              <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.first-name",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.customer.firstName}
                        type="text"
                        name="customer.firstName"
                        id="firstName"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: "new-event.customer.input.first-name",
                        })}
                      />
                      {formik.errors.customer &&
                      formik.touched.customer &&
                      formik.errors.customer.firstName &&
                      formik.touched.customer.firstName ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.customer.error.first-name",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.last-name",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.customer.lastName}
                        type="text"
                        name="customer.lastName"
                        id="lastName"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: "new-event.customer.input.last-name",
                        })}
                      />
                      {formik.errors.customer &&
                      formik.touched.customer &&
                      formik.errors.customer.lastName &&
                      formik.touched.customer.lastName ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.customer.error.last-name",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.phone-number",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.customer.phone}
                        type="text"
                        name="customer.phone"
                        id="phoneNumber"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder="+33 6 12 34 56 78"
                      />
                      {formik.errors.customer &&
                      formik.touched.customer &&
                      formik.errors.customer.phone &&
                      formik.touched.customer.phone ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.customer.error.phone-number",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.email",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      <input
                        onChange={formik.handleChange}
                        value={formik.values.customer.email}
                        type="text"
                        name="customer.email"
                        id="email"
                        className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                        placeholder={intl.formatMessage({
                          id: "new-event.customer.input.email",
                        })}
                      />
                      {formik.errors.customer &&
                      formik.touched.customer &&
                      formik.errors.customer.email &&
                      formik.touched.customer.email ? (
                        <p
                          className="mt-2 text-sm text-danger-600"
                          id="email-error"
                        >
                          {intl.formatMessage({
                            id: "new-event.customer.error.email",
                          })}
                        </p>
                      ) : null}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
          <div className="">
            <div className="mt-10 ">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "edit-event.my-products.header",
                  })}
                </h3>
              </div>
              {event.products &&
              formik.values.products &&
              formik.values.products.length > 0 ? (
                <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg bg-white">
                  <table className="min-w-full">
                    <colgroup>
                      <col className="w-full sm:w-1/2" />
                      <col className="sm:w-1/6" />
                      <col className="sm:w-1/6" />
                      <col className="sm:w-1/6" />
                    </colgroup>
                    <thead className="border-b border-gray-300 text-gray-900">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          {intl.formatMessage({
                            id: "edit-event.my-products.title",
                          })}
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          {intl.formatMessage({
                            id: "edit-event.my-products.quantity",
                          })}
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          {intl.formatMessage({
                            id: "edit-event.my-products.price",
                          })}
                        </th>
                        <th
                          className="hidden relative py-3.5 pl-3 pr-4 sm:pr-6"
                          scope="col"
                        >
                          <span className="sr-only">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.products.map((product, idx) => (
                        <tr key={product.id} className="">
                          <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">
                              {
                                productItems?.find(
                                  (productItem) =>
                                    productItem.id === product.productId
                                )?.title
                              }
                            </div>
                            <div className="mt-1 truncate text-gray-500">
                              {shortenString(
                                40,
                                productItems?.find(
                                  (productItem) =>
                                    productItem.id === product.productId
                                )?.description
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                            <input
                              name={`products[${idx}].quantity`}
                              onChange={formik.handleChange}
                              value={
                                formik.values.products
                                  ? formik.values.products[idx].quantity
                                  : 0
                              }
                              min="1"
                              type="number"
                              className="w-3/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                            />
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                            {formik.values.products
                              ? (productItems?.find(
                                  (productItem: ProductItem) =>
                                    productItem.id === product.productId
                                )?.price || 0) *
                                formik.values.products[idx].quantity
                              : 0}
                            €
                          </td>
                          <td className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() =>
                                handleDeleteProductItem(product.productId)
                              }
                              type="button"
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                            >
                              <XCircleIcon className="w-6 h-6 text-danger-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {/* todo: implement footer
              <div className="flex flex-row-reverse mt-6">
                <div className="flex flex-col">
                  <div className="flex flex-row space-x-4">
                    <p className="text-right text-sm font-semibold text-gray-900">
                      Subtotal
                    </p>
                    <p className="text-right text-sm font-semibold text-gray-900">
                      1400€
                    </p>
                  </div>
                  <div className="flex flex-row">Tax</div>
                  <div className="flex flex-row">Total</div>
                </div>
              </div> */}
              <div className="flex flex-row mt-10">
                <div className="">
                  <button
                    onClick={handleOpenProductSidePanel}
                    type="button"
                    className="mr-4 inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    {intl.formatMessage({
                      id: "edit-event.my-products.add-new-product",
                    })}
                  </button>
                </div>
                <div className="">
                  <button
                    onClick={handleOpenAddProductToEvent}
                    type="button"
                    className="inline-flex items-center gap-x-2 rounded-md bg-klaq-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-klaq-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaq-600"
                  >
                    <PaperClipIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    {intl.formatMessage({
                      id: "edit-event.my-products.attach-product",
                    })}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
          <div className="mt-10">
            <div className="w-1/2">
              <div className="px-4 sm:px-0 mb-6">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "edit-event.commentaries.header",
                  })}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  {intl.formatMessage({
                    id: "edit-event.commentaries.description",
                  })}
                </p>
              </div>
              <CommentaryFeed isCommentingAllowed={true} />
            </div>
            <div className="flex-1"></div>
          </div>

          <Transition.Root
            show={openAddProductModal}
            as={Fragment}
            afterLeave={() => setQuery("")}
            appear
          >
            <Dialog
              as="div"
              className="relative z-10 "
              onClose={setOpenAddProductModal}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="mx-auto max-w-xl transform rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                    <Combobox>
                      <Combobox.Input
                        className="w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
                        placeholder="Rechercher un produit à ajouter..."
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      {/** todo: handle key enter */}

                      {filteredProducts.length > 0 && (
                        <Combobox.Options
                          static
                          className="-mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                        >
                          {filteredProducts.map((productItem) => (
                            <Combobox.Option
                              key={productItem.id}
                              value={productItem.title}
                              onClick={() =>
                                handleAddProductToEvent(productItem.id)
                              }
                              className={({ active }) =>
                                classNames(
                                  "cursor-default select-none rounded-md px-4 py-2",
                                  active && "bg-klaq-600 text-white"
                                )
                              }
                            >
                              {productItem.title}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      )}

                      {query !== "" && filteredProducts.length === 0 && (
                        <div className="px-4 py-14 text-center sm:px-14">
                          <ShoppingBagIcon
                            className="mx-auto h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                          <p className="mt-4 text-sm text-gray-900">
                            {intl.formatMessage({
                              id: "edit-event.my-products.no-products-found",
                            })}
                          </p>
                        </div>
                      )}
                    </Combobox>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          <NewProducts
            openSidePanel={openProductSidePanel}
            setOpenSidePanel={setOpenProductSidePanel}
          />
        </form>
      ) : null}
    </PageLayout>
  );
};

export { EditEvent as EditEvent2 };
