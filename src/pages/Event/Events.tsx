import {
  EyeIcon,
  FolderIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { EventList } from "components";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageLayout } from "../../layouts";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getAllEvents, getEventsByStatus } from "../../redux/Events/selectors";
import { Event, EventStatus } from "../../redux/Events/slices";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { PATHS } from "../../routes";
import {
  classNames,
  getEventsForPeriod,
  getPipeValue,
  getSubEventsFromPeriod,
  getSubEventsListFromMainEvents,
  getThisMonthDates,
  getThisWeekDates,
  getThisYearDates,
} from "../../utils/utils";
import { getQuotePipeValue, getQuotePipeValueV2 } from "utils/quote";
import { useFetchMainEvents } from "redux/MainEvent/hooks";
import {
  getMainEvents,
  getMainEventsByStatus,
} from "redux/MainEvent/selectors";
import { MainEvent } from "interface/Event/main-event.interface";
import { SubEvent } from "interface/Event/subevent.interface";

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

  const filterParam =
    FILTER_OPTIONS[searchParams.get("filter") as FILTER_OPTIONS];
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const [startDate, setStartDate] = useState<string>(
    startDateParam || getThisYearDates()[0].toString()
  );
  const [endDate, setEndDate] = useState<string>(
    endDateParam || getThisYearDates()[1].toString()
  );
  const [selectedFilter, setSelectedFilter] = useState<string>(
    filterParam || FILTER_OPTIONS.THIS_YEAR
  );

  const [{ isLoading: isLoadingEvents }, fetchMainEvents] =
    useFetchMainEvents();

  const mainEvents = useSelector(getMainEvents);

  const newEventsList = useSelector((state: any) =>
    getMainEventsByStatus(state, EventStatus.INBOX)
  );

  const lostEvents = useSelector((state: any) =>
    getMainEventsByStatus(state, EventStatus.LOST)
  );

  const upcomingEvents = useSelector((state: any) =>
    getMainEventsByStatus(
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
    getMainEventsByStatus(
      state,
      EventStatus.QUALIFICATION,
      EventStatus.QUOTE_SENT,
      EventStatus.QUOTE_OPENED
    )
  );
  const pastEvents = useSelector((state: any) =>
    getMainEventsByStatus(
      state,
      EventStatus.DONE,
      EventStatus.INVOICE_SENT,
      EventStatus.INVOICE_OPENED,
      EventStatus.INVOICE_OVERDUE,
      EventStatus.WIN
    )
  );
  const overdueEvents = useSelector((state: any) =>
    getMainEventsByStatus(
      state,
      EventStatus.INVOICE_OVERDUE,
      EventStatus.DEPOSIT_LATE
    )
  );

  const handleFilterChange = (value: string) => {
    switch (value) {
      case FILTER_OPTIONS.THIS_WEEK:
        setSelectedFilter(FILTER_OPTIONS.THIS_WEEK);
        setStartDate(getThisWeekDates()[0].toString());
        setEndDate(getThisWeekDates()[1].toString());
        break;
      case FILTER_OPTIONS.THIS_MONTH:
        setSelectedFilter(FILTER_OPTIONS.THIS_MONTH);
        setStartDate(getThisMonthDates()[0].toString());
        setEndDate(getThisMonthDates()[1].toString());
        break;
      case FILTER_OPTIONS.THIS_YEAR:
        setSelectedFilter(FILTER_OPTIONS.THIS_YEAR);
        setStartDate(getThisYearDates()[0].toString());
        setEndDate(getThisYearDates()[1].toString());
        break;
      case FILTER_OPTIONS.CUSTOM:
        setSelectedFilter(FILTER_OPTIONS.CUSTOM);
        break;
      default:
        break;
    }
  };

  const tabs = [
    {
      name: "new",
      current: "new" === searchParams.get("tab") ? true : false,
      events:
        newEventsList && newEventsList.length
          ? getSubEventsFromPeriod(
              newEventsList.flatMap((e) => getSubEventsListFromMainEvents(e)),
              startDate,
              endDate
            )
          : [],
      pipeValue: getQuotePipeValueV2(newEventsList),
    },
    {
      name: "upcoming",
      current: "upcoming" === searchParams.get("tab") ? true : false,
      events:
        upcomingEvents && upcomingEvents.length
          ? getSubEventsFromPeriod(
              upcomingEvents.flatMap((e) => getSubEventsListFromMainEvents(e)),
              startDate,
              endDate
            )
          : [],
      pipeValue: getQuotePipeValueV2(upcomingEvents),
    },
    {
      name: "pending",
      current: "pending" === searchParams.get("tab") ? true : false,
      events:
        pendingEvents && pendingEvents.length
          ? getSubEventsFromPeriod(
              pendingEvents.flatMap((e) => getSubEventsListFromMainEvents(e)),
              startDate,
              endDate
            )
          : [],
      pipeValue: getQuotePipeValueV2(pendingEvents),
    },
    {
      name: "overdue",
      current: "overdue" === searchParams.get("tab") ? true : false,
      events:
        overdueEvents && overdueEvents.length
          ? getSubEventsFromPeriod(
              overdueEvents.flatMap((e) => getSubEventsListFromMainEvents(e)),
              startDate,
              endDate
            )
          : [],
      pipeValue: getQuotePipeValueV2(overdueEvents),
    },
    {
      name: "past",
      current: "past" === searchParams.get("tab") ? true : false,
      events:
        pastEvents && pastEvents.length
          ? getSubEventsFromPeriod(
              pastEvents.flatMap((e) => getSubEventsListFromMainEvents(e)),
              startDate,
              endDate
            )
          : [],
      pipeValue: getQuotePipeValueV2(pastEvents),
    },
    {
      name: "lost",
      current: "lost" === searchParams.get("tab") ? true : false,
      events:
        lostEvents && lostEvents.length
          ? getSubEventsFromPeriod(
              lostEvents.flatMap((e) => getSubEventsListFromMainEvents(e)),
              startDate,
              endDate
            )
          : [],
      pipeValue: getQuotePipeValueV2(lostEvents),
    },
    {
      name: "all",
      current: "all" === searchParams.get("tab") ? true : false,
      events:
        mainEvents && mainEvents.length
          ? getSubEventsFromPeriod(
              mainEvents.flatMap((e) => getSubEventsListFromMainEvents(e)),
              startDate,
              endDate
            )
          : [],
      pipeValue: getQuotePipeValueV2(mainEvents),
    },
  ];

  const current = tabs.find((tab) => tab.current) || tabs[0];

  const handleNewEvent = () => {
    navigate(PATHS.NEW_EVENT);
  };

  useEffect(() => {
    fetchMainEvents();
  }, []);

  useEffect(() => {
    setSearchParams({
      filter: selectedFilter,
      tab: tabs[0].name,
      startDate: startDate,
      endDate: endDate,
    });
  }, []);

  return (
    <PageLayout>
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
              onClick={() =>
                setSearchParams({
                  filter: selectedFilter,
                  tab: tab.name,
                  startDate: startDate,
                  endDate: endDate,
                })
              }
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
          {mainEvents && mainEvents.length > 0 ? (
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
                        pipeValue: current.pipeValue,
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
                        setSelectedFilter(FILTER_OPTIONS.CUSTOM);
                        setSearchParams({
                          filter: FILTER_OPTIONS.CUSTOM,
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
                        setSelectedFilter(FILTER_OPTIONS.CUSTOM);
                        setSearchParams({
                          filter: FILTER_OPTIONS.CUSTOM,
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
              {current.events && current.events.length > 0 ? (
                <EventList
                  isLoading={isLoadingEvents}
                  subEvents={current.events}
                />
              ) : (
                <div className="px-6 py-14 text-center text-sm sm:px-14">
                  <FolderIcon
                    className="mx-auto h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-semibold text-gray-900">
                    {intl.formatMessage({
                      id: `events.no-events-in-tab.${current.name}`,
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
