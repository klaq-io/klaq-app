import { useIntl } from "react-intl";
import { PageLayout } from "../../layouts";
import {
  useDeleteCustomer,
  useFetchCustomers,
} from "../../redux/Customer/hooks";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCustomers } from "../../redux/Customer/selectors";
import {
  ChevronDownIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Customer } from "../../redux/Customer/slices";
import { CustomerStatus, DangerModal } from "../../components";
import { useFetchEvents } from "../../redux/Events/hooks";
import { getAllEvents } from "../../redux/Events/selectors";
import { useFetchProductItems } from "../../redux/Products/hooks";
import { getAllProducts } from "../../redux/Products/selectors";
import { EventStatus } from "../../redux/Events/slices";
import { NewCustomer } from "./NewCustomer";
import Button from "../../components/Button";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "../../utils/utils";
import EditCustomer from "./EditCustomer";

export const Customers = () => {
  const intl = useIntl();

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

  const getCustomerEvents = (customerId: string) => {
    const customerEvents = events.filter(
      (event) => event.customer.id === customerId
    );
    return customerEvents;
  };

  const getCustomerValue = (customerId: string) => {
    const customerEvents = getCustomerEvents(customerId);
    const customerProducts = customerEvents.flatMap((event) =>
      event.products?.map((product) => ({
        product: products.find(
          (productItems) => productItems.id === product.productId
        ),
        quantity: product.quantity,
      }))
    );
    const customerValue = customerProducts.reduce((acc, curr) => {
      if (curr?.product?.price && typeof curr.quantity === "number") {
        return acc + curr.product.price * curr.quantity;
      } else {
        return acc;
      }
    }, 0);
    return customerValue;
  };

  const getCustomerStatus = (customerId: string) => {
    const customerEvents = getCustomerEvents(customerId);
    const eventsStatus = customerEvents.flatMap((event) => event.status);
    if (!customerEvents.length) return "new";
    if (eventsStatus.includes(EventStatus.INBOX)) return "in-deal";

    if (eventsStatus.filter((status) => status === EventStatus.WIN).length >= 2)
      return "recurring";
    return "lost";
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
                    variant="primary"
                    type="button"
                    onClick={() => setOpenNewCustomerPanel(true)}
                    text={intl.formatMessage({
                      id: "customers.my-customers.submit",
                    })}
                  />
                </div>
              </div>
              <div className="flex flex-row mt-10">
                <div className="w-1/4 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    id="search-field"
                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder={intl.formatMessage({
                      id: "customers.input.search",
                    })}
                    type="text"
                    name="search"
                  />
                </div>
              </div>
              <div className="-mx-4 mt-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
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
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-sm font-semibold text-gray-900"
                      >
                        <span className="sr-only">Action</span>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer: Customer) => {
                      return (
                        <tr key={customer.id}>
                          <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">
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
                                status={getCustomerStatus(customer.id)}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">
                            <div className="font-medium text-gray-500">
                              {getCustomerValue(customer.id)}€
                            </div>
                          </td>
                          <td className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Menu
                              as="div"
                              className="relative inline-block text-left"
                            >
                              <div>
                                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                  {intl.formatMessage({
                                    id: `customers.my-customers.button.header`,
                                  })}
                                  <ChevronDownIcon
                                    className="-mr-1 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Menu.Button>
                              </div>

                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          onClick={() =>
                                            handleEditCustomer(customer)
                                          }
                                          className={classNames(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "group flex items-center px-4 py-2 text-sm"
                                          )}
                                        >
                                          <PencilSquareIcon
                                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                          />
                                          {intl.formatMessage({
                                            id: `customers.my-customers.button.edit`,
                                          })}
                                        </a>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          href="#"
                                          className={classNames(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "group flex items-center px-4 py-2 text-sm hover:cursor-pointer"
                                          )}
                                        >
                                          <EyeIcon
                                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                          />
                                          {intl.formatMessage({
                                            id: `customers.my-customers.button.look`,
                                          })}
                                        </a>
                                      )}
                                    </Menu.Item>
                                  </div>
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          onClick={() =>
                                            handleOpenDeleteCustomerModal(
                                              customer
                                            )
                                          }
                                          className={classNames(
                                            active
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "group flex items-center px-4 py-2 text-sm hover:cursor-pointer"
                                          )}
                                        >
                                          <TrashIcon
                                            className="mr-3 h-5 w-5 text-danger-400 group-hover:text-danger-500"
                                            aria-hidden="true"
                                          />
                                          {intl.formatMessage({
                                            id: `customers.my-customers.button.delete`,
                                          })}
                                        </a>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
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
                type="button"
                className="relative block sm:w-1/2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
