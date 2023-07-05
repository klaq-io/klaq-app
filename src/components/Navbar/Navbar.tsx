import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../routes";
import { useSignout } from "../../redux/Login/hooks";

type Props = {
  classes?: string;
};

const userNavigation = [{ name: "navbar.profile", href: "#" }];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = (props: Props) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const handleNewEvent = () => {
    navigate(PATHS.NEW_EVENT);
  };

  const [, logout] = useSignout();

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN);
  };

  return (
    <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            {intl.formatMessage({ id: "navbar.searchbar" })}
          </label>

          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder={intl.formatMessage({ id: "navbar.searchbar" })}
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            onClick={handleNewEvent}
          >
            <span className="sr-only">New event</span>
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full bg-gray-50"
                src="https://i.ibb.co/drBHxQw/B87-AE7-AD-84-D0-45-D4-923-F-DE49-DCE41534.jpg"
                alt=""
              />
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                  aria-hidden="true"
                >
                  Company Name
                </span>
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
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
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
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
                <Menu.Item key="logout">
                  <a
                    onClick={handleLogout}
                    className="block px-3 py-1 text-sm leading-6 text-danger-900 cursor-pointer hover:bg-gray"
                  >
                    {intl.formatMessage({ id: "navbar.logout" })}
                  </a>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
