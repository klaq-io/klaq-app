import { DocumentIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { Button } from 'components/Button';
import { InvoiceBadge } from 'components/Invoice';
import { QuoteBadge } from 'components/Quote';
import { Invoice } from 'interface/Invoice/invoice.interface';
import { Quote } from 'interface/Quote/quote.interface';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'routes';
import { getInvoiceSubtotal } from 'utils/invoice';
import { getSubtotalForQuote } from 'utils/quote';

type DocumentType = 'quote' | 'invoice';

type BillingDocumentProps = {
  documents?: Invoice[] | Quote[];
  type: DocumentType;
};

export const BillingDocumentList = (props: BillingDocumentProps) => {
  const { documents, type } = props;
  const intl = useIntl();
  const navigate = useNavigate();

  const handleDocumentDetails = (document: Invoice | Quote) => {
    const documentType = type === 'quote' ? PATHS.QUOTE : PATHS.INVOICE;
    navigate(`${documentType}/${document.id}/details`);
  };

  return documents && documents.length ? (
    <ul
      role="list"
      className="bg-white mt-2 divide-y divide-gray-100 rounded-md border border-gray-200 w-full"
    >
      {documents.map((document, idx) => (
        <li
          key={`${document.number}-${idx}`}
          className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
        >
          <div className="flex w-0 flex-1 items-center">
            <PaperClipIcon
              className="h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <div className="ml-4 flex min-w-0 flex-1 gap-2 items-center">
              <span className="truncate font-medium">{document.number}</span>
              <span className="flex-shrink-0 text-gray-400">
                {type === 'quote'
                  ? getSubtotalForQuote(document as Quote).toFixed(2)
                  : getInvoiceSubtotal(document as Invoice).toFixed(2)}{' '}
                €
              </span>
            </div>
            <div className="ml-4 flex-shrink-0">
              <span className="mr-4">
                {type === 'quote' ? (
                  <QuoteBadge status={(document as Quote).status} />
                ) : (
                  <InvoiceBadge status={(document as Invoice).status} />
                )}
              </span>
              <Button
                type="button"
                variant="link"
                color="primary"
                onClick={() => handleDocumentDetails(document)}
              >
                Voir
              </Button>
            </div>
            <div className="ml-4 flex-shrink-0">
              <Button
                type="button"
                variant="link"
                color="primary"
                // onClick={() => getDownloadUrlForDocument(file.id)}
              >
                Télécharger
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-klaq-500 focus:ring-offset-2">
      <DocumentIcon
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      />

      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {intl.formatMessage({
          id: 'customers.customer-details.no-documents-found.header',
        })}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {intl.formatMessage({
          id: 'customers.customer-details.no-documents-found.description',
        })}
      </p>
    </div>
  );
};
