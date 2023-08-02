import {
  BarsArrowUpIcon,
  ChevronDownIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import {
  CustomerStatus,
  DangerModal,
  DropdownMenu,
  KebabMenu,
} from "../../components";
import { Button } from "../../components";
import { PageLayout } from "../../layouts";
import {
  useDeleteCustomer,
  useFetchCustomers,
} from "../../redux/Customer/hooks";
import { getCustomers } from "../../redux/Customer/selectors";
import { Customer } from "../../redux/Customer/slices";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getAllEvents } from "../../redux/Events/selectors";
import { EventStatus } from "../../redux/Events/slices";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { PATHS } from "../../routes";
import { getCustomerValue } from "../../utils/utils";
import EditCustomer from "./EditCustomer";
import { NewCustomer } from "./NewCustomer";

export const Customers = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [openNewCustomerPanel, setOpenNewCustomerPanel] = useState(false);
  const [openEditCustomerPanel, setOpenEditCustomerPanel] = useState(false);
  const [openDeleteCustomerModal, setOpenDeleteCustomerModal] = useState(false);

  const [, deleteCustomer] = useDeleteCustomer();

  const [{ isLoading }, fetchCustomers] = useFetchCustomers();
  const customers = useSelector(getCustomers);

  const [{ isLoading: isFetchEventsLoading }, fetchEvents] = useFetchEvents();
  const events = useSelector(getAllEvents);

  const [{ isLoading: isFetchProductsLoading }, fetchProducts] =
    useFetchProductItems();
  const products = useSelector(getAllProducts);

  const filteredCustomers =
    query === ""
      ? customers
      : customers.filter(
          (customer) =>
            customer.name?.toLowerCase().includes(query.toLowerCase()) ||
            customer.firstName.toLowerCase().includes(query.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query)
        );

  const getCustomerStatus = (customer: Customer) => {
    // TODO: change it to a better logic
    if (!customer.events || customer.events.length === 0) return "new";
    const eventsStatus = customer.events.flatMap((event) => event.status);
    if (!customer.events.length) return "new";
    if (eventsStatus.includes(EventStatus.INBOX)) return "in-deal";

    if (eventsStatus.filter((status) => status === EventStatus.WIN).length >= 2)
      return "recurring";
    if (eventsStatus.includes(EventStatus.LOST)) return "lost";
    return "none";
  };

  const handleOpenDeleteCustomerModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteCustomerModal(true);
  };

  const handleDeleteCustomer = (customer?: Customer) => {
    if (!customer) return;
    setOpenDeleteCustomerModal(false);
    deleteCustomer(customer.id);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenEditCustomerPanel(true);
  };

  const handleCustomerDetails = (id: string) => {
    const path = generatePath(PATHS.CUSTOMER_DETAILS, { id });
    navigate(path);
  };

  const optionsMenuItems = (customer: Customer) => [
    {
      name: "customers.my-customers.button.edit",
      icon: PencilSquareIcon,
      onClick: () => handleEditCustomer(customer),
    },
    {
      name: "customers.my-customers.button.look",
      icon: EyeIcon,
      onClick: () => handleCustomerDetails(customer.id),
    },
    {
      name: "customers.my-customers.button.delete",
      icon: TrashIcon,
      onClick: () => handleOpenDeleteCustomerModal(customer),
      iconColor: "text-danger-500 group-hover:text-danger-500",
    },
  ];

  useEffect(() => {
    fetchCustomers();
    fetchEvents();
    fetchProducts();
  }, []);

  return (
    <PageLayout
      isLoading={isLoading || isFetchEventsLoading || isFetchProductsLoading}
    >
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {intl.formatMessage({
              id: "customers.header",
            })}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {intl.formatMessage({
              id: "customers.description",
            })}
          </p>
        </div>
      </div>
      <div className="flex flex-row ">
        <div className="flex-1 mt-10 ">
          {customers && customers.length ? (
            <div className="">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">
                    {intl.formatMessage(
                      {
                        id: "customers.my-customers.header",
                      },
                      {
                        nb: customers.length,
                      }
                    )}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    {intl.formatMessage({
                      id: "customers.my-customers.description",
                    })}
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={() => setOpenNewCustomerPanel(true)}
                  >
                    {intl.formatMessage({
                      id: "customers.my-customers.submit",
                    })}
                  </Button>
                </div>
              </div>
              <div className="mt-10 ml-auto w-2/4 flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    type="text"
                    className="hidden w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:block"
                    placeholder={intl.formatMessage({
                      id: "customers.input.search",
                    })}
                  />
                </div>
                <button
                  type="button"
                  className="bg-white relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <BarsArrowUpIcon
                    className="-ml-0.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  {intl.formatMessage({
                    id: "customers.my-customers.button.sort",
                  })}
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <div className="-mx-4 mt-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg bg-white">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        {intl.formatMessage({
                          id: "customers.my-customers.name",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: "customers.my-customers.contact",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: "customers.my-customers.location",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: "customers.my-customers.status",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: "customers.my-customers.value",
                        })}
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-center text-sm font-semibold text-gray-900"
                      >
                        <span className="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer: Customer) => {
                      return (
                        <tr key={customer.id}>
                          <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div
                              className="font-semibold text-gray-900 hover:cursor-pointer hover:text-klaq-600"
                              onClick={() => handleCustomerDetails(customer.id)}
                            >
                              {customer.name}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                            <div className="font-medium text-gray-500">
                              <a href={`tel:${customer.phone}`}>
                                {customer.phone}
                              </a>
                            </div>
                            <div className="font-medium text-gray-500">
                              <a href={`mailto:${customer.email}`}>
                                {customer.email}
                              </a>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                            <div className="font-medium text-gray-500">
                              {customer.city}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                            <div className="font-medium text-gray-500">
                              <CustomerStatus
                                status={getCustomerStatus(customer)}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                            <div className="font-medium text-gray-500">
                              {getCustomerValue(products, customer)} €
                            </div>
                          </td>
                          <td className="relative py-3.5 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                            <KebabMenu
                              items={optionsMenuItems(customer)}
                              buttonSize="md"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <button
                onClick={() => setOpenNewCustomerPanel(true)}
                type="button"
                className="relative block sm:w-1/2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2"
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
                    id: "customers.no-customers",
                  })}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {intl.formatMessage({
                    id: "customers.get-started",
                  })}
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
      <NewCustomer
        open={openNewCustomerPanel}
        setOpen={setOpenNewCustomerPanel}
      />
      <EditCustomer
        open={openEditCustomerPanel}
        setOpen={setOpenEditCustomerPanel}
        customer={selectedCustomer}
      />
      <DangerModal
        open={openDeleteCustomerModal}
        setOpen={setOpenDeleteCustomerModal}
        onClick={() => handleDeleteCustomer(selectedCustomer)}
        title={intl.formatMessage({
          id: "customers.delete-customer.modal.title",
        })}
        message={intl.formatMessage(
          {
            id: "customers.delete-customer.modal.message",
          },
          { customerName: selectedCustomer?.name }
        )}
        button1={intl.formatMessage({
          id: "customers.delete-customer.modal.button.delete",
        })}
        button2={intl.formatMessage({
          id: "customers.delete-customer.modal.button.cancel",
        })}
      />
    </PageLayout>
  );
};

export default Customers;
