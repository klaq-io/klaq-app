import { PageLayout } from "layouts";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFetchInvoice } from "redux/Invoice/hooks";
import { getInvoice } from "redux/Invoice/selectors";

export const InvoiceDetailsPage = () => {
  const intl = useIntl();
  const { id } = useParams();

  const [{ isLoading }, fetchInvoice] = useFetchInvoice();
  const invoice = useSelector((state: any) => getInvoice(state, id));

  useEffect(() => {
    fetchInvoice(id);
  }, []);

  return (
    <PageLayout>
      <div className="flex flex-col space-y-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {intl.formatMessage({
                id: "invoice-generate.header",
              })}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {intl.formatMessage({
                id: "invoice-generate.description",
              })}
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col"></div>
      </div>
    </PageLayout>
  );
};
