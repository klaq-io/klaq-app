import { useParams } from "react-router-dom";
import { PageLayout } from "../../layouts";
import { useIntl } from "react-intl";
import { useFetchEvents } from "../../redux/Events/hooks";
import { useEffect } from "react";
import { getAllEvents, getEventById } from "../../redux/Events/selectors";
import { useSelector } from "react-redux";

export const Event = () => {
  const { id } = useParams();
  const intl = useIntl();

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const event = useSelector((state: any) => getEventById(state, id!));

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <PageLayout>
      {event ? (
        <>
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Evenement du {new Date(event.date).toLocaleDateString()} pour{" "}
                {event.customer.firstName} {event.customer.lastName}
              </h2>
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
            <div className="flex-1">{/** firstpart */}</div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-blue-600">
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
            </div>
            <div className="flex-1">map</div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 mt-10">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-blue-600">
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
            <div className="flex-1"></div>
          </div>
        </>
      ) : null}
    </PageLayout>
  );
};

export default Event;
