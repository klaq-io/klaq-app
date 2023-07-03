import { useIntl } from "react-intl";
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineCurrencyEuro,
  HiOutlineShoppingBag,
  HiOutlinePresentationChartLine,
  HiOutlineChartPie,
} from "react-icons/hi";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import {
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  CurrencyEuroIcon,
  ShoppingBagIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";

type Props = {
  classes?: string;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const Sidebar = (props: Props) => {
  const intl = useIntl();

  const navigation = [
    { name: "sidebar.dashboard", href: "#", icon: HomeIcon, current: true },
    { name: "sidebar.calendar", href: "#", icon: CalendarIcon, current: false },
    { name: "sidebar.events", href: "#", icon: FolderIcon, current: false },
    {
      name: "sidebar.customers",
      href: "#",
      icon: UsersIcon,
      current: false,
    },
    {
      name: "sidebar.billing",
      href: "#",
      icon: DocumentDuplicateIcon,
      current: false,
    },
    {
      name: "sidebar.products",
      href: "#",
      icon: ShoppingBagIcon,
      current: false,
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
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-600 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=white"
          alt="Klaq"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-blue-700 text-white"
                        : "text-blue-200 hover:text-white hover:bg-blue-700",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-white"
                          : "text-blue-200 group-hover:text-white",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {intl.formatMessage({
                      id: item.name,
                    })}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-blue-200 hover:bg-blue-700 hover:text-white"
            >
              <QuestionMarkCircleIcon
                className="h-6 w-6 shrink-0 text-blue-200 group-hover:text-white"
                aria-hidden="true"
              />
              {intl.formatMessage({
                id: "sidebar.help",
              })}
            </a>
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-blue-200 hover:bg-blue-700 hover:text-white"
            >
              <Cog6ToothIcon
                className="h-6 w-6 shrink-0 text-blue-200 group-hover:text-white"
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
