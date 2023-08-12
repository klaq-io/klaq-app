import {
  isSameMonth,
  format,
  isToday,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfToday,
  startOfWeek,
  parse,
  intlFormat,
} from "date-fns";
import { classNames } from "../../utils/utils";
import { useEffect, useState } from "react";
import { Event } from "../../redux/Events/slices";
import { useSelector } from "react-redux";
import { getAllEvents } from "../../redux/Events/selectors";
import { useFetchEvents } from "../../redux/Events/hooks";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { useIntl } from "react-intl";

export const MonthView = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [, fetchEvents] = useFetchEvents();
  const events = useSelector(getAllEvents);

  let days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(today), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(today), { weekStartsOn: 1 }),
  });

  const eventsByDay: { [key: string]: Event[] } = events.reduce(
    (eventsByDay, event) => {
      const date = format(new Date(event.date), "yyyy-MM-dd");
      return {
        ...eventsByDay,
        [date]: (eventsByDay[date] || []).concat(event),
      };
    },
    {} as { [key: string]: Event[] }
  );

  const newDays = days.map((day) => ({
    date: day,
    events: eventsByDay[format(day, "yyyy-MM-dd")] || [],
  }));

  const formatTime = (time: string) => {
    const t = parse(time, "HH:mm:ss", new Date());
    return format(t, "HH:mm");
  };

  const handleGoToEventDetails = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}`);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
        <div className="bg-white py-2">
          {intl.formatMessage({ id: "events.day.monday" })}
        </div>
        <div className="bg-white py-2">
          {intl.formatMessage({ id: "events.day.tuesday" })}
        </div>
        <div className="bg-white py-2">
          {intl.formatMessage({ id: "events.day.wednesday" })}
        </div>
        <div className="bg-white py-2">
          {intl.formatMessage({ id: "events.day.thursday" })}
        </div>
        <div className="bg-white py-2">
          {intl.formatMessage({ id: "events.day.friday" })}
        </div>
        <div className="bg-white py-2">
          {intl.formatMessage({ id: "events.day.saturday" })}
        </div>
        <div className="bg-white py-2">
          {intl.formatMessage({ id: "events.day.sunday" })}
        </div>
      </div>
      <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
        <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
          {newDays.map((day) => (
            <div
              key={day.date.toString()}
              className={classNames(
                isSameMonth(day.date, today)
                  ? "bg-white"
                  : "bg-gray-50 text-gray-500",
                "relative px-3 py-2"
              )}
            >
              <time
                dateTime={format(day.date, "yyyy-MM-dd")}
                className={
                  isToday(day.date)
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-klaq-600 font-semibold text-white"
                    : undefined
                }
              >
                {format(day.date, "d")}
              </time>
              {day.events.length > 0 && (
                <ol className="mt-2">
                  {day.events.slice(0, 2).map((event: Event) => (
                    <li key={event.id}>
                      <button
                        className="group flex"
                        onClick={() => handleGoToEventDetails(event.id)}
                      >
                        <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-klaq-600">
                          {event.customer.name}
                        </p>
                        <time
                          dateTime={formatTime(event.startTime)}
                          className="ml-3 hidden flex-none text-gray-500 group-hover:text-klaq-600 xl:block"
                        >
                          {formatTime(event.startTime)}
                        </time>
                      </button>
                    </li>
                  ))}
                  {day.events.length > 2 && (
                    <li className="text-gray-500">
                      {intl.formatMessage(
                        { id: "calendar.x-more-events" },
                        {
                          number: day.events.length - 2,
                        }
                      )}
                    </li>
                  )}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
