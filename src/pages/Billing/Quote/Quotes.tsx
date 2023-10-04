import {
  ArrowDownTrayIcon,
  EyeIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  CreateNewQuoteModal,
  KebabMenu,
  QuoteBadge,
  Skeleton,
} from "components";
import { PageLayout } from "layouts";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFetchQuotes } from "redux/Quote/hooks";
import { getQuotes } from "redux/Quote/selectors";
import { Quote } from "redux/Quote/slices";
import { PATHS } from "routes";

export const Quotes = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [openNewQuote, setOpenNewQuote] = useState(false);
  const [params, setParams] = useSearchParams();

  const [, fetchQuotes] = useFetchQuotes();
  const quotes = useSelector(getQuotes) || [];

  const handleSendByMail = (id: string) => {
    navigate(PATHS.QUOTE + "/send/" + id);
  };

  const optionMenu = (quote: Quote) => [
    {
      name: "quote.list.menu.view",
      icon: EyeIcon,
      onClick: () => {},
    },
    {
      name: "quote.list.menu.edit",
      icon: PencilSquareIcon,
      onClick: () => {},
    },
    {
      name: "quote.list.menu.send",
      icon: PaperAirplaneIcon,
      onClick: () => handleSendByMail(quote.id),
    },
    {
      name: "quote.list.menu.download",
      icon: ArrowDownTrayIcon,
      onClick: () => {},
    },
    {
      name: "quote.list.menu.delete",
      icon: TrashIcon,
      onClick: () => {},
    },
  ];

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <PageLayout>
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
              onClick={() => setOpenNewQuote(true)}
            >
              {intl.formatMessage({
                id: "quote.button.generate",
              })}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <div className="-mx-4 mt-4 sm:mx-0 sm:rounded-lg bg-white">
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
              {quotes && quotes.length > 0 ? (
                quotes.map((quote: Quote) => (
                  <tr key={quote.id}>
                    <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6 text-left">
                      <div className="font-semibold text-gray-900 hover:cursor-pointer hover:text-klaq-600">
                        {quote.event.customer.name}
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
                        <QuoteBadge status={quote.status} />
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
