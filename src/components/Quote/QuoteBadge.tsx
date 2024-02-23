import { QuoteStatus } from 'interface/Quote/quote.interface';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { classNames } from 'utils/utils';

type QuoteBadgeProps = {
  status: QuoteStatus;
};

export const QuoteBadge: FC<QuoteBadgeProps> = (props: QuoteBadgeProps) => {
  const { status } = props;
  const intl = useIntl();

  const statusClasses: { [key in QuoteStatus]: string } = {
    [QuoteStatus.DRAFT]: 'text-gray-700 ring-gray-600/20 bg-gray-50',
    [QuoteStatus.SENT]: 'text-warning-700 ring-warning-600/20 bg-warning-50',
    [QuoteStatus.ACCEPTED]:
      'text-success-700 ring-success-600/20 bg-success-50',
    [QuoteStatus.REJECTED]: 'text-danger-700 ring-danger-600/20 bg-danger-50',
  };
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset',
        statusClasses[status],
      )}
    >
      {intl.formatMessage({
        id: `quote.status.${status}`,
      })}
    </span>
  );
};
