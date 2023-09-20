import { DocumentIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { Button } from "components/Button";
import { Document } from "interface/document.interface";
import { useIntl } from "react-intl";
import { useFetchDocumentUrl } from "redux/Document/hooks";
import { getHumanFileSize } from "utils/utils";

type FileListProps = {
  fileList?: Document[];
};

export const FileList = (props: FileListProps) => {
  const { fileList } = props;
  const intl = useIntl();

  console.log(fileList);

  const [{ data }, fetchDocumentUrl] = useFetchDocumentUrl();

  const getDownloadUrlForDocument = async (id: string) => {
    const url = await fetchDocumentUrl(id);
    convertFiletoBlobAndDownload(url);
  };

  const convertFiletoBlobAndDownload = async (url: string) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  return fileList && fileList.length ? (
    <ul
      role="list"
      className="bg-white mt-2 divide-y divide-gray-100 rounded-md border border-gray-200 w-full"
    >
      {fileList.map((file, idx) => (
        <li
          key={`${file.filename}-${idx}`}
          className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
        >
          <div className="flex w-0 flex-1 items-center">
            <PaperClipIcon
              className="h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <div className="ml-4 flex min-w-0 flex-1 gap-2">
              <span className="truncate font-medium">{file.filename}</span>
              <span className="flex-shrink-0 text-gray-400">{file.size}</span>
            </div>
            <div className="ml-4 flex-shrink-0">
              <Button
                type="button"
                variant="link"
                color="primary"
                onClick={() => getDownloadUrlForDocument(file.id)}
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
          id: "customers.customer-details.no-documents-found.header",
        })}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {intl.formatMessage({
          id: "customers.customer-details.no-documents-found.description",
        })}
      </p>
    </div>
  );
};
