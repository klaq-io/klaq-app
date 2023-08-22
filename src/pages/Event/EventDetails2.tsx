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
import {
  Button,
  EventBadge,
  EventSummaryCard,
  Skeleton,
  Tooltip,
} from "../../components";
import { PageLayout } from "../../layouts";
import { Map } from "../../components";
import { getEventById } from "../../redux/Events/selectors";
import { useFetchEvents } from "../../redux/Events/hooks";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetDistanceAndDuration } from "../../redux/Map/hooks";
import {
  Distance,
  Duration,
} from "../../interface/distance-and-duration.interface";
import { PATHS } from "../../routes";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { Event, EventProduct } from "../../redux/Events/slices";
import { ProductItem } from "../../redux/Products/slices";
import { getAllProducts } from "../../redux/Products/selectors";
import { format, parse } from "date-fns";
import { Alert } from "../../components/Alert/Alert";

const EventDetails = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  const [distance, setDistance] = useState<Distance | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const event = useSelector((state: any) => getEventById(state, id!));

  const [, getDistanceAndDuration] = useGetDistanceAndDuration();

  const formatTime = (time: string) => {
    const t = parse(time, "HH:mm:ss", new Date());
    return format(t, "HH:mm");
  };

  const setDistanceAndDuration = async (event: Event) => {
    if (!event.coordinates) {
      return;
    }
    const { distance, duration } = await getDistanceAndDuration(
      { longitude: 0.57768, latitude: 49.34846 },
      {
        latitude: event.coordinates.latitude,
        longitude: event.coordinates.longitude,
      }
    );
    setDistance(distance);
    setDuration(duration);
  };

  const handleLookQuote = () => {
    if (!id) return;
    console.log(`${PATHS.EVENTS}/${id}${PATHS.QUOTE_DETAILS}`);
    navigate(`${PATHS.EVENTS}/${id}${PATHS.QUOTE_DETAILS}`);
  };

  const handleEditQuote = () => {
    if (!id) return;
    navigate(`${PATHS.EVENTS}/${id}${PATHS.QUOTE_GENERATE}`);
  };

  useEffect(() => {
    if (!event) return;
    setDistanceAndDuration(event);
  }, [event]);

  useEffect(() => {
    fetchEvents();
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
            <Button
              variant="text"
              color="secondary"
              type="button"
              onClick={handleEditQuote}
            >
              {intl.formatMessage({
                id: `event-details.button.${"quote"}.edit`,
              })}
            </Button>
            <Button
              variant="text"
              color="secondary"
              type="button"
              onClick={handleLookQuote}
            >
              {intl.formatMessage({
                id: `event-details.button.${"quote"}.look`,
              })}
            </Button>
            <Button variant="contained" color="primary" type="button" size="lg">
              {intl.formatMessage({
                id: `event-details.button.${"quote"}.send`,
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
              <EventSummaryCard event={event} />
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
