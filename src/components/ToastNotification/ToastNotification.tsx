import { useIntl } from "react-intl";
import { StatusIcon } from "../StatusIcon";

type Props = {
  classes?: string;
  status: "success" | "danger" | "warning" | "info";
  titleId: string;
  messageId?: string;
};

export const ToastNotification = (props: Props) => {
  const { status, titleId, messageId } = props;
  const intl = useIntl();

  return (
    <>
      <div className="z-40 pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <StatusIcon status={status} />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">
                {intl.formatMessage({
                  id: `${titleId}`,
                })}
              </p>
              {messageId ? (
                <p className="mt-1 text-sm text-gray-500">
                  {intl.formatMessage({
                    id: `${messageId}`,
                  })}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToastNotification;
