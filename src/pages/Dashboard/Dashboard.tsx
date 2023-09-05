import {
  ArrowRightIcon,
  BanknotesIcon,
  BellAlertIcon,
  BellSlashIcon,
  CurrencyEuroIcon,
  InboxArrowDownIcon,
  InboxIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, EventList, MiniCalendar, Skeleton } from "components";
import { PageLayout } from "../../layouts";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getEventsByStatus } from "../../redux/Events/selectors";
import { EventStatus } from "../../redux/Events/slices";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { PATHS } from "../../routes";
import {
  getEventsForPeriod,
  getPipeValue,
  getThisMonthDates,
  getThisYearDates,
} from "../../utils/utils";

export const Dashboard = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [startOfYear, endOfYear] = getThisYearDates();
  const [startOfMonth, endOfMonth] = getThisMonthDates();

  const [{ isLoading: isFetchEventLoading }, fetchEvents] = useFetchEvents();
  const inboxEvents = useSelector((state: any) =>
    getEventsByStatus(state, EventStatus.INBOX)
  );
  const overdueEvents = useSelector((state: any) =>
    getEventsByStatus(state, EventStatus.INVOICE_OVERDUE)
  );

  const billedEvents = useSelector((state: any) =>
    getEventsByStatus(state, EventStatus.WIN)
  );
  const billedAndQuotedEvents = useSelector((state: any) =>
    getEventsByStatus(
      state,
      EventStatus.WIN,
      EventStatus.INVOICE_SENT,
      EventStatus.INVOICE_OPENED,
      EventStatus.CONTRACT_ACCEPTED,
      EventStatus.CONTRACT_OPENED,
      EventStatus.CONTRACT_SENT,
      EventStatus.CONTRACT_REJECTED,
      EventStatus.QUOTE_ACCEPTED,
      EventStatus.QUOTE_OPENED,
      EventStatus.QUOTE_SENT
    )
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
  const thisMonthUpcomingEvents = getEventsForPeriod(
    upcomingEvents,
    startOfMonth,
    endOfMonth
  );

  const [{ isLoading: isFetchProductLoading }, fetchProducts] =
    useFetchProductItems();
  const products = useSelector(getAllProducts);

  const totalBilled = getPipeValue(
    products,
    getEventsForPeriod(billedEvents, startOfYear, endOfYear)
  );
  const estimatedRevenue = getPipeValue(
    products,
    getEventsForPeriod(billedAndQuotedEvents, startOfYear, endOfYear)
  );

  const stats = [
    {
      id: 1,
      name: "inbox",
      stat: inboxEvents.length,
      icon: inboxEvents.length ? InboxArrowDownIcon : InboxIcon,
      onClick: () =>
        navigate(
          `${PATHS.EVENTS}?filter=THIS_YEAR&tab=0&startDate=${startOfYear}&endDate=${endOfYear}`
        ),
    },
    {
      id: 2,
      name: "total-billed",
      stat: `${totalBilled} €`,
      icon: BanknotesIcon,
    },
    {
      id: 3,
      name: "estimated-revenue",
      stat: `${estimatedRevenue} €`,
      icon: CurrencyEuroIcon,
    },
    {
      id: 4,
      name: "overdue",
      stat: overdueEvents.length,
      icon: overdueEvents.length ? BellAlertIcon : BellSlashIcon,
      onClick: () =>
        navigate(
          `${PATHS.EVENTS}?filter=THIS_YEAR&tab=3&startDate=${startOfYear}&endDate=${endOfYear}`
        ),
    },
  ];

  const handleNewEvent = () => {
    navigate(PATHS.NEW_EVENT);
  };

  useEffect(() => {
    fetchEvents();
    fetchProducts();
  }, []);

  return (
    <PageLayout>
      <div>
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
                {isFetchProductLoading || isFetchEventLoading ? (
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
        <div className="mt-6">
          {/* <div className="flex flex-row items-center justify-between">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {intl.formatMessage({
                id: `dashboard.upcoming-events`,
              })}
            </h3>
            <Button
              type="button"
              variant="contained"
              color="primary"
              leadingIcon={<PlusIcon className="h-5 w-5" aria-hidden="true" />}
              onClick={handleNewEvent}
            >
              {intl.formatMessage({
                id: `dashboard.button.new-event`,
              })}
            </Button>
          </div> */}

          <div className="mt-6">
            <div className="flex flex-row">
              <div className="w-2/3">
                <MiniCalendar />
              </div>
              <div className="w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
