import { InboxArrowDownIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Notification } from "interface/Notifications/notification.interface";
import { FC } from "react";

type NotificationCardProps = {
  notification: Notification;
  shouldShowContent?: boolean;
};

export const NotificationCard: FC<NotificationCardProps> = (
  props: NotificationCardProps
) => {
  const { notification, shouldShowContent = true } = props;

  return (
    <div className="flex space-x-4 w-full  rounded-lg p-2 bg-white shadow-sm">
      <div className="mt-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-klaq-500">
          <InboxArrowDownIcon
            className="h-4 w-4 text-white"
            aria-hidden="true"
          />
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <h4 className="text-sm font-semibold text-gray-900">
          {notification.title}
        </h4>
        {shouldShowContent && (
          <div className="ring-1 ring-gray-900/5 p-2 shadow-sm rounded-lg">
            <p className="text-sm text-gray-500">{notification.content}</p>
          </div>
        )}
        <div className="flex items-center space-x-2 justify-between text-sm text-gray-500">
          <p>
            {format(new Date(notification.createdAt), "eeee, HH:mm", {
              locale: fr,
            })}
          </p>
          <p>
            {format(new Date(notification.createdAt), "dd MMMM yyyy", {
              locale: fr,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
