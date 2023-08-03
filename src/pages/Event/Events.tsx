import {
  ChevronRightIcon,
  ClockIcon,
  EyeIcon,
  FolderIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EventBadge } from "../../components";
import { PageLayout } from "../../layouts";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getAllEvents, getEventsByStatus } from "../../redux/Events/selectors";
import { Event, EventStatus } from "../../redux/Events/slices";
import { PATHS } from "../../routes";
import {
  classNames,
  getDayStr,
  getEventsForPeriod,
  getMonthStr,
  getPipeValue,
  getThisMonthDates,
  getThisWeekDates,
  getThisYearDates,
} from "../../utils/utils";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";

enum FILTER_OPTIONS {
  THIS_WEEK = "THIS_WEEK",
  THIS_MONTH = "THIS_MONTH",
  THIS_YEAR = "THIS_YEAR",
  CUSTOM = "CUSTOM",
}

export const Events = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const filterParam =
    FILTER_OPTIONS[searchParams.get("filter") as FILTER_OPTIONS];
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const [startDate, setStartDate] = useState<string>(
    startDateParam || getThisWeekDates()[0].toString()
  );
  const [endDate, setEndDate] = useState<string>(
    endDateParam || getThisWeekDates()[1].toString()
  );
  const [selectedTab, setSelectedTab] = useState(parseInt(tabParam!) || 0);
  const [selectedFilter, setSelectedFilter] = useState<string>(
    filterParam || FILTER_OPTIONS.THIS_MONTH
  );

  const [{ isLoading }, fetchEvents] = useFetchEvents();
  const events: Event[] = useSelector(getAllEvents);

  const [{ isLoading: isFetchingProducts }, fetchProducts] =
    useFetchProductItems();
  const products = useSelector(getAllProducts);

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

  const handleFilterChange = (value: string) => {
    switch (value) {
      case FILTER_OPTIONS.THIS_WEEK.toString():
        setSelectedFilter(FILTER_OPTIONS.THIS_WEEK);
        setStartDate(getThisWeekDates()[0].toString());
        setEndDate(getThisWeekDates()[1].toString());
        break;
      case FILTER_OPTIONS.THIS_MONTH.toString():
        setSelectedFilter(FILTER_OPTIONS.THIS_MONTH);
        setStartDate(getThisMonthDates()[0].toString());
        setEndDate(getThisMonthDates()[1].toString());
        break;
      case FILTER_OPTIONS.THIS_YEAR.toString():
        setSelectedFilter(FILTER_OPTIONS.THIS_YEAR);
        setStartDate(getThisYearDates()[0].toString());
        setEndDate(getThisYearDates()[1].toString());
        break;
      case FILTER_OPTIONS.CUSTOM.toString():
        setSelectedFilter(FILTER_OPTIONS.CUSTOM);
        break;
      default:
        break;
    }
  };

  const tabs = [
    {
      name: "new",
      current: selectedTab === 0 ? true : false,
      events: getEventsForPeriod(
        newEvents,
        new Date(startDate),
        new Date(endDate)
      ),
    },
    {
      name: "upcoming",
      current: selectedTab === 1 ? true : false,
      events: getEventsForPeriod(
        upcomingEvents,
        new Date(startDate),
        new Date(endDate)
      ),
    },
    {
      name: "pending",
      current: selectedTab === 2 ? true : false,
      events: getEventsForPeriod(
        pendingEvents,
        new Date(startDate),
        new Date(endDate)
      ),
    },
    {
      name: "past",
      current: selectedTab === 3 ? true : false,
      events: getEventsForPeriod(
        pastEvents,
        new Date(startDate),
        new Date(endDate)
      ),
    },
    {
      name: "lost",
      current: selectedTab === 4 ? true : false,
      events: getEventsForPeriod(
        lostEvents,
        new Date(startDate),
        new Date(endDate)
      ),
    },
    {
      name: "all",
      current: selectedTab === 5 ? true : false,
      events: getEventsForPeriod(
        events,
        new Date(startDate),
        new Date(endDate)
      ),
    },
  ];

  const handleEventDetails = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}`);
  };

  const handleNewEvent = () => {
    navigate(PATHS.NEW_EVENT);
  };

  const formatTime = (time: string) => {
    const t = parse(time, "HH:mm:ss", new Date());
    return format(t, "HH:mm");
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

  useEffect(() => {
    fetchEvents();
    fetchProducts();
  }, []);

  useEffect(() => {
    setSearchParams({
      filter: selectedFilter,
      tab: selectedTab.toString(),
      startDate: startDate,
      endDate: endDate,
    });
  }, [selectedTab, selectedFilter, startDateParam, endDateParam]);

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
                  ? "bg-klaq-100 text-klaq-700"
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
      <div className="flex mt-5">
        <div className="flex-1">
          {events && events.length > 0 ? (
            <>
              <div className="pb-5 sm:flex sm:items-center flex flex-row">
                <div className="flex">
                  <select
                    value={selectedFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    id="location"
                    name="location"
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-klaq-600 sm:text-sm sm:leading-6"
                  >
                    <option value={FILTER_OPTIONS.THIS_WEEK}>
                      {intl.formatMessage({
                        id: `events.filter.${FILTER_OPTIONS.THIS_WEEK.toLocaleLowerCase()}`,
                      })}
                    </option>
                    <option value={FILTER_OPTIONS.THIS_MONTH}>
                      {intl.formatMessage({
                        id: `events.filter.${FILTER_OPTIONS.THIS_MONTH.toLocaleLowerCase()}`,
                      })}
                    </option>
                    <option value={FILTER_OPTIONS.THIS_YEAR}>
                      {intl.formatMessage({
                        id: `events.filter.${FILTER_OPTIONS.THIS_YEAR.toLocaleLowerCase()}`,
                      })}
                    </option>
                    <option value={FILTER_OPTIONS.CUSTOM}>
                      {intl.formatMessage({
                        id: `events.filter.${FILTER_OPTIONS.CUSTOM.toLocaleLowerCase()}`,
                      })}
                    </option>
                  </select>
                </div>
                <div className="flex items-center justify-center ml-4">
                  <p className="max-w-2xl text-sm leading-6 text-gray-500">
                    {intl.formatMessage(
                      {
                        id: "events.pipe-value",
                      },
                      {
                        pipeValue: getPipeValue(
                          products,
                          tabs[selectedTab].events
                        ),
                      }
                    )}
                  </p>
                </div>
                <div className="flex ml-auto space-x-3">
                  <div className="flex">
                    <input
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setSearchParams({
                          filter: FILTER_OPTIONS.CUSTOM.toString(),
                        });
                      }}
                      type="date"
                      name="startDate"
                      id="startDate"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                      -
                    </p>
                  </div>
                  <div className="flex">
                    <input
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setSearchParams({
                          filter: FILTER_OPTIONS.CUSTOM.toString(),
                        });
                      }}
                      type="date"
                      name="endDate"
                      id="endDate"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                      min={startDate}
                    />
                  </div>
                </div>
              </div>
              {tabs[selectedTab].events &&
              tabs[selectedTab].events.length > 0 ? (
                <>
                  <ul role="list" className="space-y-3">
                    {tabs[selectedTab].events.map((event) => (
                      <>
                        <li
                          key={event.id}
                          className="overflow-hidden rounded-md bg-white px-6 py-4 shadow flex"
                        >
                          <div className="flex flex-col items-center justify-center border-gray-200 border-r pr-3 text-klaq-600 w-1/5">
                            <span className="text-md">
                              {intl.formatMessage({
                                id: getDayStr(event.date),
                              })}
                            </span>
                            <span className="text-xl font-bold">
                              {format(new Date(event.date), "dd")}
                            </span>
                            <span className="text-md">
                              {intl.formatMessage({
                                id: getMonthStr(event.date),
                              })}
                            </span>
                          </div>
                          <div className="ml-4 flex flex-col justify-between w-2/5">
                            <div className="flex flex-row space-x-2 text-left">
                              <span className="text-md  text-gray-900">
                                {intl.formatMessage({
                                  id: `new-event.date.input.event-type.${event.eventType}`,
                                })}
                              </span>
                              <span className="text-md text-gray-900">
                                {" <> "}
                              </span>
                              <span
                                className="text-md text-gray-900 hover:text-klaq-600 hover:cursor-pointer font-bold"
                                onClick={() =>
                                  handleGoToCustomer(event.customer.id)
                                }
                              >
                                {event.customer.name}
                              </span>
                            </div>
                            <div className="flex flex-row space-x-3">
                              <div className="flex flex-row">
                                <ClockIcon className="h-5 w-5" />
                                <span className="ml-2 text-sm text-gray-900 border-r pr-3">
                                  {formatTime(event.startTime)} -{" "}
                                  {formatTime(event.endTime)}
                                </span>
                              </div>
                              <div className="flex flex-row">
                                <MapPinIcon className="h-5 w-5" />
                                <span className="ml-2 text-sm text-gray-900 hover:text-klaq-600">
                                  <a
                                    target="_blank"
                                    href={encodeURI(
                                      `https://maps.google.com/?q=${
                                        event.address
                                      } ${event.city} ${event.zipcode} ${"FR"}}`
                                    )}
                                  >
                                    {`${event.zipcode}, ${event.city}`}
                                  </a>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 w-1/5 items-center justify-center">
                            <div className="flex items-center justify-center">
                              <EventBadge status={event.status} />
                            </div>
                          </div>
                          <div className="flex flex-col space-y-4 ml-auto justify-center items-center w-1/5">
                            <button
                              className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-klaq-500"
                              onClick={() => handleEventDetails(event.id)}
                            >
                              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                            </button>
                          </div>
                        </li>
                      </>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="px-6 py-14 text-center text-sm sm:px-14">
                  <FolderIcon
                    className="mx-auto h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-semibold text-gray-900">
                    {intl.formatMessage({
                      id: `events.no-events-in-tab.${tabs[selectedTab].name}`,
                    })}
                  </h3>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6">
              <button
                onClick={handleNewEvent}
                type="button"
                className="relative block sm:w-1/2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2"
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
