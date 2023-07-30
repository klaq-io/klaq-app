import {
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, EventBadge } from "../../components";
import { PageLayout } from "../../layouts";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getAllEvents, getEventsByStatus } from "../../redux/Events/selectors";
import { Event, EventStatus } from "../../redux/Events/slices";
import { PATHS } from "../../routes";
import { classNames, getDayStr } from "../../utils/utils";

export const Events = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const events: Event[] = useSelector(getAllEvents);
  const lostEvents = useSelector((state: any) =>
    getEventsByStatus(state, EventStatus.LOST)
  );
  const newEvents = useSelector((state: any) =>
    getEventsByStatus(state, EventStatus.INBOX)
  );
  const upcomingEvents = useSelector((state: any) =>
    getEventsByStatus(
      state,
      EventStatus.QUOTE_ACCEPTED,
      EventStatus.CONTRACT_SENT,
      EventStatus.CONTRACT_OPENED,
      EventStatus.DEPOSIT_REQUESTED,
      EventStatus.DEPOSIT_LATE,
      EventStatus.READY
    )
  );
  const pendingEvents = useSelector((state: any) =>
    getEventsByStatus(
      state,
      EventStatus.INBOX,
      EventStatus.QUALIFICATION,
      EventStatus.QUOTE_SENT,
      EventStatus.QUOTE_OPENED
    )
  );
  const pastEvents = useSelector((state: any) =>
    getEventsByStatus(
      state,
      EventStatus.DONE,
      EventStatus.INVOICE_SENT,
      EventStatus.INVOICE_OPENED,
      EventStatus.INVOICE_OVERDUE,
      EventStatus.WIN
    )
  );

  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = [
    {
      name: "all",
      current: selectedTab === 0 ? true : false,
      events: events,
    },
    {
      name: "new",
      current: selectedTab === 1 ? true : false,
      events: newEvents,
    },
    {
      name: "upcoming",
      current: selectedTab === 2 ? true : false,
      events: upcomingEvents,
    },
    {
      name: "pending",
      current: selectedTab === 3 ? true : false,
      events: pendingEvents,
    },
    {
      name: "past",
      current: selectedTab === 4 ? true : false,
      events: pastEvents,
    },
    {
      name: "lost",
      current: selectedTab === 5 ? true : false,
      events: lostEvents,
    },
  ];

  const handleEventDetails = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}`);
  };

  const handleEditEvent = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}/edit`);
  };

  const handleNewEvent = () => {
    navigate(PATHS.NEW_EVENT);
  };

  const formatTime = (time: string) => {
    const t = parse(time, "HH:mm:ss", new Date());
    return format(t, "HH:mm");
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd");
  };

  const formatGoogleMapUrl = (
    address: string,
    zipcode: string,
    city: string,
    country: string
  ) => {
    return encodeURI(
      `https://maps.google.com/?q=${address} ${city} ${zipcode} ${country}}`
    );
  };

  const handleGoToCustomer = (id: string) => {
    navigate(`${PATHS.CUSTOMERS}/${id}`);
  };

  const menuItems = (eventId: string) => [
    {
      name: "events.button.edit",
      onClick: () => handleEditEvent(eventId),
      icon: PencilSquareIcon,
    },

    {
      name: "events.button.look",
      onClick: () => handleEventDetails(eventId),
      icon: EyeIcon,
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {intl.formatMessage({
              id: "events.header",
            })}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {intl.formatMessage({
              id: "events.description",
            })}
          </p>
        </div>
      </div>
      <div className="mt-10">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab, idx) => (
            <span
              className={classNames(
                tab.current
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium hover:cursor-pointer"
              )}
              onClick={() => setSelectedTab(idx)}
            >
              {intl.formatMessage({
                id: `events.tabs.${tab.name}`,
              })}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex mt-10">
        <div className="flex-1">
          {tabs[selectedTab].events && tabs[selectedTab].events.length > 0 ? (
            tabs[selectedTab].events.map((event) => (
              <div className="border border-gray-200 rounded-md flex flex-fow p-4 mb-2 hover:border-gray-300">
                <div className="flex flex-col items-center justify-center border-gray-200 border-r pr-4 text-blue-600 w-1/5">
                  <span className="text-md">
                    {intl.formatMessage({ id: getDayStr(event.date) })}
                  </span>
                  <span className="text-2xl font-bold">
                    {formatDate(event.date)}
                  </span>
                </div>
                <div className="ml-4 flex flex-col space-y-4 w-2/5">
                  <div className="flex flex-row">
                    <ClockIcon className="h-5 w-5" />
                    <span className="ml-2 text-sm text-gray-900">
                      {formatTime(event.startTime)} -{" "}
                      {formatTime(event.endTime)}
                    </span>
                  </div>
                  <div className="flex flex-row">
                    <MapPinIcon className="h-5 w-5" />
                    <span className="ml-2 text-sm text-gray-900 hover:text-blue-600">
                      <a
                        target="_blank"
                        href={formatGoogleMapUrl(
                          event.address,
                          event.zipcode,
                          event.city,
                          "France"
                        )}
                      >
                        {`${event.zipcode}, ${event.city}`}
                      </a>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 w-2/5">
                  <div className="flex flex-row space-x-2 text-left">
                    <span className="text-md  text-gray-900">
                      {intl.formatMessage({
                        id: `new-event.date.input.event-type.${event.eventType}`,
                      })}
                    </span>
                    <span className="text-md text-gray-900">{" <> "}</span>
                    <span
                      className="text-md text-gray-900 hover:text-blue-600 hover:cursor-pointer font-bold"
                      onClick={() => handleGoToCustomer(event.customer.id)}
                    >
                      {event.customer.name}
                    </span>
                  </div>
                  <div>
                    <EventBadge status={event.status} />
                  </div>
                </div>
                <div className="flex flex-col space-y-4 ml-auto justify-center items-center w-1/5">
                  <DropdownMenu
                    items={menuItems(event.id)}
                    buttonText={intl.formatMessage({
                      id: "events.button.header",
                    })}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="mt-6">
              <button
                onClick={handleNewEvent}
                type="button"
                className="relative block sm:w-1/2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                />

                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  {intl.formatMessage({
                    id: "events.no-events",
                  })}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {intl.formatMessage({
                    id: "events.get-started",
                  })}
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Events;
