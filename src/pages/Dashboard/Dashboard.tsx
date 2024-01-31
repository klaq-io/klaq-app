import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BanknotesIcon,
  BellAlertIcon,
  BellSlashIcon,
  CurrencyEuroIcon,
  InboxArrowDownIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  GettingStartedModal,
  MiniCalendar,
  NewEventModal,
  NotificationWidget,
  Skeleton,
} from "components";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFetchMainEvents } from "redux/MainEvent/hooks";
import {
  getMainEventsByStatus,
  getThisMonthMainEvents,
} from "redux/MainEvent/selectors";
import { getQuotePipeValueV2 } from "utils/quote";
import { PageLayout } from "../../layouts";
import { EventStatus } from "../../redux/Events/slices";
import { PATHS } from "../../routes";
import { getThisMonthDates, getThisYearDates } from "../../utils/utils";
import { greetingByTime } from "utils/greetings";
import { getUser } from "redux/Login/selectors";
import { NotificationCard } from "components/Notifications/NotificationCard";

export const Dashboard = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const hasToDisplayLoom = window.location.pathname.includes(
    PATHS.ONBOARDING_WELCOME
  );

  const [openNewEventModal, setOpenNewEventModal] = useState<boolean>(false);
  const [startOfYear, endOfYear] = getThisYearDates();
  const [startOfMonth, endOfMonth] = getThisMonthDates();
  const user = useSelector(getUser);

  const [{ isLoading: isFetchingMainEvents }, fetchMainEvents] =
    useFetchMainEvents();

  const overdueMainEvents = useSelector((state: any) =>
    getMainEventsByStatus(state, EventStatus.INVOICE_OVERDUE)
  );

  const inboxMainEvents = useSelector((state: any) =>
    getMainEventsByStatus(state, EventStatus.INBOX)
  );

  const thisMonthEvents = useSelector(getThisMonthMainEvents);
  const confirmedEvents = thisMonthEvents.filter((event) =>
    [
      EventStatus.QUOTE_ACCEPTED,
      EventStatus.INVOICE_SENT,
      EventStatus.INVOICE_OVERDUE,
      EventStatus.INVOICE_OPENED,
      EventStatus.DONE,
      EventStatus.READY,
      EventStatus.WIN,
    ].includes(event.status)
  );
  const confirmedEventsTotal = getQuotePipeValueV2(confirmedEvents);

  const stats = [
    {
      id: 1,
      name: "inbox",
      stat: inboxMainEvents.length,
      icon: inboxMainEvents.length ? InboxArrowDownIcon : InboxIcon,
      onClick: () =>
        navigate(
          `${PATHS.EVENTS}?filter=THIS_YEAR&tab=0&startDate=${startOfYear}&endDate=${endOfYear}&tab=new`
        ),
    },
    {
      id: 2,
      name: "event-this-month",
      stat: confirmedEvents.length,
      icon: ArrowUpRightIcon,
    },
    {
      id: 3,
      name: "confirmed-this-month",
      stat: `${confirmedEventsTotal} €`,
      icon: CurrencyEuroIcon,
    },
    {
      id: 4,
      name: "overdue",
      stat: overdueMainEvents.length,
      icon: overdueMainEvents.length ? BellAlertIcon : BellSlashIcon,
      onClick: () =>
        navigate(
          `${PATHS.EVENTS}?filter=THIS_YEAR&tab=3&startDate=${startOfYear}&endDate=${endOfYear}&tab=overdue`
        ),
    },
  ];

  useEffect(() => {
    fetchMainEvents();
  }, []);

  return (
    <PageLayout>
      <div className="flex flex-col space-y-8">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.id}
              className="relative shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl bg-white px-4 pb-12 pt-5 sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-klaq-500 p-3">
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {intl.formatMessage({ id: `dashboard.stats.${item.name}` })}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                {isFetchingMainEvents ? (
                  <Skeleton
                    variant="rounded"
                    width={40}
                    height={6}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.stat}
                  </p>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6 shadow-sm sm:rounded-b-xl">
                  <Button
                    size="md"
                    variant="text"
                    color="primary"
                    trailingIcon={
                      <ArrowRightIcon
                        className="h-5 w-5 text-klaq-500 group-hover:text-klaq-400"
                        aria-hidden="true"
                      />
                    }
                    onClick={item.onClick}
                    type="button"
                    disabled={item.onClick === undefined}
                  >
                    {intl.formatMessage({
                      id: `dashboard.button.stats`,
                    })}
                  </Button>
                </div>
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
            {`${greetingByTime()} ${user.firstName ?? ""} !`}
          </h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenNewEventModal(true)}
          >
            {intl.formatMessage({ id: `dashboard.button.new-event` })}
          </Button>
        </div>
        <div className="flex flex-row">
          <div className="w-2/3">
            <MiniCalendar />
          </div>
          <div className="w-1/3"></div>
        </div>
      </div>
      <NewEventModal open={openNewEventModal} setOpen={setOpenNewEventModal} />
      <GettingStartedModal
        firstName={user.firstName}
        isOpen={hasToDisplayLoom}
      />
    </PageLayout>
  );
};

export default Dashboard;
