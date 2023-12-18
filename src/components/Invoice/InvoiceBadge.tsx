import { InvoiceStatus } from "interface/Invoice/invoice.interface";
import { FC } from "react";
import { useIntl } from "react-intl";
import { QuoteStatus } from "redux/Quote/slices";
import { classNames } from "utils/utils";

type InvoiceBadgeProps = {
  status: InvoiceStatus;
};

export const InvoiceBadge: FC<InvoiceBadgeProps> = (
  props: InvoiceBadgeProps
) => {
  const { status } = props;
  const intl = useIntl();

  const statusClasses: { [key in InvoiceStatus]: string } = {
    [InvoiceStatus.DRAFT]: "text-gray-700 ring-gray-600/20 bg-gray-50",
    [InvoiceStatus.SENT]: "text-warning-700 ring-warning-600/20 bg-warning-50",
    [InvoiceStatus.PAID]: "text-success-700 ring-success-600/20 bg-success-50",
    [InvoiceStatus.LATE]: "text-danger-700 ring-danger-600/20 bg-danger-50",
    [InvoiceStatus.CANCELED]: "text-danger-700 ring-danger-600/20 bg-danger-50",
    [InvoiceStatus.PENDING]: "text-warning-700 ring-gray-600/20 bg-warning-50",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset",
        statusClasses[status]
      )}
    >
      {intl.formatMessage({
        id: `invoice.status.${status}`,
      })}
    </span>
  );
};
