import {
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useVerifyEmail } from 'redux/Email/hooks';

export const ConfirmMailVerify = () => {
  const intl = useIntl();
  const params = new URLSearchParams(document.location.search);
  const token = params.get('token');

  const [{ data: isSuccess }, verifyEmail] = useVerifyEmail();
  const status = isSuccess || true ? 'success' : 'failed';

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, []);

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="sm:flex sm:items-start">
              {status === 'success' ? (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
              )}
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  {intl.formatMessage({
                    id: `confirm-mail.verify.${status}.header`,
                  })}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {intl.formatMessage({
                      id: `confirm-mail.verify.${status}.description`,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <div>
              {status === 'success' ? (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
              )}
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: `confirm-mail.verify.${status}.header`,
                    })}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {intl.formatMessage({
                        id: `confirm-mail.verify.${status}.description`,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
