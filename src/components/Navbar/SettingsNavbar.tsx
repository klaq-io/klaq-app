import {
  UserIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CreditCardIcon,
  BellAlertIcon,
  LockClosedIcon,
  RectangleStackIcon,
  ArrowsPointingInIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import { PATHS } from "routes";
import { classNames } from "utils/utils";

export const SettingsNavbar = () => {
  const intl = useIntl();

  const currentPage = window.location.pathname;

  const tabs = [
    {
      name: "navbar.profile",
      href: PATHS.PROFILE,
      icon: UserIcon,
      current: currentPage === PATHS.PROFILE,
    },
    {
      name: "navbar.company",
      href: PATHS.COMPANY,
      icon: BuildingOfficeIcon,
      current: currentPage === PATHS.COMPANY,
    },
    {
      name: "navbar.bank-account",
      href: PATHS.BANK_ACCOUNT,
      icon: BuildingLibraryIcon,
      current: currentPage === PATHS.BANK_ACCOUNT,
    },
    {
      name: "navbar.integrations",
      href: PATHS.INTEGRATIONS,
      icon: ArrowsPointingInIcon,
      current: currentPage === PATHS.INTEGRATIONS,
    },

    {
      name: "navbar.subscriptions",
      href: PATHS.SUBSCRIPTION,
      icon: CreditCardIcon,
      current: currentPage === PATHS.SUBSCRIPTION,
    },

    {
      name: "navbar.security",
      href: PATHS.SECURITY,
      icon: LockClosedIcon,
      current: currentPage === PATHS.SECURITY,
    },
  ];

  return (
    <div className="mb-8">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-klaq-500 focus:ring-klaq-500"
          defaultValue={tabs.find((tab) => tab.current)?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>
              {intl.formatMessage({ id: tab.name })}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-900/10">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? "border-klaq-500 text-klaq-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                <tab.icon
                  className={classNames(
                    tab.current
                      ? "text-klaq-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span>{intl.formatMessage({ id: tab.name })}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
