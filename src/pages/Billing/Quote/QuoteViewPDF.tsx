import { ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, CardContainer } from "components";
import { PageLayout } from "layouts";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchQuoteDocument } from "redux/Quote/hooks";

export const QuoteViewPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [{ isLoading }, fetchQuotePDF] = useFetchQuoteDocument();

  const displayPDF = async () => {
    const data = await fetchQuotePDF(id);
    const blob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const iframe = document.querySelector("iframe");
    iframe!.src = url;
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  useEffect(() => {
    displayPDF();
  }, []);

  return (
    <PageLayout>
      {isLoading && (
        <div className="flex flex-col space-y-8 h-full">
          <CardContainer className="m-auto px-4 py-5 sm:p-6 animate-pulse flex flex-col items-center space-y-8">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Nous générons votre document, cela peut prendre quelques
              secondes...
            </h1>
            <Cog6ToothIcon className="h-12 w-12 text-gray-400 animate-spin" />
          </CardContainer>
        </div>
      )}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Button
            type="button"
            variant="text"
            color="secondary"
            leadingIcon={
              <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            }
            onClick={handlePrevious}
          >
            {intl.formatMessage({
              id: "customers.customer-details.button.previous",
            })}
          </Button>
        </div>
      </div>
      <iframe src="" width="100%" height="100%" />
    </PageLayout>
  );
};
