import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import { Status } from 'enum/status.enum';
import { createElement } from 'react';
import { classNames } from 'utils/utils';

type Button = {
  text: string;
  onClick?: () => void;
};

type AlertWithButtonsProps = {
  status: Status;
  title: string;
  content?: string;
  buttons: Button[];
};

export const AlertWithButtons = (props: AlertWithButtonsProps) => {
  const { status, title, content, buttons } = props;

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

  const statusTitleClasses: { [key in Status]: string } = {
    success: 'text-green-800',
    warning: 'text-yellow-800',
    danger: 'text-red-800',
    info: 'text-blue-800',
    pending: 'text-gray-800',
  };

  const statusButtonClasses: { [key in Status]: string } = {
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
        <div className="ml-3">
          <h3
            className={classNames(
              'text-sm font-semibold',
              statusTitleClasses[status],
            )}
          >
            {title}
          </h3>
          <div
            className={classNames('text-sm mt-2', statusTextClasses[status])}
          >
            <p>{content}</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              {buttons.map((btn, index) => (
                <button
                  key={`alert-btn-${index}`}
                  type="button"
                  onClick={btn.onClick}
                  className={classNames(
                    'rounded-md px-2 py-1.5 text-sm font-medium',
                    statusButtonClasses[status],
                  )}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
