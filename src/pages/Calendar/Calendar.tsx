import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { PageLayout } from "../../layouts";
import { classNames, getMonthStr } from "../../utils/utils";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { MonthView } from "./MonthView";
import { useIntl } from "react-intl";

const days = [
  { date: "2021-12-27", events: [] },
  { date: "2021-12-28", events: [] },
  { date: "2021-12-29", events: [] },
  { date: "2021-12-30", events: [] },
  { date: "2021-12-31", events: [] },
  { date: "2022-01-01", isCurrentMonth: true, events: [] },
  { date: "2022-01-02", isCurrentMonth: true, events: [] },
  {
    date: "2022-01-03",
    isCurrentMonth: true,
    events: [
      {
        id: 1,
        name: "Design review",
        time: "10AM",
        datetime: "2022-01-03T10:00",
        href: "#",
      },
      {
        id: 2,
        name: "Sales meeting",
        time: "2PM",
        datetime: "2022-01-03T14:00",
        href: "#",
      },
    ],
  },
  { date: "2022-01-04", isCurrentMonth: true, events: [] },
  { date: "2022-01-05", isCurrentMonth: true, events: [] },
  { date: "2022-01-06", isCurrentMonth: true, events: [] },
  {
    date: "2022-01-07",
    isCurrentMonth: true,
    events: [
      {
        id: 3,
        name: "Date night",
        time: "6PM",
        datetime: "2022-01-08T18:00",
        href: "#",
      },
    ],
  },
  { date: "2022-01-08", isCurrentMonth: true, events: [] },
  { date: "2022-01-09", isCurrentMonth: true, events: [] },
  { date: "2022-01-10", isCurrentMonth: true, events: [] },
  { date: "2022-01-11", isCurrentMonth: true, events: [] },
  {
    date: "2022-01-12",
    isCurrentMonth: true,
    isToday: true,
    events: [
      {
        id: 6,
        name: "Sam's birthday party",
        time: "2PM",
        datetime: "2022-01-25T14:00",
        href: "#",
      },
    ],
  },
  { date: "2022-01-13", isCurrentMonth: true, events: [] },
  { date: "2022-01-14", isCurrentMonth: true, events: [] },
  { date: "2022-01-15", isCurrentMonth: true, events: [] },
  { date: "2022-01-16", isCurrentMonth: true, events: [] },
  { date: "2022-01-17", isCurrentMonth: true, events: [] },
  { date: "2022-01-18", isCurrentMonth: true, events: [] },
  { date: "2022-01-19", isCurrentMonth: true, events: [] },
  { date: "2022-01-20", isCurrentMonth: true, events: [] },
  { date: "2022-01-21", isCurrentMonth: true, events: [] },
  {
    date: "2022-01-22",
    isCurrentMonth: true,
    isSelected: true,
    events: [
      {
        id: 4,
        name: "Maple syrup museum",
        time: "3PM",
        datetime: "2022-01-22T15:00",
        href: "#",
      },
      {
        id: 5,
        name: "Hockey game",
        time: "7PM",
        datetime: "2022-01-22T19:00",
        href: "#",
      },
    ],
  },
  { date: "2022-01-23", isCurrentMonth: true, events: [] },
  { date: "2022-01-24", isCurrentMonth: true, events: [] },
  { date: "2022-01-25", isCurrentMonth: true, events: [] },
  { date: "2022-01-26", isCurrentMonth: true, events: [] },
  { date: "2022-01-27", isCurrentMonth: true, events: [] },
  { date: "2022-01-28", isCurrentMonth: true, events: [] },
  { date: "2022-01-29", isCurrentMonth: true, events: [] },
  { date: "2022-01-30", isCurrentMonth: true, events: [] },
  { date: "2022-01-31", isCurrentMonth: true, events: [] },
  { date: "2022-02-01", events: [] },
  { date: "2022-02-02", events: [] },
  { date: "2022-02-03", events: [] },
  {
    date: "2022-02-04",
    events: [
      {
        id: 7,
        name: "Cinema with friends",
        time: "9PM",
        datetime: "2022-02-04T21:00",
        href: "#",
      },
    ],
  },
  { date: "2022-02-05", events: [] },
  { date: "2022-02-06", events: [] },
];

export const Calendar = () => {
  const intl = useIntl();
  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);

  let newDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(today), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(today), { weekStartsOn: 1 }),
  });

  return (
    <PageLayout>
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime="2022-01">
            {intl.formatMessage({ id: getMonthStr(today) })}
            {format(today, " yyyy")}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <div
              className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-gray-300"
              aria-hidden="true"
            />
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <Menu.Button
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Month view
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
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Day view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Week view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Month view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Year view
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-klaq-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-klaq-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaq-600"
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
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
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Create event
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
      <MonthView />
    </PageLayout>
  );
};
