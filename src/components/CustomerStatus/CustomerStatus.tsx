import { FC } from "react";
import { useIntl } from "react-intl";
import { classNames } from "../../utils/utils";

type Props = {
  classes?: any;
  status: "in-deal" | "new" | "recurring" | "lost";
};

export const CustomerStatus: FC<Props> = (props: Props) => {
  const { status } = props;
  const intl = useIntl();

  const statusClasses = {
    "in-deal": "text-success-700 ring-success-600/20 bg-success-50",
    new: "text-blue-700 ring-blue-600/20 bg-blue-50",
    recurring: "text-indigo-700 ring-indigo-600/20 bg-indigo-50",
    lost: "text-gray-700 ring-gray-600/20 bg-gray-50",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        statusClasses[status]
      )}
    >
      {intl.formatMessage({
        id: `customers.status.${status}`,
      })}
    </span>
  );
};

export default CustomerStatus;
