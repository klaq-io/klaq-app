import {
  ArrowLeftIcon,
  BoltIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import { Button } from "../../components";
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

const EventDetails = () => {
  const intl = useIntl();
  const { id } = useParams();
  const params = new URLSearchParams(window.location.search);

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const [distance, setDistance] = useState<Distance | null>(null);
  const [duration, setDuration] = useState<Duration | null>(null);
  const event = useSelector((state: any) => getEventById(state, id!));

  const [, getDistanceAndDuration] = useGetDistanceAndDuration();

  useEffect(() => {
    if (event) {
      getDistanceAndDuration(
        { longitude: 0.57768, latitude: 49.34846 },
        {
          latitude: event?.coordinates.latitude!,
          longitude: event?.coordinates.longitude!,
        }
      ).then((res) => {
        setDistance(res.distance);
        setDuration(res.duration);
      });
    }
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
        <div className="mt-6 space-y-10 divide-y divide-gray-900/10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
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
                {/* <div className="mt-10 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2 sm:col-start-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: "event-details.date.label.guests",
                    })}
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      value={event.numberOfGuests}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div> */}
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-full"></div>
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
                    <label
                      htmlFor="zip"
                      className="block text-sm font-medium leading-6 text-gray-600"
                    >
                      {intl.formatMessage({
                        id: "event-details.location.label.zip",
                      })}
                    </label>
                    <div className="mt-2">
                      <p className="py-1.5 text-gray-900">{event.zipcode}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-600"
                    >
                      {intl.formatMessage({
                        id: "event-details.location.label.city",
                      })}
                    </label>
                    <div className="mt-2">
                      <p className="py-1.5 text-gray-900">{event.city}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-600"
                    >
                      {intl.formatMessage({
                        id: "event-details.location.label.country",
                      })}
                    </label>
                    <div className="mt-2">
                      <p className="py-1.5 text-gray-900">{event.country}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-full">
                    <p className="text-sm leading-6 text-gray-600">
                      {intl.formatMessage(
                        {
                          id: "event-details.location.distance-and-duration",
                        },
                        {
                          distance: distance && distance.text,
                          duration: duration && duration.text,
                          travelFees:
                            distance &&
                            Math.round(0.5 * (distance.value / 1000)),
                          b: (chunk: any) => (
                            <span className="text-klaq-600 font-semibold">
                              {chunk.join()}
                            </span>
                          ),
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
              {event && event.coordinates && (
                <>
                  <Map
                    zoom={10}
                    longitude={event.coordinates.longitude}
                    latitude={event.coordinates.latitude}
                  />
                </>
              )}
            </div>
          </div>
          <div className="pt-10 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8"> Paris</div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export { EventDetails as EventDetails2 };
