import { ComputerDesktopIcon } from '@heroicons/react/24/solid';
import { Impersonate, Sidebar, Spinner } from 'components';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
/* eslint-disable */
const MINIMUM_SCREEN_SIZE = {
  width: 1000,
  height: 600,
};

type Props = {
  children: any;
  isLoading?: boolean;
};

export const PageLayout = (props: Props) => {
  const { children, isLoading } = props;
  const intl = useIntl();

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile =
    dimensions.width < MINIMUM_SCREEN_SIZE.width ||
    dimensions.height < MINIMUM_SCREEN_SIZE.height;

  return !isMobile ? (
    <>
      <Impersonate />
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      <div className="lg:pl-64 min-h-screen shadow">
        {/* <Navbar /> */}
        <main className="py-8 h-screen">
          {isLoading ? (
            <div className="flex min-h-screen">
              <div className="m-auto">
                <Spinner size="medium" color="primary" />
              </div>
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 h-full overflow-y-scroll overflow-x-hidden">
              {children}
            </div>
          )}
        </main>
      </div>
    </>
  ) : (
    <div className="flex min-h-screen">
      <div className="m-auto space-y-4">
        <ComputerDesktopIcon className="w-24 h-24 m-auto text-gray-500" />
        <h1 className="text-4xl text-center">
          {intl.formatMessage({
            id: 'resolution-too-low.title',
          })}
        </h1>
        <p className="text-center text-2xl text-gray-500">
          {intl.formatMessage({
            id: 'resolution-too-low.description',
          })}
        </p>
      </div>
    </div>
  );
};
/* eslint-enable */
export default PageLayout;
