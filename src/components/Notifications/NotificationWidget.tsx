import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Notification } from "interface/Notifications/notification.interface";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFetchNotifications } from "redux/Notification/hooks";
import { getNotifications } from "redux/Notification/selectors";
import { NotificationCard } from "./NotificationCard";

export const NotificationWidget = () => {
  const [unreadNotifications, setUnreadNotifications] = useState<number | null>(
    null
  );
  const [, setIsOpened] = useState(false);

  const [, fetchNotifications] = useFetchNotifications();
  const notifications = useSelector(getNotifications);

  const handleInteraction = async () => {
    setIsOpened((isOpened) => !isOpened);

    if (!(unreadNotifications === null || unreadNotifications > 0)) {
      return;
    }
    await fetchNotifications();
  };

  useEffect(() => {
    const notificationSource = new EventSource(
      `${process.env.REACT_APP_API_URL}/notification/count`,
      { withCredentials: true }
    );

    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      setUnreadNotifications((unreadNotifications) => {
        const nextCount = (unreadNotifications ?? 0) + data.unreadCount;
        return !nextCount ? null : data.unreadCount;
      });
    };
    notificationSource.addEventListener("message", onMessage);
    /* eslint-disable */
    return () => {
      notificationSource!.close();
      notificationSource!.removeEventListener("message", onMessage);
    };
    /* eslint-enable */
  }, []);

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center" onClick={handleInteraction}>
          <span className="inline-block relative">
            <BellIcon
              className="h-6 w-6 text-gray-400 hover:text-gray-500"
              aria-hidden="true"
            />
            {unreadNotifications && unreadNotifications > 0 ? (
              <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-klaq-400 ring-2 ring-white"></span>
            ) : null}
          </span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="overflow-scroll bg-gray-200 absolute right-0 z-10 mt-2.5 w-96 h-96 origin-top-right rounded-md shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            <div className="inline-flex items-center justify-between w-full px-4 py-4">
              <h3 className="font-bold text-xl sm:text-2xl text-gray-800 dark:text-white">
                Notifications
              </h3>
            </div>
            <div className="flex flex-col space-y-2 px-4 pb-4">
              {notifications &&
                notifications.length > 0 &&
                notifications.map((notification: Notification, idx) => (
                  <Menu.Item key={notification.id}>
                    <NotificationCard
                      notification={notification}
                      shouldShowContent={!idx}
                    />
                  </Menu.Item>
                ))}
            </div>
          </Menu.Items>
          {/* <Menu.Items className="divide-y divide-gray-100 absolute right-0 z-10 mt-2.5 w-96 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            <div className="px-4 py-3">
              <p className="truncate text-xl font-bold text-gray-900">
                Notifications
              </p>
            </div>
            <div className="py-1 px-2 flex flex-col space-y-2">
              {notifications &&
                notifications.length > 0 &&
                notifications.map((notification) => (
                  <Menu.Item key={notification.id}>
                    <NotificationCard notification={notification} />
                  </Menu.Item>
                ))}
            </div>
          </Menu.Items> */}
        </Transition>
      </Menu>
    </>
  );
};
