import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface StatusHandler {
  [key: string]: {
    icon: React.ElementType;
    classes: string;
  };
}

const statusHandler: StatusHandler = {
  success: {
    icon: CheckCircleIcon,
    classes: 'text-success-400',
  },
  danger: {
    icon: ExclamationCircleIcon,
    classes: 'text-danger-400',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    classes: 'text-warning-400',
  },
  info: {
    icon: InformationCircleIcon,
    classes: 'text-blue-400',
  },
};

interface StatusIconProps {
  status: keyof StatusHandler;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const statusInfo = statusHandler[status];

  if (!statusInfo) {
    return null; // Render nothing if the status is not defined in the statusHandler object
  }

  const IconComponent = statusInfo.icon;
  const iconClasses = statusInfo.classes;

  return (
    <div>
      <IconComponent className={iconClasses + ' h-6 w-6'} />
    </div>
  );
};

export default StatusIcon;
