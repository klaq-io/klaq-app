import {
  EyeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Button, DangerModal, KebabMenu } from 'components';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';
import { PageLayout } from '../../layouts';
import {
  useFetchCustomers,
  useUpdateArchivedStatus,
} from '../../redux/Customer/hooks';
import { getCustomers } from '../../redux/Customer/selectors';
import { Customer } from '../../redux/Customer/slices';
import { EventStatus } from '../../redux/Events/slices';
import { PATHS } from '../../routes';
import EditCustomer from './EditCustomer';
import { NewCustomer } from './NewCustomer';

export const Customers = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [shouldOpenNewCustomerPanel, setOpenNewCustomerPanel] = useState(false);
  const [shouldOpenEditCustomerPanel, setOpenEditCustomerPanel] =
    useState(false);
  const [shouldOpenDeleteCustomerModal, setOpenArchiveCustomerModal] =
    useState(false);

  const [, updateArchiveCustomerStatus] = useUpdateArchivedStatus();

  const [{ isLoading }, fetchCustomers] = useFetchCustomers();
  const customers = useSelector(getCustomers);
  const filteredCustomers =
    query === ''
      ? customers
      : customers.filter(
          (customer) =>
            customer.name?.toLowerCase().includes(query.toLowerCase()) ||
            customer.firstName.toLowerCase().includes(query.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query),
        );

  const getCustomerStatus = (customer: Customer) => {
    // TODO: change it to a better logic
    if (!customer.mainEvents || customer.mainEvents.length === 0) return 'new';
    const eventsStatus = customer.mainEvents.flatMap((event) => event.status);
    if (!customer.mainEvents.length) return 'new';
    if (eventsStatus.includes(EventStatus.INBOX)) return 'in-deal';

    if (eventsStatus.filter((status) => status === EventStatus.WIN).length >= 2)
      return 'recurring';
    if (eventsStatus.includes(EventStatus.LOST)) return 'lost';
    return 'none';
  };

  const handleOpenDeleteCustomerModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenArchiveCustomerModal(true);
  };

  const handleArchiveCustomer = (customer?: Customer) => {
    if (!customer) return;
    setOpenArchiveCustomerModal(false);
    updateArchiveCustomerStatus(customer.id, true);
    fetchCustomers();
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
      name: 'customers.my-customers.button.edit',
      icon: PencilSquareIcon,
      onClick: () => handleEditCustomer(customer),
    },
    {
      name: 'customers.my-customers.button.look',
      icon: EyeIcon,
      onClick: () => handleCustomerDetails(customer.id),
    },
    {
      name: 'customers.my-customers.button.delete',
      icon: TrashIcon,
      onClick: () => handleOpenDeleteCustomerModal(customer),
      iconColor: 'text-danger-500 group-hover:text-danger-500',
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <PageLayout isLoading={isLoading}>
      <div className="flex flex-row ">
        <div className="flex-1">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {intl.formatMessage({
                  id: 'customers.header',
                })}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                {intl.formatMessage(
                  {
                    id: 'customers.description',
                  },
                  {
                    nb: customers.length,
                  },
                )}
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
                  id: 'customers.my-customers.submit',
                })}
              </Button>
            </div>
          </div>
          {customers && customers.length ? (
            <>
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
                    className="hidden w-full rounded-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-klaq-600 sm:block"
                    placeholder={intl.formatMessage({
                      id: 'customers.input.search',
                    })}
                  />
                </div>
                {/* <button
                  type="button"
                  className="bg-white relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <BarsArrowUpIcon
                    className="-ml-0.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  {intl.formatMessage({
                    id: 'customers.my-customers.button.sort',
                  })}
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button> */}
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
                          id: 'customers.my-customers.name',
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: 'customers.my-customers.contact',
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: 'customers.my-customers.enquiry',
                        })}
                      </th>
                      <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                      >
                        {intl.formatMessage({
                          id: 'customers.my-customers.signed',
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
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                            <div className="font-medium text-gray-500">
                              {customer.mainEvents?.length}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-sm text-gray-500 lg:table-cell text-center">
                            <div className="font-medium text-gray-500">
                              {
                                customer.mainEvents?.filter(
                                  (event) => event.status === EventStatus.WIN,
                                ).length
                              }
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
            </>
          ) : (
            <div className="mt-10">
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
                    id: 'customers.no-customers',
                  })}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {intl.formatMessage({
                    id: 'customers.get-started',
                  })}
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
      <NewCustomer
        isOpen={shouldOpenNewCustomerPanel}
        setOpen={setOpenNewCustomerPanel}
      />
      <EditCustomer
        isOpen={shouldOpenEditCustomerPanel}
        setOpen={setOpenEditCustomerPanel}
        customer={selectedCustomer}
      />
      <DangerModal
        isOpen={shouldOpenDeleteCustomerModal}
        setOpen={setOpenArchiveCustomerModal}
        onClick={() => handleArchiveCustomer(selectedCustomer)}
        title={intl.formatMessage({
          id: 'customers.archive-customer.modal.title',
        })}
        message={intl.formatMessage(
          {
            id: 'customers.archive-customer.modal.message',
          },
          { customerName: selectedCustomer?.name },
        )}
        button1={intl.formatMessage({
          id: 'customers.archive-customer.modal.button.delete',
        })}
        button2={intl.formatMessage({
          id: 'customers.archive-customer.modal.button.cancel',
        })}
      />
    </PageLayout>
  );
};

export default Customers;
