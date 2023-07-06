import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../layouts";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getEventById } from "../../redux/Events/selectors";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { shortenString } from "../../utils/utils";
import { XCircleIcon } from "@heroicons/react/24/outline";

export const Event = () => {
  const { id } = useParams();
  const intl = useIntl();

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const event = useSelector((state: any) => getEventById(state, id!));

  const [, fetchProducts] = useFetchProductItems();
  const productItems = useSelector(getAllProducts);

  console.log(event?.products);

  useEffect(() => {
    fetchEvents();
    fetchProducts();
  }, []);

  // todo: implement that https://stackoverflow.com/questions/76599564/how-establish-typeorm-relation-between-orders-products
  return (
    <PageLayout isLoading={isLoading}>
      {event ? (
        <>
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Evenement du {new Date(event.date).toLocaleDateString()} pour{" "}
                {event.customer.firstName} {event.customer.lastName}
              </h2>
            </div>
            <div>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                ({event.id})
              </p>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-blue-600">
                  {intl.formatMessage({
                    id: "new-event.date.header",
                  })}
                </h3>
              </div>
              <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.date",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {new Date(event.date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.number-of-guest",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.numberOfGuests}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.start-time",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.startTime}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.date.label.end-time",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.endTime}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
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
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
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
                <h3 className="text-base font-semibold leading-7 text-blue-600">
                  {intl.formatMessage({
                    id: "new-event.location.header",
                  })}
                </h3>
              </div>
              <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.address",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.address}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.city",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.city}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.location.label.state",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.state}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
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
                <span className="text-blue-600">X km</span> de votre bureau.
                Vous aurez besoin de{" "}
                <span className="text-blue-600">X minutes</span> pour vous y
                rendre. Le coût estimé s'élève à{" "}
                <span className="text-blue-600">X€</span>.
              </p>
            </div>
            <div className="flex-1">{/** second part */}</div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-blue-600">
                  {intl.formatMessage({
                    id: "new-event.customer.header",
                  })}
                </h3>
              </div>
              <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.first-name",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.customer.firstName}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.last-name",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.customer.lastName}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: "new-event.customer.label.phone-number",
                      })}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {event.phoneNumber}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
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
                <h3 className="text-base font-semibold leading-7 text-blue-600">
                  {/* {intl.formatMessage({
                    id: "new-event.customer.header",
                  })} */}
                  Mes prestations
                </h3>
              </div>
              <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
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
                        Product
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        Price
                      </th>
                      <th
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        scope="col"
                      >
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200">
                        <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="mt-1 truncate text-gray-500">
                            {shortenString(40, product.description)}
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          <input
                            type="number"
                            className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          {product.price} €
                        </td>
                        <td className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
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
            </div>
            <div className="flex-1"></div>
          </div>
        </>
      ) : null}
    </PageLayout>
  );
};

export default Event;
