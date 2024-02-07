import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  ChartPieIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  LifebuoyIcon,
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
import { useSelector } from "react-redux";
import { useFetchUser, useSignout } from "redux/Login/hooks";
import { getUser } from "redux/Login/selectors";
import { Fragment, useEffect } from "react";
import { Skeleton } from "components/Skeleton";
import { CardContainer } from "components/Card";
import { handleClickHelp } from "utils/clickOnCrisp";

type Props = {
  classes?: string;
};

const userNavigation = [
  { name: "navbar.profile", href: PATHS.PROFILE },
  { name: "navbar.integrations", href: PATHS.INTEGRATIONS },
  { name: "navbar.company", href: PATHS.COMPANY },
  // { name: "navbar.billing", href: "#" },
];

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
      name: "sidebar.invoices",
      href: PATHS.INVOICES,
      icon: DocumentCheckIcon,
      current: currentPage === PATHS.INVOICES || currentPage === PATHS.INVOICE,
    },
    {
      name: "sidebar.quotes",
      icon: ClipboardDocumentIcon,
      href: PATHS.QUOTES,
      current: currentPage === PATHS.QUOTES || currentPage === PATHS.QUOTE,
    },
    {
      name: "sidebar.products",
      href: PATHS.PRODUCTS,
      icon: ShoppingBagIcon,
      current: currentPage === PATHS.PRODUCTS,
    },
    // {
    //   name: "sidebar.marketing",
    //   href: "#",
    //   icon: PresentationChartLineIcon,
    //   current: false,
    // },
    // {
    //   name: "sidebar.analytics",
    //   href: "#",
    //   icon: ChartPieIcon,
    //   current: false,
    // },
  ];

  const [{ isLoading: isFetchingUser }, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const [, logout] = useSignout();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-klaq-600 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img src={KlaqLogo} className="mt-6 w-4/5" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-6">
          <li key="sidebar">
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item: any) =>
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

          <li className="mt-auto" key="sidebar-footer">
            <CardContainer className="px-2 my-4">
              <Menu as="div" className="relative">
                <Menu.Button
                  className="-m-1.5 flex items-center p-1.5"
                  disabled
                >
                  <span className="sr-only">Open user menu</span>

                  {!user.logoUrl && isFetchingUser ? (
                    <Skeleton variant="circle" width={8} height={8} />
                  ) : user.logoUrl ? (
                    <img src={user.logoUrl} className="h-8 w-8 rounded-full" />
                  ) : (
                    <div
                      className={classNames(
                        "flex items-center justify-center h-8 w-8 rounded-full bg-gray-200"
                      )}
                    >
                      <span className="font-semibold text-gray-600">
                        {user && user.firstName && user.lastName
                          ? `${user.firstName.charAt(0)}${user.lastName.charAt(
                              0
                            )}`
                          : null}
                      </span>
                    </div>
                  )}

                  {!user.firstName && !user.lastName && isFetchingUser ? (
                    <div className="ml-2">
                      <Skeleton variant="rounded" width={20} height={6} />
                    </div>
                  ) : (
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className={classNames(
                          "ml-4 text-sm font-semibold leading-6 text-gray-900"
                        )}
                        aria-hidden="true"
                      >
                        {user && user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : null}
                      </span>
                    </span>
                  )}
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="-top-3 transform -translate-y-full divide-y divide-gray-100 absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <div className="py-1">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-gray-900"
                              )}
                            >
                              {intl.formatMessage({ id: item.name })}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                    <div className="py-1">
                      <Menu.Item key="logout">
                        <a
                          // onClick={handleLogout}
                          className="hover:bg-gray-50 block px-3 py-1 text-sm leading-6 text-danger-600 cursor-pointer hover:bg-gray"
                        >
                          {intl.formatMessage({ id: "navbar.logout" })}
                        </a>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </CardContainer>
            <a
              href={PATHS.PROFILE}
              className={classNames(
                "group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-klaq-200 hover:bg-klaq-700 hover:text-white",
                currentPage === PATHS.SETTINGS ? "bg-klaq-700 text-white" : ""
              )}
            >
              <Cog6ToothIcon
                className="h-6 w-6 shrink-0 text-klaq-200 group-hover:text-white"
                aria-hidden="true"
              />
              {intl.formatMessage({
                id: "sidebar.settings",
              })}
            </a>
            <a
              onClick={handleClickHelp}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-klaq-200 hover:bg-klaq-700 hover:text-white mt-1"
            >
              <LifebuoyIcon
                className="h-6 w-6 shrink-0 text-klaq-200 group-hover:text-white"
                aria-hidden="true"
              />
              {intl.formatMessage({
                id: "sidebar.help",
              })}
            </a>

            <a
              href={PATHS.LOGIN}
              onClick={handleLogout}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-klaq-200 hover:bg-klaq-700 hover:text-white"
            >
              <ArrowRightOnRectangleIcon
                className="h-6 w-6 shrink-0 text-klaq-200 group-hover:text-white"
                aria-hidden="true"
              />
              {intl.formatMessage({ id: "navbar.logout" })}
            </a>
          </li>
          {/* <li className="mt-auto" key="sidebar-footer">
            <CardContainer className="px-4">
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>

                  {isFetchingUser ? (
                    <Skeleton variant="circle" width={8} height={8} />
                  ) : user.logoUrl ? (
                    <img src={user.logoUrl} className="h-8 w-8 rounded-full" />
                  ) : (
                    <div
                      className={classNames(
                        "flex items-center justify-center h-8 w-8 rounded-full bg-gray-200"
                      )}
                    >
                      <span className="font-semibold text-gray-600">
                        {user && user.firstName && user.lastName
                          ? `${user.firstName.charAt(0)}${user.lastName.charAt(
                              0
                            )}`
                          : null}
                      </span>
                    </div>
                  )}

                  {isFetchingUser ? (
                    <div className="ml-2">
                      <Skeleton variant="rounded" width={20} height={6} />
                    </div>
                  ) : (
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className={classNames(
                          "ml-4 text-sm font-semibold leading-6 text-gray-900"
                        )}
                        aria-hidden="true"
                      >
                        {user && user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : null}
                      </span>
                    </span>
                  )}
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="-top-3 transform -translate-y-full divide-y divide-gray-100 absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <div className="py-1">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-gray-900"
                              )}
                            >
                              {intl.formatMessage({ id: item.name })}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                    <div className="py-1">
                      <Menu.Item key="logout">
                        <a
                          // onClick={handleLogout}
                          className="hover:bg-gray-50 block px-3 py-1 text-sm leading-6 text-danger-600 cursor-pointer hover:bg-gray"
                        >
                          {intl.formatMessage({ id: "navbar.logout" })}
                        </a>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </CardContainer>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
