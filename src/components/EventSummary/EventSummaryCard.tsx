import { FC, useEffect } from "react";
import { Event, EventProduct } from "../../redux/Events/slices";
import { EventBadge } from "../EventBadge";
import {
  UserCircleIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  LinkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { PATHS } from "../../routes";
import { Button } from "../Button";
import { Skeleton } from "../Skeleton";
import { useIntl } from "react-intl";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { useSelector } from "react-redux";
import { getAllProducts } from "../../redux/Products/selectors";
import { ProductItem } from "../../redux/Products/slices";
import { Quote, QuoteStatus } from "redux/Quote/slices";
import { getSubtotalForQuote } from "utils/quote";

type EventSummaryCardProps = {
  event: Event;
};

export const EventSummaryCard: FC<EventSummaryCardProps> = (
  props: EventSummaryCardProps
) => {
  const { event } = props;
  const intl = useIntl();

  const [{ isLoading: isFetchingProductLoading }, fetchProducts] =
    useFetchProductItems();
  const products = useSelector(getAllProducts);

  const getEventProductsValue = (eventProducts: EventProduct[] | undefined) => {
    if (!eventProducts) return 0;
    if (!products || !products.length) return 0;
    const totalEventProducts = eventProducts.map((product: EventProduct) => ({
      product: products.find(
        (productItems: ProductItem) => productItems.id === product.productId
      ),
      quantity: product.quantity,
    }));
    const total = totalEventProducts.reduce((acc, curr) => {
      if (curr?.product?.price && typeof curr.quantity === "number") {
        return acc + curr.product.price * curr.quantity;
      } else {
        return acc;
      }
    }, 0);
    return total.toFixed(2);
  };

  const getEventValue = (quotes_: Quote[] | undefined) => {
    if (!quotes_ || !quotes_.length) return "0.00";

    const acceptedQuotes = quotes_.filter(
      (quote) => quote.status === QuoteStatus.ACCEPTED
    );
    if (acceptedQuotes.length)
      return acceptedQuotes
        .map((quote) => getSubtotalForQuote(quote))
        .reduce((acc, curr) => acc + curr)
        .toFixed(2);

    const quotes = quotes_
      .filter((quote) => quote.status !== QuoteStatus.REJECTED)
      .map((quote) => getSubtotalForQuote(quote));
    return Math.min(...quotes).toFixed(2);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col justify-between bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <div className="lg:col-start-3 lg:row-end-1">
        <h2 className="sr-only">Summary</h2>
        <div className="">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6">
              <dt className="text-sm font-semibold leading-6 text-gray-900">
                {intl.formatMessage({
                  id: "event-details.summary.total",
                })}
              </dt>
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
                {isFetchingProductLoading ? (
                  <Skeleton variant="rounded" width={40} height={6} />
                ) : (
                  <>{getEventValue(event.quotes_)} €</>
                )}
              </dd>
            </div>
            <div className="flex-none self-end px-6 pt-4">
              <dt className="sr-only">Status</dt>
              <dd>
                <EventBadge status={event.status} />
              </dd>
            </div>
            <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
              <dt className="flex-none">
                <span className="sr-only">Client</span>
                <UserCircleIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm font-medium leading-6 text-gray-900">
                <a href={`${PATHS.CUSTOMERS}/${event.customer.id}`}>
                  {event.customer.name}
                </a>
              </dd>
            </div>
            <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <span className="sr-only">Due date</span>
                <CalendarDaysIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {format(new Date(event.date), "dd/MM/yyyy")}
              </dd>
            </div>
            <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <span className="sr-only">Status</span>
                <CreditCardIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {intl.formatMessage({
                  id: "event-details.summary.no-payments-receive",
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
        <div className="flex flex-col justify-center items-center">
          <Button
            variant="text"
            color="secondary"
            type="button"
            leadingIcon={<LinkIcon className="h-5 w-5" />}
            trailingIcon={<ArrowRightIcon className="h-5 w-5" />}
          >
            {intl.formatMessage({
              id: "event-details.button.attach-files",
            })}
          </Button>
        </div>
      </div>
    </div>
  );
};
