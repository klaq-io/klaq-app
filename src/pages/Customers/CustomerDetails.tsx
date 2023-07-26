import { FC, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getCustomer } from "../../redux/Customer/selectors";
import { useFetchCustomers } from "../../redux/Customer/hooks";
import { PageLayout } from "../../layouts";
import Button from "../../components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../routes";

type Props = {};

export const CustomerDetails: FC<Props> = (props: Props) => {
  const intl = useIntl();
  const { id } = useParams();
  const navigate = useNavigate();

  const [{ isLoading, isSuccess }, fetchCustomers] = useFetchCustomers();
  const customer = useSelector((state: any) => getCustomer(state, id!));
  console.log(customer);

  const handlePrevious = () => {
    navigate(PATHS.CUSTOMERS);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  return (
    <PageLayout isLoading={isLoading}>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            type="button"
            text="Previous"
            Icon={ArrowLeftIcon}
            iconPosition="leading"
          />
        </div>
      </div>
      <div className="mt-10 flex flex-col space-y-4">
        <div className="flex flex-row border border-gray-200 rounded-md bg-white px-4 py-5 sm:px-6">
          <div className="flex flex-col space-y-4"></div>
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl leading-7 text-gray-900 sm:truncate sm:tracking-tight">
              {customer?.name}
            </h2>
          </div>
          <div className="flex flex-col space-y-4"></div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CustomerDetails;
