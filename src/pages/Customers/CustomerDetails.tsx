import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ClipboardDocumentIcon,
  DocumentCheckIcon,
  EnvelopeIcon,
  FolderIcon,
  HomeIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import {
  BillingDocumentList,
  Button,
  DangerModal,
  KebabMenu,
  NewEventModal,
} from 'components';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { EventStatus } from 'redux/Events/slices';
import { useFetchInvoicesForCustomer } from 'redux/Invoice/hooks';
import { useUpdateArchivedStatus as useUpdateArchivedMainEventStatus } from 'redux/MainEvent/hooks';
import { useFetchQuotesForCustomer } from 'redux/Quote/hooks';
import { formatPhoneNumber, getCustomerValue } from 'utils/customer';
import { PageLayout } from '../../layouts';
import {
  useFetchCustomers,
  useUpdateArchivedStatus,
} from '../../redux/Customer/hooks';
import { getCustomer } from '../../redux/Customer/selectors';
import { Customer, CustomerType } from '../../redux/Customer/slices';
import { formatSiret } from '../../utils/utils';
import EditCustomer from './EditCustomer';

const DocumentType = {
  INVOICE: 'invoice',
  QUOTE: 'quote',
  EVENT: 'event',
};

export const CustomerDetails = () => {
  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();

  const [shouldOpenNewEvent, setOpenNewEvent] = useState(false);
  const [shouldOpenDelete, setOpenDelete] = useState(false);
  const [shouldOpenDeleteMainEvent, setOpenDeleteMainEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [, updateArchivedMainEventStatus] = useUpdateArchivedMainEventStatus();
  const [, updateArchiveCustomerStatus] = useUpdateArchivedStatus();

  const [selectedDocumentType, setSelectedDucomentType] = useState(
    DocumentType.EVENT,
  );
  const [shouldOpenEditCustomerPanel, setOpenEditCustomerPanel] =
    useState(false);

  const [{ isLoading }, fetchCustomers] = useFetchCustomers();
  const customer = useSelector((state: any) => getCustomer(state, id));

  const [{ data: quotes }, fetchCustomerQuotes] = useFetchQuotesForCustomer();
  const [{ data: invoices }, fetchCustomerInvoice] =
    useFetchInvoicesForCustomer();

  const handlePrevious = () => {
    navigate(-1);
  };

  const formatAddress = (
    address?: string,
    zip?: string,
    city?: string,
    country?: string,
  ) => {
    if (!address || !zip || !city || !country)
      return intl.formatMessage({
        id: 'customers.customer-details.no-address',
      });
    return intl.formatMessage(
      {
        id: 'customers.customer-details.address',
      },
      {
        address,
        zip,
        city,
        country,
      },
    );
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setOpenDeleteMainEvent(false);
    updateArchivedMainEventStatus(selectedEvent, true);
  };

  const handleArchiveCustomer = (customer?: Customer) => {
    if (!customer) return;
    setOpenDelete(false);
    updateArchiveCustomerStatus(customer.id, true);
    fetchCustomers();
  };

  const menuItems = [
    {
      name: 'customers.customer-details.button.edit',
      onClick: () => setOpenEditCustomerPanel(true),
      icon: PencilSquareIcon,
    },
    {
      name: 'customers.customer-details.button.send-mail',
      onClick: () => {
        window.location.href = `mailto:${customer?.email}`;
      },
      icon: EnvelopeIcon,
    },
    {
      name: 'customers.customer-details.button.call',
      onClick: () => {
        window.location.href = `tel:${customer?.phone}`;
      },
      icon: PhoneIcon,
    },
    {
      name: 'customers.customer-details.button.delete',
      onClick: () => {
        setOpenDelete(true);
      },
      icon: TrashIcon,
    },
  ];

  const kebabMenuItems = (eventId: string) => [
    {
      name: 'customers.customer-details.button.go',
      onClick: () => navigate(`/events/${eventId}/details`),
      icon: ArrowRightIcon,
    },
    {
      name: 'customers.customer-details.button.delete',
      onClick: () => {
        setSelectedEvent(eventId);
        setOpenDeleteMainEvent(true);
      },
      icon: TrashIcon,
    },
  ];

  useEffect(() => {
    fetchCustomers();
    fetchCustomerQuotes(id);
    fetchCustomerInvoice(id);
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      <div className="flex flex-col space-y-4">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <Button
              type="button"
              variant="text"
              color="secondary"
              leadingIcon={
                <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              }
              onClick={handlePrevious}
            >
              {intl.formatMessage({
                id: 'customers.customer-details.button.previous',
              })}
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row overflow-hidden px-6 py-4 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="flex flex-col space-y-4">
              <span className="border border-gray-200 rounded-md px-2.5 py-2.5 font-semibold text-gray-600 bg-gray-200">
                {customer?.type === CustomerType.PRIVATE ? (
                  <UserIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <BuildingLibraryIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
            </div>
            <div className="flex flex-col space-y-2 ml-10">
              <h2 className="text-2xl leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                {customer?.name}
              </h2>
              {customer && customer.type === CustomerType.COMPANY ? (
                <>
                  <p className="text-sm text-gray-500">
                    {intl.formatMessage(
                      {
                        id: 'customers.customer-details.siret',
                      },
                      {
                        siret: formatSiret(customer.legalRegistrationNumber),
                      },
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {intl.formatMessage(
                      {
                        id: customer.legalVATNumber
                          ? 'customers.customer-details.vat-number'
                          : 'customers.customer-details.no-vat-number',
                      },
                      {
                        vatNumber: customer.legalVATNumber,
                      },
                    )}
                  </p>
                </>
              ) : null}
              {customer?.createdAt ? (
                <div className="flex flex-row space-x-2 items-center">
                  <UserPlusIcon className="h-5 w-5 inline-block mr-2" />
                  <p className="text-sm text-gray-900">
                    {intl.formatMessage(
                      {
                        id: 'customers.customer-details.first-interact',
                      },
                      {
                        date: new Date(
                          customer?.createdAt,
                        ).toLocaleDateString(),
                      },
                    )}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-row space-x-2 items-center">
                <CalendarDaysIcon className="h-5 w-5 inline-block mr-2" />
                <p className="text-sm text-gray-900">
                  {intl.formatMessage(
                    {
                      id: 'customers.customer-details.deals-count',
                    },
                    {
                      count: customer?.mainEvents?.length || 0,
                    },
                  )}
                </p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <DocumentCheckIcon className="h-5 w-5 inline-block mr-2" />
                <p className="text-sm text-gray-900">
                  {intl.formatMessage(
                    {
                      id: 'customers.customer-details.deals-signed',
                    },
                    {
                      count:
                        customer?.mainEvents?.filter(
                          (event) => event.status === EventStatus.WIN,
                        ).length || 0,
                    },
                  )}
                </p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <BanknotesIcon className="h-5 w-5 inline-block mr-2" />
                <p className="text-sm text-gray-900">
                  {intl.formatMessage(
                    {
                      id: 'customers.customer-details.deals-amount',
                    },
                    {
                      amount: getCustomerValue(invoices),
                    },
                  )}
                </p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <PhoneIcon className="h-5 w-5 inline-block mr-2" />
                <a
                  href={`tel:${customer?.phone}`}
                  className="text-sm text-gray-900"
                >
                  {formatPhoneNumber(customer?.phone) || 'N/A'}
                </a>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <EnvelopeIcon className="h-5 w-5 inline-block mr-2" />
                <a
                  href={`mailto:${customer?.email}`}
                  className="text-sm text-gray-900"
                >
                  {customer?.email}
                </a>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <HomeIcon className="h-5 w-5 inline-block mr-2" />
                <p className="text-sm text-gray-900">
                  {formatAddress(
                    customer?.address,
                    customer?.zipcode,
                    customer?.city,
                    customer?.country,
                  )}
                </p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <UserIcon className="h-5 w-5 inline-block mr-2" />
                <p className="text-sm text-gray-900">
                  {customer?.firstName} {customer?.lastName}
                </p>
              </div>
            </div>
            <div className="flex flex-col ml-auto">
              <KebabMenu buttonSize="lg" items={menuItems} />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row w-full">
            <div>
              <Button
                variant={
                  DocumentType.EVENT === selectedDocumentType
                    ? 'outlined'
                    : 'contained'
                }
                color="secondary"
                type="button"
                onClick={() => setSelectedDucomentType(DocumentType.EVENT)}
                leadingIcon={
                  <FolderIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                }
              >
                {intl.formatMessage({
                  id: 'customers.customer-details.button.events',
                })}
              </Button>
            </div>
            <div className="ml-2">
              <Button
                variant={
                  DocumentType.QUOTE === selectedDocumentType
                    ? 'outlined'
                    : 'contained'
                }
                color="secondary"
                type="button"
                onClick={() => setSelectedDucomentType(DocumentType.QUOTE)}
                leadingIcon={
                  <ClipboardDocumentIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                }
              >
                {intl.formatMessage({
                  id: 'customers.customer-details.button.quotes',
                })}
              </Button>
            </div>
            <div className="ml-2">
              <Button
                variant={
                  DocumentType.INVOICE === selectedDocumentType
                    ? 'outlined'
                    : 'contained'
                }
                color="secondary"
                type="button"
                onClick={() => setSelectedDucomentType(DocumentType.INVOICE)}
                leadingIcon={
                  <DocumentCheckIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                }
              >
                {intl.formatMessage({
                  id: 'customers.customer-details.button.invoices',
                })}
              </Button>
            </div>

            <div className="ml-auto">
              <Button
                onClick={() => setOpenNewEvent(true)}
                variant="contained"
                color="primary"
                type="button"
              >
                {intl.formatMessage({
                  id: 'customers.customer-details.button.new-event',
                })}
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            {DocumentType.INVOICE === selectedDocumentType && (
              <BillingDocumentList type="invoice" documents={invoices} />
            )}
            {DocumentType.QUOTE === selectedDocumentType && (
              <BillingDocumentList type="quote" documents={quotes} />
            )}
            {DocumentType.EVENT === selectedDocumentType &&
            customer?.mainEvents &&
            customer?.mainEvents.length > 0 ? (
              <ul
                role="list"
                className="bg-white mt-2 divide-y divide-gray-100 rounded-md border border-gray-200 w-full"
              >
                {customer.mainEvents.map((event, idx: number) => (
                  <li
                    key={`${event.title}-${idx}`}
                    className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <PaperAirplaneIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          {event.title}
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          {event.subEvents[0]
                            ? new Date(
                                event.subEvents[0].date,
                              ).toLocaleDateString()
                            : null}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <KebabMenu items={kebabMenuItems(event.id)} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : DocumentType.EVENT === selectedDocumentType ? (
              <div>
                <button
                  onClick={() => setOpenNewEvent(true)}
                  type="button"
                  className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2"
                >
                  <PlusIcon
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  />

                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    {intl.formatMessage({
                      id: 'events.no-events',
                    })}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {intl.formatMessage({
                      id: 'events.get-started',
                    })}
                  </p>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <EditCustomer
        isOpen={shouldOpenEditCustomerPanel}
        setOpen={setOpenEditCustomerPanel}
        customer={customer}
      />
      <NewEventModal
        isOpen={shouldOpenNewEvent}
        setOpen={setOpenNewEvent}
        suggestedCustomer={customer}
      />
      <DangerModal
        isOpen={shouldOpenDelete}
        setOpen={setOpenDelete}
        onClick={() => handleArchiveCustomer(customer)}
        title={intl.formatMessage({
          id: 'customers.archive-customer.modal.title',
        })}
        message={intl.formatMessage(
          {
            id: 'customers.archive-customer.modal.message',
          },
          { customerName: customer?.name },
        )}
        button1={intl.formatMessage({
          id: 'customers.archive-customer.modal.button.delete',
        })}
        button2={intl.formatMessage({
          id: 'customers.archive-customer.modal.button.cancel',
        })}
      />
      <DangerModal
        isOpen={shouldOpenDeleteMainEvent}
        setOpen={setOpenDeleteMainEvent}
        onClick={() => handleDeleteEvent()}
        title={intl.formatMessage({ id: 'event-details.delete-modal.title' })}
        message={intl.formatMessage({
          id: 'event-details.delete-modal.message',
        })}
        button1={intl.formatMessage({
          id: 'event-details.delete-modal.button.delete',
        })}
        button2={intl.formatMessage({
          id: 'event-details.delete-modal.button.cancel',
        })}
      />
    </PageLayout>
  );
};

export default CustomerDetails;
