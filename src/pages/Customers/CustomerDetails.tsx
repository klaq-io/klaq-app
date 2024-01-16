import {
  ArrowLeftIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  EnvelopeIcon,
  HomeIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  BillingDocumentList,
  Button,
  KebabMenu,
  NewEventModal,
} from "components";
import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PageLayout } from "../../layouts";
import { useFetchCustomers } from "../../redux/Customer/hooks";
import { getCustomer } from "../../redux/Customer/selectors";
import { CustomerType } from "../../redux/Customer/slices";
import { formatSiret, getPipeValueForCustomer } from "../../utils/utils";
import EditCustomer from "./EditCustomer";
import { useFetchQuotesForCustomer } from "redux/Quote/hooks";
import { useFetchInvoicesForCustomer } from "redux/Invoice/hooks";

type Props = {};

const DocumentType = {
  INVOICE: "invoice",
  QUOTE: "quote",
};

export const CustomerDetails: FC<Props> = (props: Props) => {
  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();

  const [openNewEvent, setOpenNewEvent] = useState(false);

  const [selectedDocumentType, setSelectedDucomentType] = useState(
    DocumentType.INVOICE
  );
  const [openEditCustomerPanel, setOpenEditCustomerPanel] = useState(false);

  const [{ isLoading, isSuccess }, fetchCustomers] = useFetchCustomers();
  const customer = useSelector((state: any) => getCustomer(state, id!));

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
    country?: string
  ) => {
    if (!address || !zip || !city || !country)
      return intl.formatMessage({
        id: "customers.customer-details.no-address",
      });
    return intl.formatMessage(
      {
        id: "customers.customer-details.address",
      },
      {
        address,
        zip,
        city,
        country,
      }
    );
  };

  const menuItems = [
    {
      name: "customers.customer-details.button.edit",
      onClick: () => setOpenEditCustomerPanel(true),
      icon: PencilSquareIcon,
    },
    {
      name: "customers.customer-details.button.send-mail",
      onClick: () => {
        window.location.href = `mailto:${customer?.email}`;
      },
      icon: EnvelopeIcon,
    },
  ];

  useEffect(() => {
    fetchCustomers();
    fetchCustomerQuotes(id!);
    fetchCustomerInvoice(id!);
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      <div className="flex flex-col space-y-8">
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
                id: "customers.customer-details.button.previous",
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
                        id: "customers.customer-details.siret",
                      },
                      {
                        siret: formatSiret(customer.legalRegistrationNumber),
                      }
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {intl.formatMessage(
                      {
                        id: customer.legalVATNumber
                          ? "customers.customer-details.vat-number"
                          : "customers.customer-details.no-vat-number",
                      },
                      {
                        vatNumber: customer.legalVATNumber,
                      }
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
                        id: "customers.customer-details.first-interact",
                      },
                      {
                        date: new Date(
                          customer?.createdAt
                        ).toLocaleDateString(),
                      }
                    )}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-row space-x-2 items-center">
                <CalendarDaysIcon className="h-5 w-5 inline-block mr-2" />
                <p className="text-sm text-gray-900">
                  {intl.formatMessage(
                    {
                      id: "customers.customer-details.deals-count",
                    },
                    {
                      count: customer?.mainEvents?.length || 0,
                    }
                  )}
                </p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <BanknotesIcon className="h-5 w-5 inline-block mr-2" />
                <p className="text-sm text-gray-900">
                  {intl.formatMessage(
                    {
                      id: "customers.customer-details.deals-amount",
                    },
                    {
                      amount: getPipeValueForCustomer(customer),
                    }
                  )}
                </p>
              </div>
              <div className="flex flex-row space-x-2 items-center">
                <HomeIcon className="h-5 w-5 inline-block mr-2" />
                <p className="text-sm text-gray-900">
                  {formatAddress(
                    customer?.address,
                    customer?.zipcode,
                    customer?.city,
                    customer?.country
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
                  DocumentType.INVOICE === selectedDocumentType
                    ? "outlined"
                    : "contained"
                }
                color="secondary"
                type="button"
                onClick={() => setSelectedDucomentType(DocumentType.INVOICE)}
                leadingIcon={
                  <ClipboardDocumentCheckIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                }
              >
                {intl.formatMessage({
                  id: "customers.customer-details.button.invoices",
                })}
              </Button>
            </div>
            <div className="ml-2">
              <Button
                variant={
                  DocumentType.QUOTE === selectedDocumentType
                    ? "outlined"
                    : "contained"
                }
                color="secondary"
                type="button"
                onClick={() => setSelectedDucomentType(DocumentType.QUOTE)}
                leadingIcon={
                  <PaperAirplaneIcon
                    className="-ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                }
              >
                {intl.formatMessage({
                  id: "customers.customer-details.button.quotes",
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
                  id: "customers.customer-details.button.new-event",
                })}
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            {DocumentType.INVOICE === selectedDocumentType ? (
              <BillingDocumentList type="invoice" documents={invoices} />
            ) : (
              <BillingDocumentList type="quote" documents={quotes} />
            )}
          </div>
        </div>
      </div>
      <EditCustomer
        open={openEditCustomerPanel}
        setOpen={setOpenEditCustomerPanel}
        customer={customer}
      />
      <NewEventModal
        open={openNewEvent}
        setOpen={setOpenNewEvent}
        suggestedCustomer={customer}
      />
    </PageLayout>
  );
};

export default CustomerDetails;
