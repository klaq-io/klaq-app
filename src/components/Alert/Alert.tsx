import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { FC } from "react";
import { classNames } from "../../utils/utils";
import React from "react";

type Status = "success" | "warning" | "error" | "info";

type AlertProps = {
  status: Status;
  title?: React.ReactNode;
  text: React.ReactNode;
};

export const Alert: FC<AlertProps> = (props: AlertProps) => {
  const { text, title, status } = props;

  const statusBackgroundClasses: { [key in Status]: string } = {
    success: "bg-green-50",
    warning: "bg-yellow-50",
    error: "bg-red-50",
    info: "bg-blue-50",
  };

  const statusIconClasses: { [key in Status]: string } = {
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400",
    info: "text-blue-400",
  };

  const statusTextClasses: { [key in Status]: string } = {
    success: "text-green-700",
    warning: "text-yellow-700",
    error: "text-red-700",
    info: "text-blue-700",
  };

  const statusIcon: { [key in Status]: any } = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
  };

  return (
    <div
      className={classNames("rounded-md p-4", statusBackgroundClasses[status])}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {React.createElement(statusIcon[status], {
            className: classNames("h-5 w-5", statusIconClasses[status]),
            "aria-hidden": true,
          })}
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          {title && (
            <h3
              className={classNames(
                "text-sm font-medium",
                statusTextClasses[status]
              )}
            >
              {title}
            </h3>
          )}
          {text && (
            <p className={classNames("text-sm", statusTextClasses[status])}>
              {text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
