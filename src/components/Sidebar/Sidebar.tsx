import { Disclosure } from "@headlessui/react";
import {
  CalendarIcon,
  ChartPieIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  MinusSmallIcon,
  PlusSmallIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import KlaqLogo from "../../assets/logo-pres.png";
import { PATHS } from "../../routes";

type Props = {
  classes?: string;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const Sidebar = (props: Props) => {
  const intl = useIntl();

  const currentPage = `/${window.location.pathname.split("/")[1]}`;

  const navigation = [
    {
      name: "sidebar.dashboard",
      href: PATHS.DASHBOARD,
      icon: HomeIcon,
      current: currentPage === PATHS.DASHBOARD,
    },
    {
      name: "sidebar.calendar",
      href: PATHS.CALENDAR,
      icon: CalendarIcon,
      current: currentPage === PATHS.CALENDAR,
    },
    {
      name: "sidebar.events",
      href: PATHS.EVENTS,
      icon: FolderIcon,
      current: currentPage === PATHS.EVENTS,
    },
    {
      name: "sidebar.customers",
      href: PATHS.CUSTOMERS,
      icon: UsersIcon,
      current: currentPage === PATHS.CUSTOMERS,
    },
    {
      name: "sidebar.billing",
      href: "#",
      icon: DocumentDuplicateIcon,
      current: false,
      submenu: [
        {
          name: "sidebar.invoices",
          href: PATHS.INVOICES,
          current: currentPage === PATHS.INVOICES,
        },
        {
          name: "sidebar.quotes",
          href: PATHS.QUOTES,
          current: currentPage === PATHS.QUOTES,
        },
      ],
    },
    {
      name: "sidebar.products",
      href: PATHS.PRODUCTS,
      icon: ShoppingBagIcon,
      current: currentPage === PATHS.PRODUCTS,
    },
    {
      name: "sidebar.marketing",
      href: "#",
      icon: PresentationChartLineIcon,
      current: false,
    },
    {
      name: "sidebar.analytics",
      href: "#",
      icon: ChartPieIcon,
      current: false,
    },
  ];

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-klaq-600 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img src={KlaqLogo} className="mt-6 w-4/5" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) =>
                item.submenu ? (
                  <Disclosure
                    defaultOpen={item.submenu.some(
                      (subitem: any) => subitem.current
                    )}
                    as="div"
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-klaq-200 hover:text-white hover:bg-klaq-700">
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-white"
                                : "text-klaq-200 group-hover:text-white",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {intl.formatMessage({
                            id: item.name,
                          })}
                          {open ? (
                            <ChevronUpIcon
                              className="ml-auto h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronDownIcon
                              className="ml-auto h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                        </Disclosure.Button>
                        <Disclosure.Panel
                          as="ul"
                          className="flex flex-col gap-y-1 mx-9"
                        >
                          {item.submenu.map((subitem: any) => (
                            <li key={subitem.name}>
                              <a
                                href={subitem.href}
                                className={classNames(
                                  subitem.current
                                    ? "bg-klaq-700 text-white"
                                    : "text-klaq-200 hover:text-white hover:bg-klaq-700",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                {intl.formatMessage({
                                  id: subitem.name,
                                })}
                              </a>
                            </li>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ) : (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-klaq-700 text-white"
                          : "text-klaq-200 hover:text-white hover:bg-klaq-700",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? "text-white"
                            : "text-klaq-200 group-hover:text-white",
                          "h-6 w-6 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {intl.formatMessage({
                        id: item.name,
                      })}
                    </a>
                  </li>
                )
              )}
            </ul>
          </li>

          <li className="mt-auto">
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-klaq-200 hover:bg-klaq-700 hover:text-white"
            >
              <QuestionMarkCircleIcon
                className="h-6 w-6 shrink-0 text-klaq-200 group-hover:text-white"
                aria-hidden="true"
              />
              {intl.formatMessage({
                id: "sidebar.help",
              })}
            </a>
            <a
              href={PATHS.SETTINGS}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-klaq-200 hover:bg-klaq-700 hover:text-white"
            >
              <Cog6ToothIcon
                className="h-6 w-6 shrink-0 text-klaq-200 group-hover:text-white"
                aria-hidden="true"
              />
              {intl.formatMessage({
                id: "sidebar.settings",
              })}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
