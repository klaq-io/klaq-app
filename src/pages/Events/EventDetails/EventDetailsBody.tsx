import { Combobox, Dialog, Transition } from '@headlessui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  ChatBubbleLeftEllipsisIcon,
  ChevronUpDownIcon,
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/solid';
import {
  AlertWithLink,
  BillingDocumentList,
  BookedDateAlert,
  Button,
  CardContainer,
  CommentaryFeed,
} from 'components';
import { Alert } from 'components/Alert/Alert';
import { isPast, isToday } from 'date-fns';
import { Status } from 'enum/status.enum';
import { useFormik } from 'formik';
import { MainEvent } from 'interface/Event/main-event.interface';
import { InvoiceStatus } from 'interface/Invoice/invoice.interface';
import { QuoteStatus } from 'interface/Quote/quote.interface';
import { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFetchMainEvents, useUpdateMainEvent } from 'redux/MainEvent/hooks';
import { useFetchProductItems } from 'redux/Products/hooks';
import { getAllProducts } from 'redux/Products/selectors';
import { ProductItem } from 'redux/Products/slices';
import { PATHS } from 'routes';
import { classNames, getTimeStr } from 'utils/utils';
import { MainEventDetailsPageProps } from './EventDetailsPage';
import { initialValues, validationSchema } from './update-event-form';
import { CustomerType } from 'redux/Customer/slices';
import EditCustomer from 'pages/Customers/EditCustomer';

enum SECTION {
  PRODUCTS = 'products',
  BILLING = 'billing',
  NOTES = 'notes',
  LOGS = 'logs',
  ASSISTANT = 'assistant',
  ACTIONS = 'actions',
}

