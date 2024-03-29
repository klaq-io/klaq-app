import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { NewEventModal } from 'components/Modal';
import { NotificationWidget } from 'components/Notifications';
import { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetchUser, useSignout } from '../../redux/Login/hooks';
import { getUser } from '../../redux/Login/selectors';
import { PATHS } from '../../routes';
import { classNames } from '../../utils/utils';
import { Skeleton } from '../Skeleton';

const userNavigation = [
  { name: 'navbar.profile', href: PATHS.PROFILE },
  { name: 'navbar.integrations', href: PATHS.INTEGRATIONS },
  { name: 'navbar.company', href: PATHS.COMPANY },
  // { name: "navbar.billing", href: "#" },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [isNewEventOpened, setNewEventOpen] = useState(false);

  const [{ isLoading: isFetchingUser }, fetchUser] = useFetchUser();
  const user = useSelector(getUser);

  const [, logout] = useSignout();

  const handleLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            {intl.formatMessage({ id: 'navbar.searchbar' })}
          </label>

          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder={intl.formatMessage({ id: 'navbar.searchbar' })}
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            onClick={() => setNewEventOpen(true)}
          >
            <span className="sr-only">New event</span>
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="-m-2.5 p-2.5">
            <NotificationWidget />
          </div>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
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
                    'flex items-center justify-center h-8 w-8 rounded-full bg-gray-200',
                  )}
                >
                  <span className="font-semibold text-gray-600">
                    {user && user.firstName && user.lastName
                      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                      : null}
                  </span>
                </div>
              )}

              {isFetchingUser ? (
                <div className="ml-2">
                  <Skeleton variant="rounded" width={40} height={6} />
                </div>
              ) : (
                <span className="hidden lg:flex lg:items-center">
                  <span
                    className={classNames(
                      'ml-4 text-sm font-semibold leading-6 text-gray-900',
                    )}
                    aria-hidden="true"
                  >
                    {user && user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : null}
                  </span>
                  <ChevronDownIcon
                    className="ml-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
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
              <Menu.Items className="divide-y divide-gray-100 absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <div className="py-1">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <a
                          href={item.href}
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900',
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
                      onClick={handleLogout}
                      className="hover:bg-gray-50 block px-3 py-1 text-sm leading-6 text-danger-600 cursor-pointer hover:bg-gray"
                    >
                      {intl.formatMessage({ id: 'navbar.logout' })}
                    </a>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <NewEventModal isOpen={isNewEventOpened} setOpen={setNewEventOpen} />
    </div>
  );
};

export default Navbar;
