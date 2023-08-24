import { useIntl } from "react-intl";
import { InvoiceLayout, PageLayout } from "../../layouts";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components";

export const QuoteGenerator = () => {
  const intl = useIntl();
  return (
    <PageLayout>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Button
            variant="text"
            color="secondary"
            type="button"
            leadingIcon={<ArrowLeftIcon className="-ml-0.5 h-5 w-5" />}
          >
            {intl.formatMessage({
              id: "edit-event.button.previous",
            })}
          </Button>
        </div>
        <div>
          <div className="flex flex-shrink-0 space-x-4">
            <Button variant="text" color="secondary" type="button">
              {intl.formatMessage({
                id: "Editer",
              })}
            </Button>
            <Button variant="text" color="secondary" type="button">
              {intl.formatMessage({
                id: "Voir",
              })}
            </Button>
            <Button variant="contained" color="primary" type="button" size="lg">
              {intl.formatMessage({
                id: "Envoyer",
              })}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          {/* Quote */}
          <InvoiceLayout>
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              {intl.formatMessage({
                id: "quote.header",
              })}
            </h2>
          </InvoiceLayout>
        </div>
      </div>
    </PageLayout>
  );
};