const Navigation = () => {
  const intl = useIntl();
  const [query, setQuery] = useSearchParams();
  const selectedSection = query.get('section') || SECTION.ASSISTANT;

  const secondaryNavigation = [
    {
      section: SECTION.ASSISTANT,
      icon: MagnifyingGlassIcon,
      current: selectedSection === SECTION.ASSISTANT,
    },
    {
      section: SECTION.ACTIONS,
      icon: ChevronUpDownIcon,
      current: selectedSection === SECTION.ACTIONS,
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
                  ? 'border-klaq-500 text-klaq-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium',
              )}
              aria-current={tab.current ? 'page' : undefined}
            >
              <tab.icon
                className={classNames(
                  tab.current
                    ? 'text-klaq-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-0.5 mr-2 h-5 w-5',
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

const BillingSection = (event: MainEvent) => {
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
              id: 'quote.header',
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
              id: 'invoices.header',
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

const LogsSection = () => {
  return (
    <CardContainer className="p-4 w-full flex flex-col space-y-4">
      <CommentaryFeed />
    </CardContainer>
  );
};

const ProductsSection = (event: MainEvent) => {
  const intl = useIntl();

  const [{ isLoading: isUpdating }, updateEvent] = useUpdateMainEvent();
  const [, fetchProducts] = useFetchProductItems();
  const [productSearch, setProductSearch] = useState('');
  const [shouldOpenAddProductModal, setOpenAddProductModal] = useState(false);

  const products = useSelector(getAllProducts);

  const formik = useFormik({
    initialValues: { ...initialValues, ...event },
    validationSchema,
    onSubmit: async (values) => {
      await updateEvent(values);
    },
    enableReinitialize: true,
  });

  const eventProducts = formik.values.products;

  const filteredProducts =
    productSearch === ''
      ? []
      : products.filter((product) => {
          return product.title
            .toLowerCase()
            .includes(productSearch.toLowerCase());
        });

  const handleAddProduct = (product: ProductItem) => {
    formik.setValues({
      ...formik.values,
      products: [
        ...formik.values.products,
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    });
    setProductSearch('');
    setOpenAddProductModal(false);
  };

  const handleDeleteProduct = (index: number) => {
    formik.setValues({
      ...formik.values,
      products: formik.values.products.filter((product, idx) => idx !== index),
    });
  };

  useEffect(() => {
    fetchProducts();
    formik.setFieldValue(
      'products',
      eventProducts.filter((product) => product.productId !== ''),
    );
  }, []);

  return (
    <>
      <Transition.Root
        show={shouldOpenAddProductModal}
        as={Fragment}
        afterLeave={() => setProductSearch('')}
        appear
      >
        <Dialog
          as="div"
          className="relative z-10 "
          onClose={setOpenAddProductModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-xl transform rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Combobox>
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
                    placeholder="Rechercher un produit à ajouter..."
                    onChange={(event) => setProductSearch(event.target.value)}
                  />
                  {/** todo: handle key enter */}

                  {filteredProducts.length > 0 && (
                    <Combobox.Options
                      static
                      className="-mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                    >
                      {filteredProducts.map((productItem) => (
                        <Combobox.Option
                          key={productItem.id}
                          value={productItem.title}
                          onClick={() => handleAddProduct(productItem)}
                          className={({ active }) =>
                            classNames(
                              'cursor-default select-none rounded-md px-4 py-2 flex',
                              active && 'bg-klaq-600 text-white',
                            )
                          }
                        >
                          <p className="font-bold">{productItem.title}</p>
                          <p className="ml-auto">{productItem.price}€</p>
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}

                  {productSearch !== '' && filteredProducts.length === 0 && (
                    <div className="px-4 py-14 text-center sm:px-14">
                      <ShoppingBagIcon
                        className="mx-auto h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-sm text-gray-900">
                        {intl.formatMessage({
                          id: 'edit-event.my-products.no-products-found',
                        })}
                      </p>
                    </div>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <CardContainer className="p-4 w-full flex flex-col space-y-4 flex-grow">
        <h1 className="text-gray-900 font-semibold">
          {intl.formatMessage({
            id: 'products.header',
          })}
        </h1>
        <Alert title="Pourquoi ajouter des produits ?" status="info">
          {intl.formatMessage(
            {
              id: 'edit-event.my-products.infobox.content',
            },
            {
              budget: (event.budget ?? 0).toFixed(2),
              b: (chunk: any) => (
                <span className="text-blue-700 font-semibold">
                  {chunk.join()}
                </span>
              ),
            },
          )}
        </Alert>
        {eventProducts && eventProducts.length === 0 ? (
          <button
            onClick={() => setOpenAddProductModal(true)}
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
                id: 'edit-event.my-products.product-get-started',
              })}
            </h3>
          </button>
        ) : (
          <div className="-mx-4 mt-4 sm:mx-0 sm:rounded-lg bg-white shadow border">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    {intl.formatMessage({
                      id: 'products.my-products.title',
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {intl.formatMessage({
                      id: 'products.my-products.short-description',
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {intl.formatMessage({
                      id: 'edit-event.my-products.quantity',
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    <button
                      onClick={() => setOpenAddProductModal(true)}
                      className="ml-auto"
                    >
                      <PlusCircleIcon className="h-8 w-8 text-klaq-500 hover:text-klaq-600" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {eventProducts && eventProducts.length ? (
                  eventProducts.map((product, idx) => (
                    <>
                      <tr key={`product.${idx}`}>
                        <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-semibold text-gray-900">
                            {
                              products.find(
                                (item) => item.id === product.productId,
                              )?.title
                            }
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          <div className="font-medium text-gray-500">
                            {
                              products.find(
                                (item) => item.id === product.productId,
                              )?.description
                            }
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          <input
                            name={`products[${idx}].quantity`}
                            onChange={formik.handleChange}
                            value={
                              formik.values.products
                                ? formik.values.products[idx].quantity
                                : 0
                            }
                            min="1"
                            type="number"
                            className="w-2/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:text-sm sm:leading-6"
                          />
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          <button onClick={() => handleDeleteProduct(idx)}>
                            <TrashIcon className="h-6 w-6 text-danger-400" />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="ml-auto">
          <Button
            isLoading={isUpdating}
            onClick={() => formik.handleSubmit()}
            variant="contained"
            color="primary"
            type="submit"
          >
            {intl.formatMessage({
              id: 'edit-event.submit',
            })}
          </Button>
        </div>
      </CardContainer>
    </>
  );
};

const AssistantSection = (event: MainEvent) => {
  const intl = useIntl();
  const directions = event.directions;
  const distance = Math.floor((directions?.routes[0].distance || 0) / 1000 / 2);
  const duration = (directions?.routes[0].duration || 0) / 2;

  return (
    <CardContainer className="p-4 w-full flex flex-col space-y-4">
      <h1 className="text-gray-900 font-semibold">
        {intl.formatMessage(
          {
            id: 'event-details.assistant.header',
          },
          {
            b: (chunk: any) => (
              <span className="text-klaq-500 text-sm">{chunk.join()}</span>
            ),
          },
        )}
      </h1>
      <BookedDateAlert event={event} />
      <Alert
        title={intl.formatMessage({
          id: 'event-details.assistant.location.infobox.title',
        })}
        status="info"
      >
        <div className="flex flex-col">
          <p>
            {intl.formatMessage(
              {
                id: 'event-details.assistant.location.infobox.content',
              },
              {
                distance: distance,
                duration: getTimeStr(duration),
                b: (chunk: any) => (
                  <span className="text-blue-700 font-semibold">
                    {chunk.join()}
                  </span>
                ),
              },
            )}
          </p>
        </div>
      </Alert>
    </CardContainer>
  );
};

const ActionSection = (event: MainEvent) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const isEventPast = isPast(new Date(event.subEvents[0].date));
  const [shouldOpenEditCustomer, setOpenEditCustomer] = useState(false);
  const [, fetchEvents] = useFetchMainEvents();

  type Action = {
    content: string;
    link: {
      text: string;
      onClick?: () => void;
      active: boolean;
    };
    status: Status;
  };

  const ACTIONS: Action[] = [];

  if (event.customer.type === CustomerType.COMPANY) {
    ACTIONS.push(
      !event.customer.legalRegistrationNumber
        ? {
            content: `Remplir les informations de la société`,
            link: {
              text: 'Remplir',
              onClick: () => setOpenEditCustomer(true),
              active: true,
            },
            status: Status.WARNING,
          }
        : {
            content: `Informations de la société complétées`,
            link: {
              text: 'Voir',
              onClick: () => setOpenEditCustomer(false),
              active: false,
            },
            status: Status.SUCCESS,
          },
    );
  } else {
    ACTIONS.push(
      !event.customer.address
        ? {
            content: `Remplir les informations de facturation du client (adresse, téléphone, email, etc.)`,
            link: {
              text: 'Remplir',
              onClick: () => setOpenEditCustomer(true),
              active: true,
            },
            status: Status.WARNING,
          }
        : {
            content: `Informations du client complétées`,
            link: {
              text: 'Voir',
              onClick: () => setOpenEditCustomer(false),
              active: false,
            },
            status: Status.SUCCESS,
          },
    );
  }

  ACTIONS.push({
    content: "Ajouter des produits à l'événement",
    link: {
      text: 'Ajouter',
      onClick: () => setQuery({ section: SECTION.PRODUCTS }),
      active:
        (event.products && event.products.length) ||
        (event.quotes && event.quotes.length) ||
        isEventPast
          ? false
          : true,
    },
    status:
      (event.products && event.products.length) ||
      (event.quotes && event.quotes.length) ||
      isEventPast
        ? Status.SUCCESS
        : Status.WARNING,
  });

  ACTIONS.push({
    content: 'Créer un devis à partir de cet événement',
    link: {
      text: 'Générer',
      onClick: () =>
        navigate(`${PATHS.QUOTE_GENERATE}?fromEventId=${event.id}`),
      active:
        (event.products &&
          event.products.length &&
          event.quotes &&
          event.quotes.length > 0) ||
        isEventPast
          ? false
          : true,
    },
    status:
      (event.products &&
        event.products.length &&
        event.quotes &&
        event.quotes.length > 0) ||
      isEventPast
        ? Status.SUCCESS
        : Status.WARNING,
  });

  event.quotes &&
    event.quotes.map((quote) => {
      if (isEventPast) {
        return;
      }
      if (quote.status === QuoteStatus.DRAFT) {
        ACTIONS.push({
          content: `Devis ${quote.number} en attente de validation`,
          link: {
            text: 'Envoyer par mail',
            onClick: () => navigate(`${PATHS.QUOTE}/${quote.id}/send`),
            active: true,
          },
          status: Status.WARNING,
        });
      }
      if (quote.status === QuoteStatus.ACCEPTED) {
        ACTIONS.push({
          content: `Devis ${quote.number} accepté par le client`,
          link: {
            text: 'Voir le devis',
            onClick: () => navigate(`${PATHS.QUOTE}/${quote.id}/details`),
            active: true,
          },
          status: Status.SUCCESS,
        });
      }
      if (quote.status === QuoteStatus.REJECTED) {
        ACTIONS.push({
          content: `Devis ${quote.number} refusé par le client`,
          link: {
            text: 'Créer un nouveau devis',
            onClick: () =>
              navigate(`${PATHS.QUOTE_GENERATE}?fromEventId=${event.id}`),
            active: true,
          },
          status: Status.DANGER,
        });
      }
    });

  ACTIONS.push(
    !isEventPast || isToday(new Date(event.subEvents[0].date))
      ? {
          content: "L'événement n'a pas encore eu lieu",
          link: {
            text: 'Générer',
            active: false,
          },
          status: Status.PENDING,
        }
      : {
          content: "L'événement est terminé",
          link: {
            text: 'Générer',
            active: false,
          },
          status: Status.SUCCESS,
        },
  );

  event.quotes &&
    event.quotes.length > 0 &&
    event.quotes.map((quote) => {
      if (
        quote.status === QuoteStatus.ACCEPTED &&
        event.invoices &&
        event.invoices.length === 0
      ) {
        ACTIONS.push({
          content: `Créer une facture à partir du devis ${quote.number}`,
          link: {
            text: 'Générer',
            onClick: () =>
              navigate(`${PATHS.INVOICE_GENERATE}?fromQuote=${quote.id}`),
            active: true,
          },
          status: Status.WARNING,
        });
      }
    });

  event.invoices &&
    event.invoices.map((invoice) => {
      if (invoice.status === InvoiceStatus.DRAFT) {
        ACTIONS.push({
          content: `Facture ${invoice.number} en attente de validation`,
          link: {
            text: 'Finaliser ma facture',
            onClick: () => navigate(`${PATHS.INVOICE}/${invoice.id}/details`),
            active: true,
          },
          status: Status.WARNING,
        });
      }
      if (invoice.status === InvoiceStatus.PENDING) {
        ACTIONS.push({
          content: `Facture ${invoice.number} en attente de paiement`,
          link: {
            text: 'Voir la facture',
            onClick: () => navigate(`${PATHS.INVOICE}/${invoice.id}/details`),
            active: true,
          },
          status: Status.WARNING,
        });
      }
      if (invoice.status === InvoiceStatus.LATE) {
        ACTIONS.push({
          content: `Facture ${invoice.number} en retard`,
          link: {
            text: 'Envoyer un mail de relance',
            onClick: () =>
              navigate(`${PATHS.INVOICE}/${invoice.id}/send?type=reminder`),
            active: true,
          },
          status: Status.DANGER,
        });
      }
      if (invoice.status === InvoiceStatus.PAID) {
        ACTIONS.push({
          content: `Facture ${invoice.number} payée`,
          link: {
            text: 'Voir la facture',
            onClick: () => navigate(`${PATHS.INVOICE}/${invoice.id}/details`),
            active: true,
          },
          status: Status.SUCCESS,
        });
      }
    });

  const [, setQuery] = useSearchParams();

  useEffect(() => {
    fetchEvents();
  }, [shouldOpenEditCustomer]);

  return (
    <>
      <CardContainer className="p-4 w-full flex flex-col space-y-4">
        <h1 className="text-gray-900 font-semibold">
          {intl.formatMessage({
            id: 'event-details.actions.header',
          })}
        </h1>
        {ACTIONS.map((action) => (
          <AlertWithLink key={action.content} {...action} />
        ))}
      </CardContainer>
      <EditCustomer
        customer={event.customer}
        isOpen={shouldOpenEditCustomer}
        setOpen={setOpenEditCustomer}
      />
    </>
  );
};

export const EventDetailsBody = (props: MainEventDetailsPageProps) => {
  const { event } = props;

  const [query] = useSearchParams();
  const selectedSection = query.get('section') || SECTION.ASSISTANT;

  return (
    <>
      <Navigation />
      {selectedSection === SECTION.BILLING && <BillingSection {...event} />}

      {selectedSection === SECTION.LOGS && <LogsSection />}
      {selectedSection === SECTION.PRODUCTS && <ProductsSection {...event} />}
      {selectedSection === SECTION.ACTIONS && <ActionSection {...event} />}
      {selectedSection === SECTION.ASSISTANT && <AssistantSection {...event} />}
    </>
  );
};
