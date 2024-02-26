import { Transition } from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CheckIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  CardContainer,
  DangerModal,
  InfoModal,
  InvoiceBadge,
  Label,
  Tooltip,
} from 'components';
import { format } from 'date-fns';
import {
  DiscountType,
  InvoiceProduct,
  InvoiceStatus,
} from 'interface/Invoice/invoice.interface';
import { PageLayout } from 'layouts';
import EditCustomer from 'pages/Customers/EditCustomer';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerType } from 'redux/Customer/slices';
import {
  useDeleteInvoice,
  useDownloadInvoiceDocument,
  useFetchInvoice,
  useMarkAsFinal,
  useUpdateInvoiceStatus,
} from 'redux/Invoice/hooks';
import { getInvoice } from 'redux/Invoice/selectors';
import { PATHS } from 'routes';

export const InvoiceDetailsPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams();

  const [{ isLoading }, fetchInvoice] = useFetchInvoice();
  const [{ isLoading: isUpdatingStatus }, updateInvoiceStatus] =
    useUpdateInvoiceStatus();
  const invoice = useSelector((state: any) => getInvoice(state, id));
  const [{ isLoading: isDownloadingInvoice }, downloadInvoice] =
    useDownloadInvoiceDocument();
  const [{ isLoading: isMarkingAsFinal }, markAsFinal] = useMarkAsFinal();
  const [, deleteInvoice] = useDeleteInvoice();

  const [isOpenMarkAsFinalModal, setOpenMarkAsFinalModal] = useState(false);
  const [isOpenPaidModal, setOpenPaidModal] = useState(false);
  const [isOpenDeleteInvoice, setOpenDeleteInvoice] = useState(false);

  const [isOpenNewCustomer, setOpenNewCustomer] = useState(false);

  const getProductSubtotal = (product: InvoiceProduct) => {
    const discount =
      product.discountType === DiscountType.PERCENT
        ? product.price * (product.discount / 100)
        : product.discount;
    return product.price * product.quantity - discount;
  };

  const subtotal =
    invoice?.products.reduce(
      (acc, product) => acc + getProductSubtotal(product),
      0,
    ) || 0;

  const tax =
    invoice?.products.reduce(
      (acc, product) =>
        acc + getProductSubtotal(product) * (Number(product.vtaRate) / 100),
      0,
    ) || 0;

  const total = subtotal + tax;

  const hasAtLeastOneDiscount =
    !!invoice &&
    invoice.products.some((product) => Number(product.discount) !== 0);

  const handleGoToEdit = () => {
    if (!invoice) return;
    navigate(`${PATHS.INVOICE}/${invoice.id}/edit`);
  };

  const handleGoToPDF = () => {
    if (!invoice) return;
    navigate(`${PATHS.INVOICE}/${invoice.id}/pdf`);
  };

  const handleGoToSend = () => {
    if (!invoice) return;
    navigate(`${PATHS.INVOICE}/${invoice.id}/send`);
  };

  useEffect(() => {
    fetchInvoice(id);
  }, []);

  useEffect(() => {
    fetchInvoice(id);
  }, [isOpenNewCustomer]);

  return (
    <PageLayout>
      {invoice && (
        <div className="flex flex-col space-y-8 h-full">
          <Transition
            show={!isLoading && !!invoice && !isOpenNewCustomer}
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
                <div className="flex flex-col h-full overflow-y-scroll">
                  <table className="text-left text-sm leading-6">
                    <colgroup>
                      <col className="w-full" />
                      <col />
                      <col />
                      <col />
                      <col />
                      {hasAtLeastOneDiscount && <col />}
                    </colgroup>
                    <thead className="bg-gray-900 text-white whitespace-nowrap">
                      <tr>
                        <th scope="col" className="px-2 py-3 font-semibold">
                          Produits
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3 pl-8 pr-0 text-center font-semibold sm:table-cell"
                        >
                          Qté
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3 pl-8 pr-0 text-center font-semibold sm:table-cell"
                        >
                          Prix unitaire HT (€)
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3 pl-8 pr-0 text-center font-semibold sm:table-cell"
                        >
                          TVA (%)
                        </th>
                        {hasAtLeastOneDiscount && (
                          <th
                            scope="col"
                            className="hidden py-3 pl-8 pr-0 text-center font-semibold sm:table-cell"
                          >
                            Réduction
                          </th>
                        )}

                        <th
                          scope="col"
                          className="py-3 pl-8 pr-2 text-left font-semibold"
                        >
                          Total HT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.products.map((product: InvoiceProduct) => (
                        <tr
                          key={product.id}
                          className="border-b-2 border-gray-100"
                        >
                          <td className="max-w-0 px-2 py-5 align-top overflow-wrap">
                            <div className="font-medium font-semibold text-gray-900">
                              {product.title}
                            </div>
                            <div className="text-gray-900">
                              {product.description}
                            </div>
                          </td>
                          <td className="hidden py-5 pl-8 pr-0 text-center align-top tabular-nums text-gray-900 sm:table-cell">
                            {product.quantity}
                          </td>
                          <td className="hidden py-5 pl-8 pr-0 text-center align-top tabular-nums text-gray-900 sm:table-cell">
                            {product.price} €
                          </td>
                          <td className="hidden py-5 pl-8 pr-0 text-center align-top tabular-nums text-gray-900 sm:table-cell">
                            {product.vtaRate}%
                          </td>
                          {hasAtLeastOneDiscount && (
                            <td className="hidden py-5 pl-8 pr-0 text-center align-top tabular-nums text-gray-900 sm:table-cell">
                              {product.discount}{' '}
                              {product.discountType === DiscountType.PERCENT
                                ? '%'
                                : '€'}
                            </td>
                          )}
                          <td className="py-5 pl-8 pr-0 text-left align-top tabular-nums text-gray-700">
                            {getProductSubtotal(product).toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-auto bg-gray-50 p-4 flex">
                    <div className="ml-auto flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          {intl.formatMessage({
                            id: 'invoice-generate.total.label.subtotal',
                          })}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {subtotal.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex space-x-12">
                        <span className="font-semibold text-gray-900">
                          {intl.formatMessage({
                            id: 'invoice-generate.total.label.tax',
                          })}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {tax.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          {intl.formatMessage({
                            id: 'invoice-generate.total.label.total',
                          })}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {total.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContainer>
              <div className="sm:flex flex-col space-y-4 min-h-fit w-full sm:w-1/4 h-full">
                <div className="flex justify-between">
                  {!invoice.isFinal ? (
                    <>
                      <Tooltip text="Finaliser ma facture" position="bottom">
                        <button
                          className="bg-klaq-500 text-white rounded-full p-3 hover:bg-klaq-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                          disabled={isMarkingAsFinal}
                          onClick={() => setOpenMarkAsFinalModal(true)}
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      </Tooltip>
                      <Tooltip text="Editer" position="bottom">
                        <button
                          disabled={isUpdatingStatus}
                          className="bg-warning-500 text-white rounded-full p-3 hover:bg-wrning-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                          onClick={handleGoToEdit}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      {invoice.status !== InvoiceStatus.PAID && (
                        <Tooltip text="Facture encaissée" position="bottom">
                          <button
                            className="bg-klaq-500 text-white rounded-full p-3 hover:bg-klaq-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                            onClick={() => setOpenPaidModal(true)}
                          >
                            <BanknotesIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      )}

                      <Tooltip text="Envoyer par email" position="bottom">
                        <button
                          onClick={handleGoToSend}
                          className="bg-white text-gray-900 rounded-full p-3 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                        >
                          <EnvelopeIcon className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip text="Télécharger" position="bottom">
                    <button
                      onClick={() =>
                        downloadInvoice(invoice.id, invoice.number)
                      }
                      disabled={isDownloadingInvoice}
                      className="bg-white text-gray-900 rounded-full p-3 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  </Tooltip>
                  <Tooltip text="Voir" position="bottom">
                    <button
                      onClick={handleGoToPDF}
                      className="bg-white text-gray-900 rounded-full p-3 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:animated-pulse"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </Tooltip>

                  {invoice.status === InvoiceStatus.DRAFT ? (
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
                    <InvoiceBadge status={invoice.status} />
                  </div>
                  <div>
                    <Label htmlFor="issuedOn">Délivré le</Label>
                    <span className="text-sm text-gray-500">
                      {format(new Date(invoice.issuedOn), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div>
                    <Label htmlFor="object">
                      {intl.formatMessage({
                        id: 'invoice-generate.informations.object.label',
                      })}
                    </Label>
                    <span className="text-sm text-gray-500">
                      {invoice.object || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <Label htmlFor="orderFormId">
                      {intl.formatMessage({
                        id: 'invoice-generate.informations.order-form-id.label',
                      })}
                    </Label>
                    <span className="text-sm text-gray-500">
                      {invoice.orderFormId || 'N/A'}
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
                        {invoice.mainEvent.customer.type ===
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
                          {invoice.mainEvent.customer.name}
                        </h2>{' '}
                        <p className="text-sm text-gray-500">
                          {invoice.mainEvent.customer.email}
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
                      {format(new Date(invoice.validUntil), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div>
                    <Label htmlFor="Payment">
                      {intl.formatMessage({
                        id: 'invoice-generate.payment-condition.payment-method.label',
                      })}
                    </Label>
                    <span className="text-sm text-gray-500">
                      {intl.formatMessage({
                        id: `invoice-generate.payment-method.${invoice.paymentMethod.toLowerCase()}`,
                      })}
                    </span>
                  </div>
                </CardContainer>
              </div>
            </div>
          </Transition>
        </div>
      )}
      {invoice && (
        <EditCustomer
          setOpen={setOpenNewCustomer}
          isOpen={isOpenNewCustomer}
          customer={invoice?.mainEvent.customer}
        />
      )}
      {invoice && (
        <InfoModal
          isOpen={isOpenMarkAsFinalModal}
          setOpen={setOpenMarkAsFinalModal}
          title="Vous vous apprêtez à convertir ce projet en une facture officielle"
          message="Une fois cette opération effectuée, la facture recevra un numéro d'identification, pourra être transmise à votre client et ne sera plus modifiable. Veuillez noter que cette action est irréversible. Confirmez-vous cette démarche ?"
          button2={'Annuler'}
          button1={'Marqué comme finalisée'}
          onClick={() => {
            markAsFinal(invoice.id);
            setOpenMarkAsFinalModal(false);
          }}
        />
      )}
      {invoice && (
        <InfoModal
          isOpen={isOpenPaidModal}
          setOpen={setOpenPaidModal}
          title="Vous vous apprêtez à marquer cette facture comme payée"
          message="Confirmez-vous cette démarche ?"
          button2={'Annuler'}
          button1={'Marqué comme payée'}
          onClick={() => {
            updateInvoiceStatus(InvoiceStatus.PAID, invoice.id);
            setOpenPaidModal(false);
          }}
        />
      )}
      {invoice && (
        <DangerModal
          isOpen={isOpenDeleteInvoice}
          setOpen={setOpenDeleteInvoice}
          title="Voulez-vous vraiment supprimer cette facture ?"
          message="Confirmez-vous cette démarche ?"
          button2={'Annuler'}
          button1={'Supprimer'}
          onClick={() => {
            deleteInvoice(invoice.id);
            setOpenDeleteInvoice(false);
          }}
        />
      )}
    </PageLayout>
  );
};

export default InvoiceDetailsPage;
