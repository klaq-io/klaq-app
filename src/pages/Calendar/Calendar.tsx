import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfToday,
  startOfWeek
} from "date-fns";
import { useState } from "react";
import { useIntl } from "react-intl";
import { PageLayout } from "../../layouts";
import { MonthView } from "./MonthView";

export const Calendar = () => {
  const intl = useIntl();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);

  const newDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(today), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(today), { weekStartsOn: 1 }),
  });

  return (
    <PageLayout>
      <MonthView />
    </PageLayout>
  );
};
