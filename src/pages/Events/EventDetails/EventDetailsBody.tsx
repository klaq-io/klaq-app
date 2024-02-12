import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  ChatBubbleLeftEllipsisIcon,
  ChevronUpDownIcon,
  DocumentCheckIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import {
  BillingDocumentList,
  Button,
  CardContainer,
  CommentaryFeed,
} from "components";
import { Alert } from "components/Alert/Alert";
import { useFormik } from "formik";
import { MainEvent } from "interface/Event/main-event.interface";
import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUpdateMainEvent } from "redux/MainEvent/hooks";
import { useFetchProductItems } from "redux/Products/hooks";
import { getAllProducts } from "redux/Products/selectors";
import { ProductItem } from "redux/Products/slices";
import { PATHS } from "routes";
import { classNames } from "utils/utils";
import { MainEventDetailsPageProps } from "./EventDetailsPage";
import { initialValues, validationSchema } from "./update-event-form";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

enum SECTION {
  TASKS = "tasks",
  PRODUCTS = "products",
  BILLING = "billing",
  NOTES = "notes",
  LOGS = "logs",
}

const Navigation = () => {
  const intl = useIntl();
  const [query, setQuery] = useSearchParams();
  const selectedSection = query.get("section") || SECTION.TASKS;

  const secondaryNavigation = [
    {
      section: SECTION.TASKS,
      icon: FlagIcon,
      current: selectedSection === SECTION.TASKS,
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
                  ? "border-klaq-500 text-klaq-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              <tab.icon
                className={classNames(
                  tab.current
                    ? "text-klaq-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "-ml-0.5 mr-2 h-5 w-5"
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
              id: "quote.header",
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
              id: "invoices.header",
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

const TasksSection = (event: MainEvent) => {
  const intl = useIntl();

  return (
    <CardContainer className="p-4 w-full flex flex-col space-y-4">
      tasks
    </CardContainer>
  );
};

const ProductsSection = (event: MainEvent) => {
  const intl = useIntl();

  const [{ isLoading: isUpdating }, updateEvent] = useUpdateMainEvent();
  const [, fetchProducts] = useFetchProductItems();
  const [productSearch, setProductSearch] = useState("");
  const [openAddProductModal, setOpenAddProductModal] = useState(false);

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
    productSearch === ""
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
    setProductSearch("");
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
      "products",
      eventProducts.filter((product) => product.productId !== null)
    );
  }, []);

  return (
    <>
      <Transition.Root
        show={openAddProductModal}
        as={Fragment}
        afterLeave={() => setProductSearch("")}
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
                              "cursor-default select-none rounded-md px-4 py-2 flex",
                              active && "bg-klaq-600 text-white"
                            )
                          }
                        >
                          <p className="font-bold">{productItem.title}</p>
                          <p className="ml-auto">{productItem.price}€</p>
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}

                  {productSearch !== "" && filteredProducts.length === 0 && (
                    <div className="px-4 py-14 text-center sm:px-14">
                      <ShoppingBagIcon
                        className="mx-auto h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-sm text-gray-900">
                        {intl.formatMessage({
                          id: "edit-event.my-products.no-products-found",
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
            id: "products.header",
          })}
        </h1>
        <Alert title="Pourquoi ajouter des produits ?" status="info">
          Ajouter un produit à un événement vous permet de savoir quels sont les
          prestations/services que vous comptez offrir à votre client. Cela vous
          permettra de générer des devis et des factures plus rapidement.
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
                id: "edit-event.my-products.product-get-started",
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
                      id: "products.my-products.title",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {intl.formatMessage({
                      id: "products.my-products.short-description",
                    })}
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {intl.formatMessage({
                      id: "edit-event.my-products.quantity",
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
                                (item) => item.id === product.productId
                              )?.title
                            }
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                          <div className="font-medium text-gray-500">
                            {
                              products.find(
                                (item) => item.id === product.productId
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
                  // <tr>
                  //   <td colSpan={4}>
                  //     <button
                  //       onClick={() => setOpenAddProductModal(true)}
                  //       type="button"
                  //       className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2"
                  //     >
                  //       <PlusIcon
                  //         className="mx-auto h-12 w-12 text-gray-400"
                  //         fill="none"
                  //         viewBox="0 0 24 24"
                  //         stroke="currentColor"
                  //         aria-hidden="true"
                  //       />

                  //       <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  //         {intl.formatMessage({
                  //           id: "edit-event.my-products.product-get-started",
                  //         })}
                  //       </h3>
                  //     </button>
                  //   </td>
                  // </tr>
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
              id: "edit-event.submit",
            })}
          </Button>
        </div>
      </CardContainer>
    </>
  );
};

export const EventDetailsBody = (props: MainEventDetailsPageProps) => {
  const { event } = props;
  const intl = useIntl();

  const [query] = useSearchParams();
  const selectedSection = query.get("section") || SECTION.TASKS;

  return (
    <>
      <Navigation />
      {selectedSection === SECTION.BILLING && <BillingSection {...event} />}

      {selectedSection === SECTION.LOGS && <LogsSection />}
      {selectedSection === SECTION.PRODUCTS && <ProductsSection {...event} />}
      {selectedSection === SECTION.TASKS && <TasksSection {...event} />}
    </>
  );
};
