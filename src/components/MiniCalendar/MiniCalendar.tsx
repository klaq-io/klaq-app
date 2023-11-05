import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  CalendarDaysIcon,
  EyeIcon,
  FaceFrownIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { enUS, fr } from "date-fns/esm/locale";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getEventsByStatus } from "../../redux/Events/selectors";
import { EventStatus } from "../../redux/Events/slices";
import { PATHS } from "../../routes";
import {
  classNames,
  getDayStr,
  getMonthStr,
  getSubEventsListFromMainEvents,
} from "../../utils/utils";
import { KebabMenu } from "../KebabMenu";
import { useFetchMainEvents } from "redux/MainEvent/hooks";
import { getMainEventsByStatus } from "redux/MainEvent/selectors";
import { SubEvent } from "interface/Event/subevent.interface";
import { Customer } from "redux/Customer/slices";

type Event = SubEvent & {
  customer: Customer;
  mainEventId: string;
};

export const MiniCalendar = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const daysList = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 1 }),
  });

  const [, fetchMainEvents] = useFetchMainEvents();
  const mainEvents = useSelector((state: any) =>
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

  const subEventsList = mainEvents.flatMap((e) =>
    getSubEventsListFromMainEvents(e)
  );

  const subEventsByDay = subEventsList.reduce((subEventsByDay, event) => {
    const date = format(new Date(event.date), "yyyy-MM-dd");
    return {
      ...subEventsByDay,
      [date]: (subEventsByDay[date] || []).concat(event),
    };
  }, {} as { [key: string]: Event[] });

  const days = daysList.map((day) => ({
    date: day,
    events: subEventsByDay[format(day, "yyyy-MM-dd")] || [],
  }));

  const formatTime = (time: string) => {
    const t = parse(time, "HH:mm:ss", new Date());
    return format(t, "HH:mm");
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const prevMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
  };

  const handleEventDetails = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}/details?tab=Roadmap`);
  };

  const menuItems = (eventId: string) => [
    {
      name: "events.button.look",
      onClick: () => handleEventDetails(eventId),
      icon: EyeIcon,
    },
  ];

  useEffect(() => {
    fetchMainEvents();
  }, []);

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 p-6">
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        <div className="md:pr-14">
          <div className="flex items-center">
            <h2 className="flex-auto text-sm font-semibold text-gray-900">
              <time>
                {intl.formatMessage({ id: getMonthStr(firstDayCurrentMonth) })}
                {format(firstDayCurrentMonth, " yyyy")}
              </time>
            </h2>
            <button
              type="button"
              onClick={prevMonth}
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
            <div>{intl.formatMessage({ id: "events.day.monday" }).at(0)}</div>
            <div>{intl.formatMessage({ id: "events.day.tuesday" }).at(0)}</div>
            <div>
              {intl.formatMessage({ id: "events.day.wednesday" }).at(0)}
            </div>
            <div>{intl.formatMessage({ id: "events.day.thursday" }).at(0)}</div>
            <div>{intl.formatMessage({ id: "events.day.friday" }).at(0)}</div>
            <div>{intl.formatMessage({ id: "events.day.saturday" }).at(0)}</div>
            <div>{intl.formatMessage({ id: "events.day.sunday" }).at(0)}</div>
          </div>
          <div className="mt-2 grid grid-cols-7 text-sm">
            {days.map((day, dayIdx) => (
              <div
                key={day.date.toString()}
                className={classNames(
                  dayIdx > 6 && "border-t border-gray-200",
                  "py-2"
                )}
              >
                <button
                  onClick={() => setSelectedDay(day.date)}
                  type="button"
                  className={classNames(
                    isEqual(day.date, selectedDay) && "text-white",
                    !isEqual(day.date, selectedDay) &&
                      isToday(day.date) &&
                      "text-danger-600",
                    !isEqual(day.date, selectedDay) &&
                      !isToday(day.date) &&
                      isSameMonth(day.date, firstDayCurrentMonth) &&
                      "text-gray-900",
                    !isEqual(day.date, selectedDay) &&
                      !isToday(day.date) &&
                      !isSameMonth(day.date, firstDayCurrentMonth) &&
                      "text-gray-400",
                    isEqual(day.date, selectedDay) &&
                      isToday(day.date) &&
                      "bg-danger-600",
                    isEqual(day.date, selectedDay) &&
                      !isToday(day.date) &&
                      "bg-gray-900",
                    !isEqual(day.date, selectedDay) && "hover:bg-gray-200",
                    (isEqual(day.date, selectedDay) || isToday(day.date)) &&
                      "font-semibold",
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full flex-col"
                  )}
                >
                  <time dateTime={format(day.date, "yyyy-MM-dd")}>
                    {format(day.date, "d")}
                  </time>
                  {day.events.length && !isEqual(day.date, selectedDay) ? (
                    <span className="-m-2 text-danger-600">•</span>
                  ) : null}
                </button>
              </div>
            ))}
          </div>
        </div>
        <section className="mt-12 md:mt-0 md:pl-14">
          <h2 className="text-base font-semibold leading-6 text-gray-900">
            {intl.formatMessage({
              id: getDayStr(selectedDay),
            })}{" "}
            {format(selectedDay, "d ")}
            {intl.formatMessage({
              id: getMonthStr(selectedDay),
            })}{" "}
            {format(selectedDay, " yyyy")}
          </h2>
          <ol className="border-t border-gray-200 mt-4 space-y-1 text-sm leading-6 text-gray-500">
            {subEventsByDay &&
            subEventsByDay[format(selectedDay, "yyyy-MM-dd")] &&
            subEventsByDay[format(selectedDay, "yyyy-MM-dd")].length > 0 ? (
              subEventsByDay[format(selectedDay, "yyyy-MM-dd")].map((event) =>
                event.startTime ? (
                  <li
                    key={event.id}
                    className="group flex items-center space-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100"
                  >
                    <div className="flex-auto">
                      <p className="text-gray-900">{event.customer.name}</p>
                      <p className="mt-0.5">
                        <time dateTime={formatTime(event.startTime)}>
                          {formatTime(event.startTime)}
                        </time>{" "}
                        {event.endTime
                          ? `- ${(
                              <time dateTime={formatTime(event.endTime)}>
                                {formatTime(event.endTime)}
                              </time>
                            )}`
                          : null}
                      </p>
                    </div>
                    <KebabMenu items={menuItems(event.id)} />
                  </li>
                ) : null
              )
            ) : (
              <div className="px-6 py-14 text-center text-sm sm:px-6">
                <CalendarDaysIcon
                  className="mx-auto h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                <p className="mt-4 font-semibold text-gray-900">
                  {intl.formatMessage({
                    id: "calendar.no-events.header",
                  })}
                </p>
                <p className="mt-2 text-gray-500">
                  {intl.formatMessage(
                    {
                      id: "calendar.no-events.description",
                    },
                    {
                      date: format(selectedDay, "d MMMM yyyy", {
                        locale: intl.locale == "fr-FR" ? fr : enUS,
                      }),
                    }
                  )}
                </p>
              </div>
            )}
          </ol>
        </section>
      </div>
    </div>
  );
};
