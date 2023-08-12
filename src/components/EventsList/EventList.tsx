import { FC } from "react";
import { useIntl } from "react-intl";
import { getDayStr, getMonthStr } from "../../utils/utils";
import { Event, EventStatus } from "../../redux/Events/slices";
import { format, parse } from "date-fns";
import {
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { EventBadgeButton } from "../EventBadge";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { DropdownMenu } from "../DropdownMenu";
import { Skeleton } from "../Skeleton";

type Props = {
  events: Event[];
  isLoading?: boolean;
};

export const EventList: FC<Props> = (props: Props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { events, isLoading = false } = props;

  const formatTime = (time: string) => {
    const t = parse(time, "HH:mm:ss", new Date());
    return format(t, "HH:mm");
  };

  const handleEventDetails = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}`);
  };

  const handleEditEvent = (id: string) => {
    navigate(`${PATHS.EVENTS}/${id}/edit`);
  };

  const handleGoToCustomer = (id: string) => {
    navigate(`${PATHS.CUSTOMERS}/${id}`);
  };

  const menuItems = (eventId: string) => [
    {
      name: "events.button.edit",
      onClick: () => handleEditEvent(eventId),
      icon: PencilSquareIcon,
    },

    {
      name: "events.button.look",
      onClick: () => handleEventDetails(eventId),
      icon: EyeIcon,
    },
  ];

  return isLoading ? (
    <EventListSkeletonCard />
  ) : (
    <ul role="list" className="space-y-3">
      {events.map((event) => (
        <>
          <li
            key={event.id}
            className="rounded-md bg-white px-6 py-4 shadow flex"
          >
            <div className="flex flex-col items-center justify-center border-gray-200 border-r pr-3 text-klaq-600 w-1/5">
              <span className="text-md">
                {intl.formatMessage({
                  id: getDayStr(event.date),
                })}
              </span>
              <span className="text-xl font-bold">
                {format(new Date(event.date), "dd")}
              </span>
              <span className="text-md">
                {intl.formatMessage({
                  id: getMonthStr(event.date),
                })}
              </span>
            </div>
            <div className="ml-4 flex flex-col justify-between w-2/5">
              <div className="flex flex-row space-x-2 text-left">
                <span className="text-md  text-gray-900">
                  {intl.formatMessage({
                    id: `new-event.date.input.event-type.${event.eventType}`,
                  })}
                </span>
                <span className="text-md text-gray-900">{" <> "}</span>
                <span
                  className="text-md text-gray-900 hover:text-klaq-600 hover:cursor-pointer font-bold"
                  onClick={() => handleGoToCustomer(event.customer.id)}
                >
                  {event.customer.name}
                </span>
              </div>
              <div className="flex flex-row space-x-3">
                <div className="flex flex-row">
                  <ClockIcon className="h-5 w-5" />
                  <span className="ml-2 text-sm text-gray-900 border-r pr-3">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </span>
                </div>
                <div className="flex flex-row">
                  <MapPinIcon className="h-5 w-5" />
                  <span className="ml-2 text-sm text-gray-900 hover:text-klaq-600">
                    <a
                      target="_blank"
                      href={encodeURI(
                        `https://maps.google.com/?q=${event.address} ${
                          event.city
                        } ${event.zipcode} ${"FR"}}`
                      )}
                    >
                      {`${event.zipcode}, ${event.city}`}
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 w-1/5 items-center justify-center">
              <div className="flex items-center justify-center">
                {/* <EventBadge status={event.status} /> */}
                <EventBadgeButton status={event.status} eventId={event.id} />
              </div>
            </div>
            <div className="flex flex-col space-y-4 ml-auto justify-center items-center w-1/5">
              <DropdownMenu
                items={menuItems(event.id)}
                buttonText={"Options"}
              />
            </div>
          </li>
        </>
      ))}
    </ul>
  );
};

const EventListSkeletonCard = () => {
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
            <Skeleton variant="rounded" width={"full"} height={8} />
            <Skeleton variant="rounded" width={"40"} height={8} />
          </div>
        </div>
      ))}
    </div>
  );
};
