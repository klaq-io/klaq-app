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
      <MonthView />
    </PageLayout>
  );
};
