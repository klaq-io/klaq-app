import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BoltIcon,
  CalendarDaysIcon,
  ClockIcon,
  CreditCardIcon,
  InformationCircleIcon,
  LinkIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import { Button, EventBadge, Skeleton } from "../../components";
import { PageLayout } from "../../layouts";
import { Map } from "../../components";
import { getEventById } from "../../redux/Events/selectors";
import { useFetchEvents } from "../../redux/Events/hooks";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetDistanceAndDuration } from "../../redux/Map/hooks";
import {
  Distance,
  Duration,
} from "../../interface/distance-and-duration.interface";
import { PATHS } from "../../routes";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { EventProduct } from "../../redux/Events/slices";
import { ProductItem } from "../../redux/Products/slices";
import { getAllProducts } from "../../redux/Products/selectors";
import { format, parse } from "date-fns";
import { Alert } from "../../components/Alert/Alert";

const EventDetails = () => {
  const intl = useIntl();
  const { id } = useParams();

  const [distance, setDistance] = useState<Distance | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const event = useSelector((state: any) => getEventById(state, id!));

  const [{ isLoading: isFetchingProductLoading }, fetchProducts] =
    useFetchProductItems();
  const products = useSelector(getAllProducts);

  const [, getDistanceAndDuration] = useGetDistanceAndDuration();

  const getEventProductsValue = (eventProducts: EventProduct[] | undefined) => {
    if (!eventProducts) return 0;
    if (!products || !products.length) return 0;
    const totalEventProducts = eventProducts.map((product: EventProduct) => ({
      product: products.find(
        (productItems: ProductItem) => productItems.id === product.productId
      ),
      quantity: product.quantity,
    }));
    const total = totalEventProducts.reduce((acc, curr) => {
      if (curr?.product?.price && typeof curr.quantity === "number") {
        return acc + curr.product.price * curr.quantity;
      } else {
        return acc;
      }
    }, 0);
    return total.toFixed(2);
  };

  const formatTime = (time: string) => {
    const t = parse(time, "HH:mm:ss", new Date());
    return format(t, "HH:mm");
  };

  useEffect(() => {
    if (event && event.coordinates) {
      getDistanceAndDuration(
        { longitude: 0.57768, latitude: 49.34846 },
        {
          latitude: event.coordinates.latitude,
          longitude: event.coordinates.longitude,
        }
      ).then((res) => {
        setDistance(res.distance);
        setDuration(res.duration);
      });
    }
  }, [event]);

  useEffect(() => {
    fetchEvents();
    fetchProducts();
  }, []);
  return (
    <PageLayout>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Button
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
          <div className="flex flex-shrink-0 space-x-4">
            <Button variant="text" color="secondary" type="button">
              {intl.formatMessage({
                id: "Editer",
              })}
            </Button>
            <Button variant="text" color="secondary" type="button">
              {intl.formatMessage({
                id: "Voir",
              })}
            </Button>
            <Button variant="contained" color="primary" type="button" size="lg">
              {intl.formatMessage({
                id: "Envoyer",
              })}
            </Button>
          </div>
        </div>
      </div>

      {event && (
        <div className="mt-6">
          <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="p-8">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                      <h3 className="text-base font-semibold leading-7 text-klaq-600">
                        {intl.formatMessage({
                          id: "event-details.informations.header",
                        })}
                      </h3>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.type",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">
                          {intl.formatMessage({
                            id: `new-event.date.input.event-type.${event.eventType}`,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.number-of-guests",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">
                          {event.numberOfGuests}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.public-event",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">
                          {intl.formatMessage({
                            id: `new-event.date.input.public-event.${event.publicEvent}`,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.start-date",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">
                          {/* // TODO: update with the start date */}
                          {format(new Date(event.date), "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.end-date",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">
                          {/* // TODO: update with the end date */}
                          {format(new Date(event.date), "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.start-time",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">
                          {formatTime(event.startTime)}
                        </p>
                      </div>
                    </div>
                    <div
                      className="sm:col-span-2
                    "
                    >
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.informations.label.end-time",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">
                          {formatTime(event.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Summary */}
              <div className="flex flex-col justify-between bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                <div className="lg:col-start-3 lg:row-end-1">
                  <h2 className="sr-only">Summary</h2>
                  <div className="">
                    <dl className="flex flex-wrap">
                      <div className="flex-auto pl-6 pt-6">
                        <dt className="text-sm font-semibold leading-6 text-gray-900">
                          {intl.formatMessage({
                            id: "event-details.summary.total",
                          })}
                        </dt>
                        <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                          {isFetchingProductLoading ? (
                            <Skeleton variant="rounded" width={40} height={6} />
                          ) : (
                            <>{getEventProductsValue(event.products)} €</>
                          )}
                        </dd>
                      </div>
                      <div className="flex-none self-end px-6 pt-4">
                        <dt className="sr-only">Status</dt>
                        <dd>
                          <EventBadge status={event.status} />
                        </dd>
                      </div>
                      <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                        <dt className="flex-none">
                          <span className="sr-only">Client</span>
                          <UserCircleIcon
                            className="h-6 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd className="text-sm font-medium leading-6 text-gray-900">
                          <a href={`${PATHS.CUSTOMERS}/${event.customer.id}`}>
                            {event.customer.name}
                          </a>
                        </dd>
                      </div>
                      <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                        <dt className="flex-none">
                          <span className="sr-only">Due date</span>
                          <CalendarDaysIcon
                            className="h-6 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd className="text-sm leading-6 text-gray-500">
                          {format(new Date(event.date), "dd/MM/yyyy")}
                        </dd>
                      </div>
                      <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                        <dt className="flex-none">
                          <span className="sr-only">Status</span>
                          <CreditCardIcon
                            className="h-6 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd className="text-sm leading-6 text-gray-500">
                          {intl.formatMessage({
                            id: "event-details.summary.no-payments-receive",
                          })}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
                  <div className="flex flex-col justify-center items-center">
                    <Button
                      variant="text"
                      color="secondary"
                      type="button"
                      leadingIcon={<LinkIcon className="h-5 w-5" />}
                      trailingIcon={<ArrowRightIcon className="h-5 w-5" />}
                    >
                      {intl.formatMessage({
                        id: "event-details.button.attach-files",
                      })}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pt-10">
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="p-8">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                      <h3 className="text-base font-semibold leading-7 text-klaq-600">
                        {intl.formatMessage({
                          id: "event-details.location.header",
                        })}
                      </h3>
                    </div>
                    <div className="col-span-full">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.location.label.address",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">{event.address}</p>
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.location.label.zip",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">{event.zipcode}</p>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.location.label.city",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">{event.city}</p>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-600">
                        {intl.formatMessage({
                          id: "event-details.location.label.country",
                        })}
                      </label>
                      <div className="mt-2">
                        <p className="py-1.5 text-gray-900">{event.country}</p>
                      </div>
                    </div>
                    <div className="sm:col-span-full">
                      <Alert
                        text={intl.formatMessage(
                          {
                            id: "event-details.location.distance-and-duration",
                          },
                          {
                            distance: (distance && distance.text) || 0,
                            duration: (duration && duration.text) || 0,
                            travelFees:
                              distance &&
                              Math.round(0.5 * (distance.value / 1000)),
                            b: (chunk: any) => (
                              <span className="text-blue-700 font-semibold">
                                {chunk.join()}
                              </span>
                            ),
                          }
                        )}
                        status="info"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                {event && event.coordinates && (
                  <>
                    <Map
                      zoom={12}
                      longitude={event.coordinates.longitude}
                      latitude={event.coordinates.latitude}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export { EventDetails as EventDetails2 };
