import { Sidebar, Spinner } from "components";
import { Navbar } from "components/Navbar/Navbar";
import { useEffect, useState } from "react";

const MINIMUM_SCREEN_SIZE = {
  width: 1000,
  height: 400,
};

type Props = {
  children: any;
  isLoading?: boolean;
};

export const PageLayout = (props: Props) => {
  const { children, isLoading } = props;

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // useEffect(() => {
  //   function handleResize() {
  //     setDimensions({
  //       height: window.innerHeight,
  //       width: window.innerWidth,
  //     });
  //   }
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // });

  return true ? (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      <div className="lg:pl-64 min-h-screen">
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
  ) : null;
};

export default PageLayout;
