import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { CardContainer } from "components";
import { PageLayout } from "layouts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useFetchInvoiceDocument
} from "redux/Invoice/hooks";

export const InvoiceViewPage = () => {
  const { id } = useParams<{ id: string }>();

  const [{ data, isLoading }, fetchInvoicePDF] = useFetchInvoiceDocument();

  const displayPDF = async () => {
    const data = await fetchInvoicePDF(id);
    const blob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const iframe = document.querySelector("iframe");
    iframe!.src = url;
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
      <iframe src="" width="100%" height="100%" />
    </PageLayout>
  );
};
