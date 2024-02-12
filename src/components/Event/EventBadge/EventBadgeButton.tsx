import { FC, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../../utils/utils";
import { EventStatus } from "../../../redux/Events/slices";
import EventBadge from "./EventBadge";
import {
  useFetchEvents,
  useUpdateEventStatus,
} from "../../../redux/Events/hooks";
import {
  useFetchMainEvent,
  useUpdateMainEventStatus,
} from "redux/MainEvent/hooks";
import { SuperBalls } from "@uiball/loaders";
import { useFetchCommentaries } from "redux/Commentary/hooks";
import { Spinner } from "components/Spinner";

type Props = {
  status: EventStatus;
  eventId: string;
};

export const EventBadgeButton: FC<Props> = (props: Props) => {
  const { status, eventId } = props;
  const [{ isLoading }, updateEventStatus] = useUpdateMainEventStatus();

  const [, fetchMainEvent] = useFetchMainEvent();
  const [, fetchComments] = useFetchCommentaries();

  const handleUpdateEventStatus = async (eventStatus: EventStatus) => {
    await updateEventStatus({ status: eventStatus }, eventId);
    fetchMainEvent(eventId);
    fetchComments(eventId);
  };

  return isLoading ? (
    <Spinner size="small" color="primary" />
  ) : (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 bg-white px-3 py-2 text-sm font-semibold text-gray-900">
          <EventBadge status={status} />
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="text-center overflow-scroll h-56 absolute z-40 mt-2 w-80 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {(Object.keys(EventStatus) as Array<keyof typeof EventStatus>).map(
              (key) => {
                const status = EventStatus[key];
                return (
                  <Menu.Item key={status}>
                    {({ active }) => (
                      <span
                        onClick={() => handleUpdateEventStatus(status)}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        <EventBadge status={status} />
                      </span>
                    )}
                  </Menu.Item>
                );
              }
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
