import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Button, NewEventModal } from 'components';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { SubEvent } from 'interface/Event/subevent.interface';
import { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Customer } from 'redux/Customer/slices';
import { EventStatus } from 'redux/Events/slices';
import { useFetchMainEvents } from 'redux/MainEvent/hooks';
import { getMainEvents } from 'redux/MainEvent/selectors';
import { PATHS } from '../../routes';
import {
  classNames,
  getMonthStr,
  getSubEventsListFromMainEvents,
} from '../../utils/utils';

type Event = SubEvent & {
  customer: Customer;
  mainEventId: string;
  status: EventStatus;
};

export const MonthView = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [shouldOpenNewEvent, setOpenNewEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const [, fetchMainEvents] = useFetchMainEvents();
  const mainEvents = useSelector(getMainEvents);

  const subEventsList = mainEvents.flatMap((e) =>
    getSubEventsListFromMainEvents(e),
  );

  const subEventsByDay = subEventsList.reduce(
    (subEventsByDay, event) => {
      const date = format(new Date(event.date), 'yyyy-MM-dd');
      return {
        ...subEventsByDay,
        [date]: (subEventsByDay[date] || []).concat(event),
      };
    },
    {} as { [key: string]: Event[] },
  );

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 1 }),
  });

  const newDays = days.map((day) => ({
    date: day,
    events: subEventsByDay[format(day, 'yyyy-MM-dd')] || [],
  }));

  const handleGoToEventDetails = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}/details?tab=Roadmap`);
  };

  const handleGoToCreateEvent = () => {
    setOpenNewEvent(true);
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  };

  const prevMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
  };

  useEffect(() => {
    fetchMainEvents();
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time>
            {intl.formatMessage({ id: getMonthStr(firstDayCurrentMonth) })}
            {format(firstDayCurrentMonth, ' yyyy')}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <div
              className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-300"
              aria-hidden="true"
            />
            <button
              onClick={prevMonth}
              type="button"
              className="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              onClick={nextMonth}
              type="button"
              className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <Menu.Button
                disabled
                type="button"
                className="disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {intl.formatMessage({
                  id: 'calendar.select-view.month',
                })}
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          {intl.formatMessage({
                            id: 'calendar.select-view.day',
                          })}
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          {intl.formatMessage({
                            id: 'calendar.select-view.week',
                          })}
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          {intl.formatMessage({
                            id: 'calendar.select-view.month',
                          })}
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          {intl.formatMessage({
                            id: 'calendar.select-view.year',
                          })}
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <Button
              size="lg"
              onClick={handleGoToCreateEvent}
              type="button"
              variant="contained"
              color="primary"
            >
              {intl.formatMessage({
                id: 'calendar.button.add-event',
              })}
            </Button>
          </div>
        </div>
      </header>
      <div className="rounded-md flex-1 flex overflow-hidden">
        <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
            <div className="bg-white py-2">
              {intl.formatMessage({ id: 'events.day.monday' })}
            </div>
            <div className="bg-white py-2">
              {intl.formatMessage({ id: 'events.day.tuesday' })}
            </div>
            <div className="bg-white py-2">
              {intl.formatMessage({ id: 'events.day.wednesday' })}
            </div>
            <div className="bg-white py-2">
              {intl.formatMessage({ id: 'events.day.thursday' })}
            </div>
            <div className="bg-white py-2">
              {intl.formatMessage({ id: 'events.day.friday' })}
            </div>
            <div className="bg-white py-2">
              {intl.formatMessage({ id: 'events.day.saturday' })}
            </div>
            <div className="bg-white py-2">
              {intl.formatMessage({ id: 'events.day.sunday' })}
            </div>
          </div>
          <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
              {newDays.map((day) => (
                <div
                  key={day.date.toString()}
                  className={classNames(
                    isSameMonth(day.date, firstDayCurrentMonth)
                      ? 'bg-white'
                      : 'bg-gray-50 text-gray-500',
                    'relative px-3 py-2 h-32 overflow-y-scroll',
                  )}
                  onDoubleClick={() => {
                    setSelectedDate(day.date);
                    setOpenNewEvent(true);
                  }}
                >
                  <time
                    dateTime={format(day.date, 'yyyy-MM-dd')}
                    className={
                      isToday(day.date)
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-klaq-600 font-semibold text-white'
                        : undefined
                    }
                  >
                    {format(day.date, 'd')}
                  </time>
                  {day.events.length > 0 && (
                    <ol className="mt-2">
                      {day.events.slice(0, 2).map((event: Event) => (
                        <li key={event.id}>
                          <button
                            className="group flex flex-col items-start w-full truncate"
                            onClick={() =>
                              handleGoToEventDetails(event.mainEventId)
                            }
                          >
                            <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-klaq-600">
                              {event.type}
                            </p>
                            <span className="flex flex-row space-x-1">
                              {event.startTime ? (
                                <time
                                  dateTime={event.startTime}
                                  className="ml-3 hidden flex-none text-gray-500 group-hover:text-klaq-600 xl:block"
                                >
                                  {event.startTime}
                                </time>
                              ) : null}
                              {event.endTime ? (
                                <time
                                  dateTime={event.endTime}
                                  className="ml-3 hidden flex-none text-gray-500 group-hover:text-klaq-600 xl:block"
                                >
                                  - {event.endTime}
                                </time>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      ))}
                      {day.events.length > 2 && (
                        <li className="text-gray-500">
                          {intl.formatMessage(
                            { id: 'calendar.x-more-events' },
                            {
                              number: day.events.length - 2,
                            },
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
      </div>
      <NewEventModal
        isOpen={shouldOpenNewEvent}
        setOpen={setOpenNewEvent}
        suggestedDate={selectedDate}
      />
    </>
  );
};
