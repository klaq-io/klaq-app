import {
  FlagIcon,
  ChatBubbleLeftIcon,
  CubeIcon,
  DocumentCheckIcon,
  ChatBubbleLeftEllipsisIcon,
  ShoppingBagIcon,
  PlusSmallIcon,
  PlusIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import {
  BillingDocumentList,
  Button,
  CardContainer,
  CommentaryFeed,
  TextArea,
} from "components";
import { Alert } from "components/Alert/Alert";
import { useIntl } from "react-intl";
import { classNames } from "utils/utils";
import { MainEventDetailsPageProps } from "./EventDetailsPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { MainEvent } from "interface/Event/main-event.interface";
import { PATHS } from "routes";

enum SECTION {
  TASKS = "tasks",
  PRODUCTS = "products",
  BILLING = "billing",
  NOTES = "notes",
  LOGS = "logs",
}

const Navigation = () => {
  const intl = useIntl();
  const [query, setQuery] = useSearchParams();
  const selectedSection = query.get("section") || SECTION.TASKS;

  const secondaryNavigation = [
    {
      section: SECTION.TASKS,
      icon: FlagIcon,
      current: selectedSection === SECTION.TASKS,
    },
    {
      section: SECTION.PRODUCTS,
      icon: ShoppingBagIcon,
      current: selectedSection === SECTION.PRODUCTS,
    },
    {
      section: SECTION.BILLING,
      icon: DocumentCheckIcon,
      current: selectedSection === SECTION.BILLING,
    },
    // {
    //   section: SECTION.NOTES,
    //   icon: ChatBubbleLeftIcon,
    //   current: selectedSection === SECTION.NOTES,
    // },
    {
      section: SECTION.LOGS,
      icon: ChatBubbleLeftEllipsisIcon,
      current: selectedSection === SECTION.LOGS,
    },
  ];

  useEffect(() => {
    setQuery({ section: selectedSection });
  }, [selectedSection]);

  return (
    <div className="hidden sm:block">
      <div className="border-b border-gray-900/10">
        <nav className="flex space-x-8" aria-label="Tabs">
          {secondaryNavigation.map((tab) => (
            <a
              key={tab.section}
              onClick={() => setQuery({ section: tab.section })}
              className={classNames(
                tab.current
                  ? "border-klaq-500 text-klaq-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              <tab.icon
                className={classNames(
                  tab.current
                    ? "text-klaq-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-0.5 mr-2 h-5 w-5"
                )}
                aria-hidden="true"
              />
              <span>
                {intl.formatMessage({
                  id: `event-details.secondary-navigation.${tab.section}`,
                })}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export const BillingSection = (event: MainEvent) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const handleGenerateQuote = () => {
    navigate(`${PATHS.QUOTE_GENERATE}?fromEventId=${event.id}`);
  };

  const handleGenerateInvoice = () => {
    navigate(`${PATHS.INVOICE_GENERATE}?fromEventId=${event.id}`);
  };

  return (
    <div className="flex space-x-4 w-full">
      <CardContainer className="p-4 w-full flex flex-col space-y-4">
        <span className="flex justify-between items-center">
          <span className="text-gray-900 font-semibold">
            {intl.formatMessage({
              id: "quote.header",
            })}
          </span>
          <button onClick={handleGenerateQuote}>
            <PlusCircleIcon className="h-8 w-8 text-klaq-500 hover:text-klaq-600" />
          </button>
        </span>
        <BillingDocumentList documents={event.quotes} type="quote" />
      </CardContainer>

      <CardContainer className="p-4 w-full flex flex-col space-y-4">
        <span className="flex justify-between items-center">
          <span className="text-gray-900 font-semibold">
            {intl.formatMessage({
              id: "invoices.header",
            })}
          </span>
          <button onClick={handleGenerateInvoice}>
            <PlusCircleIcon className="h-8 w-8 text-klaq-500 hover:text-klaq-600" />
          </button>
        </span>
        <BillingDocumentList documents={event.invoices} type="invoice" />
      </CardContainer>
    </div>
  );
};

export const LogsSection = () => {
  return (
    <CardContainer className="p-4 w-full flex flex-col space-y-4">
      <CommentaryFeed />
    </CardContainer>
  );
};

export const EventDetailsBody = (props: MainEventDetailsPageProps) => {
  const { event } = props;
  const intl = useIntl();

  const [query] = useSearchParams();
  const selectedSection = query.get("section") || SECTION.TASKS;

  return (
    <>
      <Navigation />
      {selectedSection === SECTION.BILLING && <BillingSection {...event} />}

      {selectedSection === SECTION.LOGS && <LogsSection />}
    </>
  );
};
