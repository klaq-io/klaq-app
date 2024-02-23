import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { SubEvent } from 'interface/Event/subevent.interface';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Customer } from 'redux/Customer/slices';
import { EventStatus } from '../../../redux/Events/slices';
import { PATHS } from '../../../routes';
import { getDayStr, getMonthStr } from '../../../utils/utils';
import { Skeleton } from '../../Skeleton';
import { EventBadge } from '../EventBadge';

type Item = SubEvent & {
  customer: Customer;
  status: EventStatus;
  mainEventId: string;
};

type Props = {
  subEvents: Item[];
  isLoading?: boolean;
};

export const EventList: FC<Props> = (props: Props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { isLoading = false, subEvents } = props;

  const handleEventDetails = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}/details?tab=Roadmap`);
  };

  return isLoading ? (
    <EventListSkeletonCard />
  ) : (
    <ul role="list" className="space-y-3">
      {subEvents.map((subEvent) => (
        <>
          <li
            key={subEvent.id}
            className="rounded-md hover:cursor-pointer hover:border-gray-200 hover:shadow-md bg-white px-6 py-4 shadow flex"
            onClick={() => handleEventDetails(subEvent.mainEventId)}
          >
            <div className="flex flex-col items-center justify-center border-gray-200 border-r pr-3 text-klaq-600 w-1/5">
              <span className="text-md">
                {intl.formatMessage({
                  id: getDayStr(new Date(subEvent.date)),
                })}
              </span>
              <span className="text-xl font-bold">
                {format(new Date(subEvent.date), 'dd')}
              </span>
              <span className="text-md">
                {intl.formatMessage({
                  id: getMonthStr(new Date(subEvent.date)),
                })}
              </span>
            </div>
            <div className="ml-4 flex flex-col justify-between w-3/5">
              <div className="flex flex-row space-x-2 text-left">
                <span className="text-md  text-gray-900">{subEvent.type}</span>
                <span className="text-md text-gray-900">{' <> '}</span>
                <span className="text-md text-gray-900 font-bold">
                  {subEvent.customer.name || 'Client non défini'}
                </span>
              </div>
              <div className="flex flex-row space-x-3">
                <div className="flex flex-row">
                  <ClockIcon className="h-5 w-5" />
                  <span className="ml-2 text-sm text-gray-900 border-r pr-3">
                    {subEvent.startTime
                      ? subEvent.startTime
                      : 'Horaires non définies'}
                    {subEvent.endTime && `- ${subEvent.endTime}`}
                  </span>
                </div>
                <div className="flex flex-row">
                  <MapPinIcon className="h-5 w-5" />
                  <span className="ml-2 text-sm text-gray-900">
                    {`${subEvent.zipcode}, ${subEvent.city}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 w-1/5 items-center justify-center">
              <div className="flex items-center justify-center">
                {/* <EventBadge status={event.status} /> */}
                <EventBadge status={subEvent.status} />
              </div>
            </div>
            {/* <div className="flex flex-col space-y-4 ml-auto justify-center items-center w-1/5">
              <DropdownMenu
                items={menuItems(event.id)}
                buttonText={"Options"}
              />
            </div> */}
          </li>
        </>
      ))}
    </ul>
  );
};

export const EventListSkeletonCard = () => {
  return (
    <div className="flex flex-col space-y-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="rounded-md bg-white px-6 py-4 shadow flex animate-pulse"
        >
          <div className="flex flex-col items-center justify-center border-gray-200 border-r pr-3 text-klaq-600 w-1/5">
            <Skeleton variant="rounded" width={24} height={16} />
          </div>
          <div className="ml-4 flex flex-col space-y-4 w-2/5">
            <Skeleton variant="rounded" width={'full'} height={8} />
            <Skeleton variant="rounded" width={'40'} height={8} />
          </div>
        </div>
      ))}
    </div>
  );
};
