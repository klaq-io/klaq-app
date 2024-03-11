import { FC } from 'react';
import { EventStatus } from '../../../redux/Events/slices';
import { classNames } from '../../../utils/utils';
import { useIntl } from 'react-intl';

type Props = {
  status: EventStatus;
};

const statusColor: { [key in EventStatus]: string } = {
  [EventStatus.INBOX]: 'text-blue-400 bg-blue-400/10 ring-blue-400/20',
  [EventStatus.QUALIFICATION]:
    'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
  [EventStatus.QUOTE_SENT]: 'text-pink-400 bg-pink-400/10 ring-pink-400/30',
  // [EventStatus.QUOTE_OPENED]: "text-pink-400 bg-pink-400/10 ring-pink-400/30",
  [EventStatus.QUOTE_ACCEPTED]:
    'text-success-400 bg-success-400/10 ring-success-400/30',
  [EventStatus.QUOTE_REJECTED]:
    'text-danger-400 bg-danger-400/10 ring-danger-400/30',
  // [EventStatus.CONTRACT_SENT]: "text-pink-500 bg-pink-500/10 ring-pink-500/30",
  // [EventStatus.CONTRACT_OPENED]:
  //   "text-pink-500 bg-pink-500/10 ring-pink-500/30",
  // [EventStatus.CONTRACT_ACCEPTED]:
  //   "text-success-400 bg-success-400/10 ring-success-400/30",
  // [EventStatus.CONTRACT_REJECTED]:
  //   "text-danger-400 bg-danger-400/10 ring-danger-400/30",
  // [EventStatus.DEPOSIT_REQUESTED]:
  //   "text-slate-400 bg-slate-400/10 ring-slate-400/30",
  // [EventStatus.DEPOSIT_LATE]:
  //   "text-danger-400 bg-danger-400/10 ring-danger-400/30",
  [EventStatus.READY]: 'text-warning-400 bg-warning-400/10 ring-warning-400/30',
  [EventStatus.DONE]: 'text-success-400 bg-success-400/10 ring-success-400/30',
  [EventStatus.INVOICE_SENT]: 'text-pink-600 bg-pink-600/10 ring-pink-600/30',
  // [EventStatus.INVOICE_OPENED]: "text-pink-600 bg-pink-600/10 ring-pink-600/30",
  [EventStatus.INVOICE_OVERDUE]:
    'text-warning-400 bg-warning-400/10 ring-warning-400/30',
  [EventStatus.WIN]: 'text-success-400 bg-success-400/10 ring-success-400/30',
  [EventStatus.LOST]: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
};

export const EventBadge: FC<Props> = (props: Props) => {
  const { status } = props;
  const intl = useIntl();
  return (
    <div
      className={classNames(
        statusColor[status],
        'inline-flex items-center rounded-full flex-none py-1 px-2 text-sm font-medium ring-1 ring-inset',
      )}
    >
      {intl.formatMessage({
        id: `events.status.${status}`,
      })}
    </div>
  );
};

export default EventBadge;
