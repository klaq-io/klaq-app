import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import { Status } from 'enum/status.enum';
import { FC, createElement } from 'react';
import { classNames } from 'utils/utils';

type Link = {
  text: string;
  onClick?: () => void;
  active: boolean;
};

type AlertWithLinkProps = {
  status: Status;
  content: string;
  link: Link;
};

export const AlertWithLink: FC<AlertWithLinkProps> = (
  props: AlertWithLinkProps,
) => {
  const { status, content, link } = props;

  const statusBackgroundClasses: { [key in Status]: string } = {
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50',
    pending: 'bg-gray-50',
  };

  const statusIconClasses: { [key in Status]: string } = {
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    info: 'text-blue-400',
    pending: 'text-gray-400',
  };

  const statusTextClasses: { [key in Status]: string } = {
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
    info: 'text-blue-700',
    pending: 'text-gray-700',
  };

  const statusLinkClasses: { [key in Status]: string } = {
    success: 'text-green-700 hover:text-green-600',
    warning: 'text-yellow-700 hover:text-yellow-600',
    danger: 'text-red-700 hover:text-red-600',
    info: 'text-blue-700 hover:text-blue-600',
    pending: 'text-gray-700 hover:text-gray-600',
  };

  const statusIcon: { [key in Status]: any } = {
    success: CheckCircleIcon,
    warning: InformationCircleIcon,
    danger: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    pending: InformationCircleIcon,
  };

  return (
    <div
      className={classNames('rounded-md p-4', statusBackgroundClasses[status])}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {createElement(statusIcon[status], {
            className: classNames('h-5 w-5', statusIconClasses[status]),
            'aria-hidden': true,
          })}
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className={classNames('text-sm', statusTextClasses[status])}>
            {content}
          </p>
          {link.active && (
            <p className="mt-3 text-sm md:ml-6 md:mt-0">
              <button
                onClick={link.onClick}
                className={classNames(
                  'whitespace-nowrap font-medium',
                  statusLinkClasses[status],
                )}
              >
                {link.text}
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
