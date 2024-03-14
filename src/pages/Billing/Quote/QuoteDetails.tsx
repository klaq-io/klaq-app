import { Transition } from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { CardContainer, Label, Tooltip } from 'components';
import { QuoteBadgeButton } from 'components/Quote/QuoteBadgeButton';
import { format } from 'date-fns';
import { QuoteStatus } from 'interface/Quote/quote.interface';
import { PageLayout } from 'layouts';
import EditCustomer from 'pages/Customers/EditCustomer';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerType } from 'redux/Customer/slices';
import { getUser } from 'redux/Login/selectors';
import { useDownloadQuoteDocument, useFetchQuotes } from 'redux/Quote/hooks';
import { getQuoteById } from 'redux/Quote/selectors';
import { PATHS } from 'routes';

export const QuoteDetailsPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  const [{ isLoading }, fetchQuotes] = useFetchQuotes();
  const quote = useSelector((state: any) => getQuoteById(state, id));
  const user = useSelector(getUser);
  const [{ isLoading: isDownloadingQuote }, downloadQuote] =
    useDownloadQuoteDocument();

  const [, setOpenDeleteInvoice] = useState(false);

  const [shouldOpenNewCustomer, setOpenNewCustomer] = useState(false);

  const handleGoToEdit = () => {
    if (!quote) return;
    navigate(`${PATHS.QUOTE}/${quote.id}/edit`);
  };

  const handleGoToPDF = () => {
    if (!quote) return;
    navigate(`${PATHS.QUOTE}/${quote.id}/pdf`);
  };

  const handleGoToSend = () => {
    if (!quote) return;
    navigate(`${PATHS.QUOTE}/${quote.id}/send`);
  };

  useEffect(() => {
    fetchQuotes();
  }, [shouldOpenNewCustomer]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <PageLayout>
      {quote && (
        <div className="flex flex-col space-y-8 h-full">
          <Transition
            show={!isLoading && !!quote && !shouldOpenNewCustomer}
            enter="transition ease duration-500 transform"
            enterFrom="opacity-0 translate-y-12"
            enterTo="opacity-100 translate-y-0"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="h-full"
          >
            <div className="sm:flex sm:space-x-4 h-full">
              <CardContainer className="flex flex-col space-y-8 px-4 py-5 sm:p-6 w-full h-full sm:w-3/4">
                <iframe
                  src={`${process.env.REACT_APP_API_URL}/quote/render/${quote.id}/${user.id}`}
                  className="w-full h-full overflow-y-scroll"
                />
              </CardContainer>
              <div className="sm:flex flex-col space-y-4 min-h-fit w-full sm:w-1/4 h-full">
                <div className="flex justify-between">
                  <Tooltip text="Editer" position="bottom">
                    <button
                      className="bg-warning-500 text-white rounded-full p-3 hover:bg-wrning-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                      onClick={handleGoToEdit}
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  </Tooltip>
                  <Tooltip text="Envoyer par email" position="bottom">
                    <button
                      onClick={handleGoToSend}
                      className="bg-white text-gray-900 rounded-full p-3 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                    >
                      <EnvelopeIcon className="h-5 w-5" />
                    </button>
                  </Tooltip>
                  {!!quote.documentId && (
                    <Tooltip text="Télécharger" position="bottom">
                      <button
                        onClick={() => downloadQuote(quote.id, quote.number)}
                        disabled={isDownloadingQuote}
                        className="bg-white text-gray-900 rounded-full p-3 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </Tooltip>
                  )}
                  {!!quote.documentId && (
                    <Tooltip text="Voir" position="bottom">
                      <button
                        onClick={handleGoToPDF}
                        className="bg-white text-gray-900 rounded-full p-3 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </Tooltip>
                  )}

                  {quote.status === QuoteStatus.DRAFT ? (
                    <>
                      <Tooltip text="Supprimer" position="bottom">
                        <button
                          onClick={() => setOpenDeleteInvoice(true)}
                          className="bg-danger-500 text-white rounded-full p-3 hover:bg-danger-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </>
                  ) : null}
                </div>

                <CardContainer className="flex flex-col space-y-4 px-4 py-5 sm:p-6">
                  <div className="flex justify-between">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                      {intl.formatMessage({
                        id: 'invoice.informations.title',
                      })}
                    </h1>
                  </div>
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <QuoteBadgeButton quote={quote} />
                  </div>
                  <div>
                    <Label htmlFor="issuedOn">Délivré le</Label>
                    <span className="text-sm text-gray-500">
                      {format(new Date(quote.issuedOn), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div>
                    <Label htmlFor="object">
                      {intl.formatMessage({
                        id: 'quote-generate.informations.object.label',
                      })}
                    </Label>
                    <span className="text-sm text-gray-500">
                      {quote.object || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <Label htmlFor="orderFormId">
                      {intl.formatMessage({
                        id: 'invoice-generate.informations.order-form-id.label',
                      })}
                    </Label>
                    <span className="text-sm text-gray-500">
                      {quote.orderFormId || 'N/A'}
                    </span>
                  </div>
                </CardContainer>
                <CardContainer className="px-4 py-5 sm:p-6">
                  <div className="flex flex-col justify-between space-y-4 overflow-hidden">
                    <div className="flex justify-between">
                      <h1 className="text-base font-semibold leading-6 text-gray-900">
                        {intl.formatMessage({
                          id: 'invoice.recipient.title',
                        })}
                      </h1>
                      <button onClick={() => setOpenNewCustomer(true)}>
                        <PencilSquareIcon
                          className="h-5 w-5 text-gray-500"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className="sm:flex sm:space-x-4 items-center">
                      <span className="border border-gray-200 rounded-md px-2.5 py-2.5 font-semibold text-gray-600 bg-gray-200">
                        {quote.mainEvent.customer.type ===
                        CustomerType.PRIVATE ? (
                          <UserIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <BuildingLibraryIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <div className="flex flex-col">
                        <h2 className="text-lg leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                          {quote.mainEvent.customer.name}
                        </h2>{' '}
                        <p className="text-sm text-gray-500">
                          {quote.mainEvent.customer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContainer>
                <CardContainer className="flex flex-col space-y-4 px-4 py-5 sm:p-6 h-full">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: 'invoice.payment-conditions.title',
                    })}
                  </h1>
                  <div>
                    <Label htmlFor="validUntil">
                      {intl.formatMessage({
                        id: 'invoice-generate.payment-condition.valid-until.label',
                      })}
                    </Label>
                    <span className="text-sm text-gray-500">
                      {format(new Date(quote.validUntil), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </CardContainer>
              </div>
            </div>
          </Transition>
        </div>
      )}
      {quote && (
        <EditCustomer
          setOpen={setOpenNewCustomer}
          isOpen={shouldOpenNewCustomer}
          customer={quote?.mainEvent.customer}
        />
      )}

      {/* {quote && (
        <DangerModal
          isOpen={openDeleteInvoice}
          setOpen={setOpenDeleteInvoice}
          title="Voulez-vous vraiment supprimer cette facture ?"
          message="Confirmez-vous cette démarche ?"
          button2={"Annuler"}
          button1={"Supprimer"}
          onClick={() => {
            deleteQuote(quote.id);
            setOpenDeleteInvoice(false);
          }}
        />
      )} */}
    </PageLayout>
  );
};
