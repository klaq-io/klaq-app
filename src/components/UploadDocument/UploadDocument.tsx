import { CloudArrowUpIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { classNames, getHumanFileSize } from '../../utils/utils';
import { useIntl } from 'react-intl';

type UploadDocumentZoneProps = {
  fileList: File[];
  setFiles: (files: File[]) => void;
};

export const UploadDocumentZone = (props: UploadDocumentZoneProps) => {
  const { fileList, setFiles } = props;
  const intl = useIntl();

  const [shouldHighlight, setShouldHighlight] = useState(false);
  const preventDefaultHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = (fileName: string) => {
    const newFiles = fileList.filter((f) => f.name !== fileName);
    setFiles(newFiles);
  };

  return (
    <>
      <div
        className={classNames(
          'flex justify-center rounded-lg border-dashed border-gray-900/25 px-6 py-10 flex flex-col',
          shouldHighlight ? 'border-2 bg-gray-50' : 'border-2',
        )}
        onDragOver={(e) => {
          preventDefaultHandler(e);
          setShouldHighlight(true);
        }}
        onDragEnter={(e) => {
          preventDefaultHandler(e);
          setShouldHighlight(true);
        }}
        onDragLeave={(e) => {
          preventDefaultHandler(e);
          setShouldHighlight(false);
        }}
        onDrop={(e) => {
          preventDefaultHandler(e);
          const files = Array.from(e.dataTransfer.files);
          setFiles(files.concat(fileList));
          setShouldHighlight(false);
        }}
      >
        <div className="flex flex-col items-center text-center pb-2">
          <CloudArrowUpIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-klaq-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-klaq-600 focus-within:ring-offset-2 hover:text-klaq-500"
            >
              <span>
                {intl.formatMessage({
                  id: 'documents.header.input',
                })}
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={(e) => {
                  if (!e.target.files) return;
                  const files = Array.from(e.target.files);
                  setFiles(files.concat(fileList));
                }}
              />
            </label>
            <p className="pl-1">
              {intl.formatMessage({
                id: 'documents.header.drag-and-drop',
              })}
            </p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            {intl.formatMessage({
              id: 'documents.description',
            })}
          </p>
        </div>
        <div className="flex"></div>
      </div>

      {fileList.length > 0 && (
        <div>
          <label className="mt-4 block text-sm font-medium leading-6 text-gray-900">
            {intl.formatMessage(
              {
                id: 'documents.label',
              },
              { s: fileList.length > 1 ? 's' : '' },
            )}
          </label>
          <ul
            role="list"
            className="mt-2 divide-y divide-gray-100 rounded-md border border-gray-200 w-full"
          >
            {fileList.map((file, idx) => (
              <li
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
              >
                <div className="flex w-0 flex-1 items-center">
                  <PaperClipIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">{file.name}</span>
                    <span className="flex-shrink-0 text-gray-400">
                      {getHumanFileSize(file.size)}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      className="font-medium text-klaq-600 hover:text-klaq-500"
                      onClick={() => handleRemoveFile(file.name)}
                    >
                      {intl.formatMessage({
                        id: 'documents.button.remove',
                      })}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
