import {
  EyeIcon as EyeIconSolid,
  EyeSlashIcon,
  HandThumbUpIcon,
} from '@heroicons/react/20/solid';
import {
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { Button, InvoiceBadge, KebabMenu, MailPopUp } from 'components';
import { differenceInDays, isPast } from 'date-fns';
import { Invoice, InvoiceStatus } from 'interface/Invoice/invoice.interface';
import { PageLayout } from 'layouts';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useDownloadInvoiceDocument,
  useFetchInvoices,
} from 'redux/Invoice/hooks';
import { getInvoices } from 'redux/Invoice/selectors';
import { getUser } from 'redux/Login/selectors';
import { PATHS } from 'routes';
import { getInvoiceSubtotal } from 'utils/invoice';
import { classNames } from 'utils/utils';
import { QuoteListSkeleton } from '../Quote';

export const InvoicesPage = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';

  const user = useSelector(getUser);

  const [isMailPopUpOpened, setMailPopupOpen] = useState<boolean>(false);
  const [invoiceToSend, setInvoiceToSend] = useState<Invoice | undefined>();
  const [shouldSendReminder, setShouldSendReminder] = useState<boolean>(false);

  const invoices = useSelector(getInvoices);
  const [{ isLoading }, fetchInvoices] = useFetchInvoices();
  const [, downloadInvoice] = useDownloadInvoiceDocument();

  const filteredInvoices =
    invoices && invoices.length > 0 && query === ''
      ? invoices
      : invoices.filter((invoices) => {
          return (
            invoices.mainEvent.customer.name
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            invoices.number.toLowerCase().includes(query.toLowerCase())
          );
        });

  const optionMenu = (invoice: Invoice) => [
    {
      name: 'quote.list.menu.view',
      icon: EyeIcon,
      onClick: () => handleView(invoice.id),
    },
    {
      name: 'quote.list.menu.edit',
      icon: PencilSquareIcon,
      onClick: () => handleEdit(invoice.id),
    },
    {
      name: 'quote.list.menu.send',
      icon: PaperAirplaneIcon,
      onClick: () => {
        setInvoiceToSend(invoice);
        setMailPopupOpen(true);
      },
    },
    {
      name: 'quote.list.menu.download',
      icon: ArrowDownTrayIcon,
      onClick: () => downloadInvoice(invoice.id, invoice.number),
    },
  ];

  const handleNewInvoice = () => {
    navigate(PATHS.INVOICE_GENERATE);
  };

  const handleView = (invoiceId: string) => {
    navigate(PATHS.INVOICE + '/' + invoiceId + '/details');
  };

  const handleEdit = (invoiceId: string) => {
    navigate(PATHS.INVOICE + '/' + invoiceId + '/edit');
  };

  const tabs = [
    {
      name: 'invoices.status.all',
      tab: 'all',
      current: params.get('tab') === 'all',
      invoices: filteredInvoices,
    },
    {
      name: 'invoices.status.late',
      tab: InvoiceStatus.LATE,
      current: params.get('tab') === InvoiceStatus.LATE,
      invoices: filteredInvoices.filter(
        (invoice) => invoice.status === InvoiceStatus.LATE,
      ),
    },
    {
      name: 'invoices.status.pending',
      tab: 'pending',
      current: params.get('tab') === 'pending',
      invoices: filteredInvoices.filter(
        (invoice) => invoice.status === InvoiceStatus.PENDING,
      ),
    },
    {
      name: 'invoices.status.draft',
      tab: InvoiceStatus.DRAFT,
      current: params.get('tab') === InvoiceStatus.DRAFT,
      invoices: filteredInvoices.filter(
        (invoice) => invoice.status === InvoiceStatus.DRAFT,
      ),
    },
    {
      name: 'invoices.status.paid',
      tab: InvoiceStatus.PAID,
      current: params.get('tab') === InvoiceStatus.PAID,
      invoices: filteredInvoices.filter(
        (invoice) => invoice.status === InvoiceStatus.PAID,
      ),
    },
    {
      name: 'invoices.status.canceled',
      tab: InvoiceStatus.CANCELED,
      current: params.get('tab') === InvoiceStatus.CANCELED,
      invoices: filteredInvoices.filter(
        (invoice) => invoice.status === InvoiceStatus.CANCELED,
      ),
    },
  ];

  const currentTab = tabs.find((tab) => tab.current) || tabs[0];

  useEffect(() => {
    fetchInvoices();
  }, []);
  return (
    <PageLayout>
      <div className="flex flex-col space-y-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {intl.formatMessage({
                id: 'invoices.header',
              })}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {intl.formatMessage(
                {
                  id: 'invoices.description',
                },
                {
                  nb: currentTab.invoices.length,
                },
              )}
            </p>
          </div>
          <div className="flex flex-1">
            <div className="ml-auto">
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleNewInvoice}
              >
                {intl.formatMessage({
                  id: 'invoices.button.new',
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
                      ? 'border-klaq-500 text-klaq-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium hover:cursor-pointer',
                  )}
                  onClick={() =>
                    setParams({
                      q: query,
                      tab: tab.tab,
                    })
                  }
                  aria-current={tab.current ? 'page' : undefined}
                >
                  <span>{intl.formatMessage({ id: tab.name })}</span>
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
                  id: 'invoices.search',
                })}
              />
            </div>
          </div>
        </div>
        <div className="-mx-4 mt-4 sm:mx-0 sm:rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  {intl.formatMessage({
                    id: 'invoices.table.customer',
                  })}
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  {intl.formatMessage({
                    id: 'invoices.table.issued-on',
                  })}
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  {intl.formatMessage({
                    id: 'invoices.table.valid-until',
                  })}
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  {intl.formatMessage({
                    id: 'invoices.table.status',
                  })}
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  {intl.formatMessage({
                    id: 'invoices.table.total',
                  })}
                </th>
                <th>
                  <span className="sr-only">Invoice Opened</span>
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
              {!isLoading ? (
                currentTab.invoices.length > 0 ? (
                  currentTab.invoices.map((invoice: Invoice) => (
                    <tr key={invoice.id}>
                      <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6 text-left">
                        <div className="font-semibold text-gray-900 hover:cursor-pointer hover:text-klaq-600">
                          <button
                            onClick={() =>
                              navigate(
                                PATHS.CUSTOMERS +
                                  '/' +
                                  invoice.mainEvent.customer.id,
                              )
                            }
                          >
                            {invoice.mainEvent.customer.name}
                          </button>
                        </div>
                        <div className="mt-2 font-medium text-gray-500">
                          {invoice.number}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                        <div className="font-medium text-gray-500">
                          {new Date(invoice.issuedOn).toLocaleDateString()}
                        </div>
                      </td>
                      <td
                        className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center"
                        onClick={() => {
                          if (
                            isPast(new Date(invoice.validUntil)) &&
                            invoice.status !== InvoiceStatus.PAID
                          ) {
                            setInvoiceToSend(invoice);
                            setMailPopupOpen(true);
                            setShouldSendReminder(true);
                          }
                        }}
                      >
                        <div
                          className={classNames(
                            isPast(new Date(invoice.validUntil)) &&
                              invoice.status !== InvoiceStatus.PAID
                              ? 'text-danger-500 font-semibold hover:cursor-pointer hover:text-danger-600'
                              : 'text-gray-500 font-medium',
                          )}
                        >
                          {isPast(new Date(invoice.validUntil)) &&
                          invoice.status !== InvoiceStatus.PAID ? (
                            <span className="flex items-center justify-center space-x-4">
                              <ExclamationTriangleIcon
                                className="h-6 w-6 text-danger-600"
                                aria-hidden="true"
                              />
                              <span>
                                {new Date(
                                  invoice.validUntil,
                                ).toLocaleDateString()}
                              </span>
                            </span>
                          ) : (
                            new Date(invoice.validUntil).toLocaleDateString()
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                        <div className="font-medium text-gray-500">
                          <InvoiceBadge status={invoice.status} />
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                        <div className="font-medium text-gray-500">
                          {getInvoiceSubtotal(invoice).toFixed(2)} €
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                        <div className="font-medium text-gray-500">
                          {invoice.isOpen ? (
                            <EyeIconSolid className="h-5 w-5 text-green-500" />
                          ) : (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="relative py-3.5 pr-4 text-right text-sm font-medium sm:pr-6">
                        <KebabMenu
                          items={optionMenu(invoice)}
                          buttonSize="md"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="px-6 py-14 text-center text-sm sm:px-14">
                        <HandThumbUpIcon
                          className="mx-auto h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                        <h3 className="mt-4 font-semibold text-gray-900">
                          {intl.formatMessage({
                            id: 'invoices.empty',
                          })}
                        </h3>
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                <QuoteListSkeleton />
              )}
            </tbody>
          </table>
        </div>
      </div>
      {invoiceToSend && (
        <MailPopUp
          type="INVOICE"
          documentId={invoiceToSend.id}
          isOpen={isMailPopUpOpened}
          setOpen={setMailPopupOpen}
          content={
            shouldSendReminder && true
              ? {
                  to: invoiceToSend.mainEvent.customer.email,
                  subject: intl.formatMessage({
                    id: `invoice-send.reminder.subject`,
                  }),
                  message: intl.formatMessage(
                    {
                      id: `invoice-send.reminder.message`,
                    },
                    {
                      stageName: user.stageName,
                      type: invoiceToSend?.mainEvent.title.toLowerCase(),
                      date: new Date(
                        invoiceToSend.mainEvent.subEvents[0].date,
                      ).toLocaleDateString(),
                      emissionDate: new Date(
                        invoiceToSend.issuedOn,
                      ).toLocaleDateString(),
                      invoiceNumber: invoiceToSend.number,
                      daysLate: differenceInDays(
                        new Date(),
                        new Date(invoiceToSend.validUntil),
                      ),
                    },
                  ),
                }
              : {
                  to: invoiceToSend.mainEvent.customer.email,
                  message: intl.formatMessage(
                    {
                      id: 'email.template.invoice.content',
                    },
                    {
                      stageName: user.stageName,
                      type: invoiceToSend.mainEvent.title.toLowerCase(),
                      date: invoiceToSend
                        ? new Date(
                            invoiceToSend.mainEvent.subEvents[0].date,
                          ).toLocaleDateString()
                        : '',
                    },
                  ),
                  subject: intl.formatMessage({
                    id: 'email.template.invoice.subject',
                  }),
                }
          }
        />
      )}
    </PageLayout>
  );
};
