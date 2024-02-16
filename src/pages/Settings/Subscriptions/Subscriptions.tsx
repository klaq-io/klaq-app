import { SettingsNavbar } from "components";
import { BetaBadge } from "components/Badge/BetaBadge";
import { PageLayout } from "layouts";
import { useIntl } from "react-intl";

export const Subscriptions = () => {
  const intl = useIntl();

  return (
    <PageLayout>
      <SettingsNavbar />
      <div className="space-y-8 divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.subscriptions.overview.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.subscriptions.overview.description",
              })}
            </p>
          </div>
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <BetaBadge />
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {intl.formatMessage({
                      id: "settings.subscriptions.current-plan.beta.description",
                    })}
                  </p>
                </div>

                <div className="sm:col-span-full"></div>
              </div>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pt-10">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {intl.formatMessage({
                id: "settings.subscriptions.details.header",
              })}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {intl.formatMessage({
                id: "settings.subscriptions.details.description",
              })}
            </p>
          </div>
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {intl.formatMessage({
                      id: "settings.subscriptions.current-plan.beta.description",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};
