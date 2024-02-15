import {
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button, CreateNewQuoteModal, KebabMenu, Skeleton } from "components";
import { QuoteBadgeButton } from "components/Quote/QuoteBadgeButton";
import { Quote, QuoteStatus } from "interface/Quote/quote.interface";
import { PageLayout } from "layouts";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDownloadQuoteDocument, useFetchQuotes } from "redux/Quote/hooks";
import { getQuotes } from "redux/Quote/selectors";
import { PATHS } from "routes";
import { classNames } from "utils/utils";

export const Quotes = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [openNewQuote, setOpenNewQuote] = useState(false);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";

  const [{ isLoading }, fetchQuotes] = useFetchQuotes();
  const quotes = useSelector(getQuotes) || [];

  const [, downloadQuote] = useDownloadQuoteDocument();

  const handleSendByMail = (id: string) => {
    navigate(PATHS.QUOTE + "/" + id + "/send/");
  };

  const handleNewQuote = () => {
    navigate(PATHS.QUOTE_GENERATE);
  };

  const handleEdit = (id: string, eventId: string) => {
    navigate(PATHS.QUOTE + "/edit/" + id + "/" + eventId);
  };

  const handleView = (id: string) => {
    navigate(PATHS.QUOTE + "/" + id + "/details");
  };

  const optionMenu = (quote: Quote) => [
    {
      name: "quote.list.menu.view",
      icon: EyeIcon,
      onClick: () => handleView(quote.id),
    },
    {
      name: "quote.list.menu.edit",
      icon: PencilSquareIcon,
      onClick: () => handleEdit(quote.id, quote.mainEvent.id),
    },
    {
      name: "quote.list.menu.send",
      icon: PaperAirplaneIcon,
      onClick: () => handleSendByMail(quote.id),
    },
    {
      name: "quote.list.menu.download",
      icon: ArrowDownTrayIcon,
      onClick: () => downloadQuote(quote.id, quote.number),
    },
    {
      name: "quote.list.menu.transform-to-invoice",
      icon: DocumentDuplicateIcon,
      onClick: () =>
        navigate(`${PATHS.INVOICE_GENERATE}?fromQuote=${quote.id}`),
    },
    // {
    //   name: "quote.list.menu.delete",
    //   icon: TrashIcon,
    //   onClick: () => {},
    // },
  ];

  const filteredQuotes =
    quotes && quotes.length > 0 && query === ""
      ? quotes
      : quotes.filter((quote) => {
          return (
            quote.mainEvent.customer.name
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            quote.number.toLowerCase().includes(query.toLowerCase())
          );
        });

  const tabs = [
    {
      name: "all",
      tab: "all",
      current: params.get("tab") === "all",
      quotes: filteredQuotes,
    },
    {
      name: "draft",
      current: params.get("tab") === QuoteStatus.DRAFT,
      tab: QuoteStatus.DRAFT,
      quotes: filteredQuotes.filter(
        (quote) => quote.status === QuoteStatus.DRAFT
      ),
    },
    {
      name: "sent",
      current: params.get("tab") === QuoteStatus.SENT,
      tab: QuoteStatus.SENT,
      quotes: filteredQuotes.filter(
        (quote) => quote.status === QuoteStatus.SENT
      ),
    },
    {
      name: "accepted",
      current: params.get("tab") === QuoteStatus.ACCEPTED,
      tab: QuoteStatus.ACCEPTED,
      quotes: filteredQuotes.filter(
        (quote) => quote.status === QuoteStatus.ACCEPTED
      ),
    },
    {
      name: "rejected",
      current: params.get("tab") === QuoteStatus.REJECTED,
      tab: QuoteStatus.REJECTED,
      quotes: filteredQuotes.filter(
        (quote) => quote.status === QuoteStatus.REJECTED
      ),
    },
  ];

  const currentTab = tabs.find((tab) => tab.current) || tabs[0];

  useEffect(() => {
    fetchQuotes();
    setParams({
      tab: "all",
    });
  }, []);

  return (
    <PageLayout>
      <div className="flex flex-col space-y-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {intl.formatMessage({
                id: "quote.header",
              })}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {intl.formatMessage({
                id: "quote.description",
              })}
            </p>
          </div>
          <div className="flex flex-1">
            <div className="ml-auto">
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleNewQuote}
              >
                {intl.formatMessage({
                  id: "quote.button.generate",
                })}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="border-b border-gray-900/10">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <span
                  key={tab.name}
                  className={classNames(
                    tab.current
                      ? "border-klaq-500 text-klaq-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium hover:cursor-pointer"
                  )}
                  onClick={() =>
                    setParams({
                      q: query,
                      tab: tab.tab,
                    })
                  }
                  aria-current={tab.current ? "page" : undefined}
                >
                  <span>
                    {intl.formatMessage({
                      id: `quote.tabs.${tab.name}`,
                    })}
                  </span>
                </span>
              ))}
            </nav>
          </div>
          <div className="w-1/2">
            <div className="relative flex-grow focus-within:z-10 ml-auto w-2/3">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                onChange={(e) =>
                  setParams({
                    tab: currentTab.tab,
                    q: e.target.value,
                  })
                }
                value={query}
                type="text"
                className="hidden w-full rounded-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:block"
                placeholder={intl.formatMessage({
                  id: "quote.search",
                })}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="-mx-4 sm:mx-0 sm:rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    {intl.formatMessage({
                      id: "quote.list.table.customer",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.list.table.issued-on",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.list.table.valid-until",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.list.table.status",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {intl.formatMessage({
                      id: "quote.list.table.total",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900"
                  >
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTab && currentTab.quotes && !isLoading ? (
                  currentTab.quotes.length > 0 &&
                  currentTab.quotes.map((quote: Quote) => (
                    <tr key={quote.id}>
                      <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6 text-left">
                        <div className="font-semibold text-gray-900 hover:cursor-pointer hover:text-klaq-600">
                          <button
                            onClick={() =>
                              navigate(
                                PATHS.CUSTOMERS +
                                  "/" +
                                  quote.mainEvent.customer.id
                              )
                            }
                          >
                            {quote.mainEvent.customer.name}
                          </button>
                        </div>
                        <div className="mt-2 font-medium text-gray-500">
                          {quote.number}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                        <div className="font-medium text-gray-500">
                          {new Date(quote.issuedOn).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                        <div className="font-medium text-gray-500">
                          {new Date(quote.validUntil).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                        <div className="font-medium text-gray-500">
                          <QuoteBadgeButton quote={quote} />
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                        <div className="font-medium text-gray-500">
                          {quote.products
                            .reduce(
                              (acc, product) =>
                                acc + product.price * product.quantity,
                              0
                            )
                            .toFixed(2)}{" "}
                          €
                        </div>
                      </td>
                      <td className="relative py-3.5 pr-4 text-right text-sm font-medium sm:pr-6">
                        <KebabMenu items={optionMenu(quote)} buttonSize="md" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <QuoteListSkeleton />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CreateNewQuoteModal open={openNewQuote} setOpen={setOpenNewQuote} />
    </PageLayout>
  );
};

export const QuoteListSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }, (_, index) => (
        <tr className="animate-pulse" key={`quote-item-${index}`}>
          <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
            <div>
              <Skeleton variant="rounded" width={"40"} height={12} />
            </div>
          </td>
          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
            <div className="font-medium text-gray-500">
              <Skeleton variant="rounded" width={"full"} height={8} />
            </div>
          </td>
          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
            <div className="font-medium text-gray-500">
              <Skeleton variant="rounded" width={"full"} height={8} />
            </div>
          </td>
          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
            <div className="font-medium text-gray-500">
              <Skeleton variant="rounded" width={"full"} height={8} />
            </div>
          </td>
          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
            <div className="font-medium text-gray-500">
              <Skeleton variant="rounded" width={"full"} height={8} />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};
