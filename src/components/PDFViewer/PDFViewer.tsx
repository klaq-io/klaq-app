import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Props = {
  blobContent: Blob;
};

export const PDFViewer = (props: Props) => {
  const { blobContent } = props;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  return (
    <>
      <Document file={blobContent} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => (
            <div className="mt-2">
              <Page
                renderTextLayer={false}
                renderAnnotationLayer={false}
                pageNumber={page}
              />
            </div>
          ))}
      </Document>
    </>
  );
};
