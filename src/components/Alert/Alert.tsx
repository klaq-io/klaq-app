import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { FC } from 'react';
import { classNames } from '../../utils/utils';
import React from 'react';

type Status = 'success' | 'warning' | 'danger' | 'info';

type AlertProps = {
  status: Status;
  title?: React.ReactNode;
  text?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: string;
};

export const Alert: FC<AlertProps> = (props: AlertProps) => {
  const { text, title, status, children, classNames: classes } = props;

  const statusBackgroundClasses: { [key in Status]: string } = {
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50',
  };

  const statusIconClasses: { [key in Status]: string } = {
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    info: 'text-blue-400',
  };

  const statusTitleClasses: { [key in Status]: string } = {
    success: 'text-green-800',
    warning: 'text-yellow-800',
    danger: 'text-red-800',
    info: 'text-blue-800',
  };

  const statusTextClasses: { [key in Status]: string } = {
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
    info: 'text-blue-700',
  };

  const statusIcon: { [key in Status]: any } = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    danger: XCircleIcon,
    info: InformationCircleIcon,
  };

  return (
    <div
      className={classNames('rounded-md p-4', statusBackgroundClasses[status])}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {React.createElement(statusIcon[status], {
            className: classNames('h-5 w-5', statusIconClasses[status]),
            'aria-hidden': true,
          })}
        </div>
        <div className={classNames('ml-3')}>
          {title && (
            <h3
              className={classNames(
                'text-sm font-semibold',
                statusTitleClasses[status],
              )}
            >
              {title}
            </h3>
          )}
          <div
            className={classNames(
              'mt-2 text-sm',
              statusTextClasses[status],
              classes,
            )}
          >
            {text || children}
          </div>
        </div>
      </div>
    </div>
  );
};
