import { XMarkIcon } from "@heroicons/react/24/outline";
import { PDFViewer } from "components/PDFViewer";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetQuoteBlob } from "redux/Quote/hooks";

export const QuoteView = () => {
  const { id } = useParams();

  const [{ data }, getQuoteBlob] = useGetQuoteBlob();

  const closeWindow = () => {
    window.close();
  };

  useEffect(() => {
    getQuoteBlob(id!);
  }, []);

  return (
    <div className="overflow-hidden min-h-screen block bg-gray-100">
      <div className="fixed right-0 top-0">
        <button
          onClick={closeWindow}
          type="button"
          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2"
        >
          <XMarkIcon className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>

      <div className="flex justify-center h-full">
        <div className="overflow-y-scroll">
          {data && <PDFViewer blobContent={data} />}
        </div>
      </div>
    </div>
  );
};
