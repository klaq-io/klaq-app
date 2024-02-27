import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Button, SettingsNavbar } from 'components';
import { PageLayout } from 'layouts';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useFetchUser, useRequestResetPassword } from 'redux/Login/hooks';
import { getUser } from 'redux/Login/selectors';

export const Security = () => {
  const intl = useIntl();

  const [{ isLoading: isSendingRequest }, requestResetPassword] =
    useRequestResetPassword();
  const [, fetchUser] = useFetchUser();

  const user = useSelector(getUser);

  const handleRequestResetPassword = () => {
    if (!user) return;
    requestResetPassword({ email: user.email });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <PageLayout>
      <SettingsNavbar />
      <div className="space-y-8 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: 'settings.change-password.header',
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: 'settings.change-password.description',
              })}
            </p>
          </div>

          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    {intl.formatMessage({
                      id: 'settings.change-password.send-mail.header',
                    })}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {intl.formatMessage(
                      {
                        id: 'settings.change-password.send-mail.description',
                      },
                      {
                        b: (chunks: any) => <b>{chunks}</b>,
                        mail: user?.email,
                      },
                    )}
                  </p>
                </div>

                <div className="sm:col-span-full">
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    size="lg"
                    leadingIcon={
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    }
                    onClick={handleRequestResetPassword}
                    isLoading={isSendingRequest}
                  >
                    {intl.formatMessage({
                      id: 'settings.change-password.send-mail.button',
                    })}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};
