import { useIntl } from "react-intl";
import { PageLayout } from "../../layouts";
import { useFetchCustomers } from "../../redux/Customer/hooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCustomers } from "../../redux/Customer/selectors";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Customer } from "../../redux/Customer/slices";
import { CustomerStatus } from "../../components";

export const Customers = () => {
  const intl = useIntl();
  const [{ isLoading }, fetchCustomers] = useFetchCustomers();
  const customers = useSelector(getCustomers);

  useEffect(() => {
    fetchCustomers();
  }, []);

  console.log(customers);
  return (
    <PageLayout isLoading={isLoading}>
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
                  <button
                    type="button"
                    className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {intl.formatMessage({
                      id: "customers.my-customers.submit",
                    })}
                  </button>
                </div>
              </div>
              <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
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
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer: Customer) => (
                      <tr key={customer.id}>
                        <td className="relative py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
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
                            <CustomerStatus status="lost" />
                          </div>
                        </td>
                      </tr>
                    ))}
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
    </PageLayout>
  );
};

export default Customers;
