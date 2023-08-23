import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "../../layouts";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getEventById } from "../../redux/Events/selectors";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { shortenString } from "../../utils/utils";
import {
  ArrowLeftIcon,
  CheckIcon,
  LinkIcon,
  PencilIcon,
  PencilSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { PATHS } from "../../routes";
import { ProductItem } from "../../redux/Products/slices";
import { Button, CommentaryFeed } from "../../components";

export const EventDetails2 = () => {
  const { id } = useParams();
  const intl = useIntl();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const event = useSelector((state: any) => getEventById(state, id!));

  const [, fetchProducts] = useFetchProductItems();
  const productItems = useSelector(getAllProducts);

  const handleEditEvent = () => {
    navigate(`${PATHS.EVENTS}/${id}/edit`);
  };

  const handlePreviousPage = () => {
    if (params.get("from") === "edit") {
      navigate(PATHS.EVENTS);
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchProducts();
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      {event ? (
        <>
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <Button
                onClick={handlePreviousPage}
                variant="text"
                color="secondary"
                type="button"
                leadingIcon={<ArrowLeftIcon className="-ml-0.5 h-5 w-5" />}
              >
                {intl.formatMessage({
                  id: "edit-event.button.previous",
                })}
              </Button>
            </div>
            <div>
              <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
                <button
                  onClick={handleEditEvent}
                  type="button"
                  className="mr-4 inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PencilSquareIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Editer
                </button>
                <button
                  type="button"
                  className="mr-4 inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <LinkIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Voir le devis
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-x-2 rounded-md bg-klaq-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-klaq-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaq-600"
                >
                  <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Envoyer le devis
                </button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="mt-10 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
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
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "new-event.date.header",
                  })}
                </h3>
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
                      {new Date(event.date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.number-of-guest",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.numberOfGuests}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.start-time",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.startTime}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.end-time",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.endTime}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.event-type",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {intl.formatMessage({
                        id: `new-event.date.input.event-type.${event.eventType}`,
                      })}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.public-event",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {intl.formatMessage({
                        id: `new-event.date.input.public-event.${event.publicEvent}`,
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex-1"></div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "new-event.location.header",
                  })}
                </h3>
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
                      {event.address}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.city",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.city}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.state",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.state}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.zipcode",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.zipcode}
                    </dd>
                  </div>
                </dl>
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Cette évènement se situe à{" "}
                <span className="text-klaq-600">X km</span> de votre bureau.
                Vous aurez besoin de{" "}
                <span className="text-klaq-600">X minutes</span> pour vous y
                rendre. Le coût estimé s'élève à{" "}
                <span className="text-klaq-600">X€</span>.
              </p>
            </div>
            <div className="flex-1">{/** second part */}</div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "new-event.customer.header",
                  })}
                </h3>
              </div>

              <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.type",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {intl.formatMessage({
                        id: `new-event.customer.type.${event.customer.type.toLowerCase()}`,
                      })}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900"></dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2"></dd>
                  </div>
                </dl>
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.first-name",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.customer.firstName}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.last-name",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.customer.lastName}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.phone-number",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.customer.phone}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.email",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.customer.email}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex-1">{/** third part */}</div>
          </div>
          <div className="sm:w-2/3">
            <div className="mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-klaq-600">
                  {intl.formatMessage({
                    id: "edit-event.my-products.header",
                  })}
                </h3>
              </div>
              {event.products && event.products.length ? (
                <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg bg-white">
                  <table className="min-w-full">
                    <colgroup>
                      <col className="w-full sm:w-1/2" />
                      <col className="sm:w-1/4" />
                      <col className="sm:w-1/4" />
                      <col className="sm:w-1/4" />
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
                          className="hidden px-3 py-3.5 text-center  text-sm font-semibold text-gray-900 lg:table-cell"
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
                      </tr>
                    </thead>
                    <tbody>
                      {event.products.map((product) => (
                        <tr key={product.id}>
                          <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">
                              {
                                productItems?.find(
                                  (productItem: ProductItem) =>
                                    productItem.id === product.productId
                                )?.title
                              }
                            </div>
                            <div className="mt-1 truncate text-gray-500">
                              {shortenString(
                                40,
                                productItems?.find(
                                  (productItem: ProductItem) =>
                                    productItem.id === product.productId
                                )?.description
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-sm text-center text-gray-500 lg:table-cell">
                            {product.quantity}
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                            {(
                              (productItems?.find(
                                (productItem: ProductItem) =>
                                  productItem.id === product.productId
                              )?.price || 0) * product.quantity
                            ).toFixed(2)}{" "}
                            €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  <p className="mt-6 max-w-2xl text-sm leading-6 text-gray-500">
                    {intl.formatMessage({
                      id: "edit-event.my-products.no-product-specify",
                    })}
                  </p>
                </div>
              )}
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
              </div>
              <CommentaryFeed isCommentingAllowed={false} />
            </div>
          </div>
        </>
      ) : null}
    </PageLayout>
  );
};

export default EventDetails2;
