import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useIntl } from 'react-intl';
import { classNames } from 'utils/utils';

type Props = {
  regex: RegExp;
  message: string;
  password: string;
};

export const PasswordStrengthIndicator = (props: Props) => {
  const { password, regex, message } = props;
  const intl = useIntl();
  const isValid = password.match(regex);

  return (
    <span
      className={classNames(
        'mt-2 text-xs block flex items-center',
        isValid ? 'text-success-600' : 'text-danger-600',
      )}
    >
      <span>
        {isValid ? (
          <CheckIcon className="w-5 h-5 text-success-600" />
        ) : (
          <XMarkIcon className="w-5 h-5 text-danger-600" />
        )}
      </span>
      <span className="ml-2">
        {intl.formatMessage({
          id: message,
        })}
      </span>
    </span>
  );
};

export default PasswordStrengthIndicator;
