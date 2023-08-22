import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, CommentaryFeed, EventSummaryCard } from "../../components";
import { InvoiceLayout, PageLayout } from "../../layouts";
import { useFetchEvent } from "../../redux/Events/hooks";
import { getEventById } from "../../redux/Events/selectors";
import { getCompany } from "../../redux/Company/selectors";
import { useFetchCompany } from "../../redux/Company/hooks";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import {
  getCorrespondingProduct,
  getEventSubtotal,
  getEventTax,
} from "../../utils/utils";
import { add, format } from "date-fns";

const MAX_DAYS_BEFORE_QUOTE_EXPIRED = 7;

export const QuoteDetails = () => {
  const intl = useIntl();
  const { id } = useParams();

  const [{ isLoading }, fetchEvent] = useFetchEvent();
  const event = useSelector((state: any) => getEventById(state, id!));

  const [, fetchCompany] = useFetchCompany();
  const company = useSelector(getCompany);

  const [, fetchProducts] = useFetchProductItems();
  const products = useSelector(getAllProducts);

  const subtotal = event && getEventSubtotal(event.products, products);
  const tax = event && getEventTax(event.products, products);

  const issuedOn = format(new Date(), "dd/MM/yyyy");
  const dueOn = format(
    add(new Date(), {
      days: MAX_DAYS_BEFORE_QUOTE_EXPIRED,
    }),
    "dd/MM/yyyy"
  );

  useEffect(() => {
    fetchEvent(id!);
    fetchCompany();
    fetchProducts();
  }, []);

  return (
    <PageLayout>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Button
            variant="text"
            color="secondary"
            type="button"
            leadingIcon={<ArrowLeftIcon className="-ml-0.5 h-5 w-5" />}
          >
            {intl.formatMessage({
              id: "edit-event.button.previous",
            })}
          </Button>
        </div>
        <div>
          <div className="flex flex-shrink-0 space-x-4">
            <Button variant="text" color="secondary" type="button">
              {intl.formatMessage({
                id: "Editer",
              })}
            </Button>
            <Button variant="text" color="secondary" type="button">
              {intl.formatMessage({
                id: "Voir",
              })}
            </Button>
            <Button variant="contained" color="primary" type="button" size="lg">
              {intl.formatMessage({
                id: "Envoyer",
              })}
            </Button>
          </div>
        </div>
      </div>
      {event && (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            {/* Quote */}
            <InvoiceLayout>
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                {intl.formatMessage({
                  id: "quote.header",
                })}
              </h2>
              <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <dt className="inline text-gray-500">
                    {intl.formatMessage({
                      id: "quote.issued-on",
                    })}
                  </dt>{" "}
                  <dd className="inline text-gray-700">
                    <time dateTime={issuedOn}>{issuedOn}</time>
                  </dd>
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <dt className="inline text-gray-500">
                    {intl.formatMessage({
                      id: "quote.due-on",
                    })}
                  </dt>{" "}
                  <dd className="inline text-gray-700">
                    <time dateTime={dueOn}>{dueOn}</time>
                  </dd>
                </div>
                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                  <dt className="font-semibold text-gray-900">
                    {intl.formatMessage({
                      id: "quote.from",
                    })}
                  </dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-gray-900">
                      {company.legalName}
                    </span>
                    <br />
                    {company.address}
                    <br />
                    {company.zip}, {company.city} - {company.country}
                  </dd>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                  <dt className="font-semibold text-gray-900">
                    {intl.formatMessage({
                      id: "quote.to",
                    })}
                  </dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-gray-900">
                      {event.customer.name}
                    </span>
                    <br />
                    {event.customer.address}
                    <br />
                    {event.customer.zipcode}, {event.customer.city} -{" "}
                    {event.customer.country}
                  </dd>
                </div>
              </dl>
              <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
                <colgroup>
                  <col className="w-full" />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead className="border-b border-gray-200 text-gray-900">
                  <tr>
                    <th scope="col" className="px-0 py-3 font-semibold">
                      {intl.formatMessage({
                        id: "quote.table.products",
                      })}
                    </th>
                    <th
                      scope="col"
                      className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
                    >
                      {intl.formatMessage({
                        id: "quote.table.quantity",
                      })}
                    </th>
                    <th
                      scope="col"
                      className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
                    >
                      {intl.formatMessage({
                        id: "quote.table.unit-price",
                      })}
                    </th>
                    <th
                      scope="col"
                      className="py-3 pl-8 pr-0 text-right font-semibold"
                    >
                      {intl.formatMessage({
                        id: "quote.table.total",
                      })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {event.products &&
                    event.products.length > 0 &&
                    event.products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100">
                        <td className="max-w-0 px-0 py-5 align-top">
                          <div className="truncate font-medium text-gray-900">
                            {getCorrespondingProduct(product, products)?.title}
                          </div>
                          <div className="truncate text-gray-500">
                            {
                              getCorrespondingProduct(product, products)
                                ?.description
                            }
                          </div>
                        </td>
                        <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                          {product.quantity}
                        </td>
                        <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                          {getCorrespondingProduct(product, products)?.price} €
                        </td>
                        <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
                          {product.quantity *
                            (getCorrespondingProduct(product, products)
                              ?.price || 0)}{" "}
                          €
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      scope="row"
                      className="px-0 pb-0 pt-6 font-normal text-gray-700 sm:hidden"
                    >
                      {intl.formatMessage({
                        id: "quote.table.subtotal",
                      })}
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden px-0 pb-0 pt-6 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      {intl.formatMessage({
                        id: "quote.table.subtotal",
                      })}
                    </th>
                    <td className="pb-0 pl-8 pr-0 pt-6 text-right tabular-nums text-gray-900">
                      {subtotal} €
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="pt-4 font-normal text-gray-700 sm:hidden"
                    >
                      {intl.formatMessage({
                        id: "quote.table.tax",
                      })}
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      {intl.formatMessage({
                        id: "quote.table.tax",
                      })}
                    </th>
                    <td className="pb-0 pl-8 pr-0 pt-4 text-right tabular-nums text-gray-900">
                      {tax} €
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="pt-4 font-semibold text-gray-900 sm:hidden"
                    >
                      {intl.formatMessage({
                        id: "quote.table.total-with-vat",
                      })}
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                    >
                      {intl.formatMessage({
                        id: "quote.table.total-with-vat",
                      })}
                    </th>
                    <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                      {subtotal &&
                        tax &&
                        (Number(subtotal) + Number(tax)).toFixed(2)}{" "}
                      €
                    </td>
                  </tr>
                </tfoot>
              </table>
            </InvoiceLayout>
            {/* Quote summary */}
            <div className="flex flex-col space-y-6">
              <EventSummaryCard event={event} />
              <CommentaryFeed isCommentingAllowed={true} />
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
