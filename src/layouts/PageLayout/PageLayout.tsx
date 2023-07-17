import { useState } from "react";
import { Sidebar, Spinner } from "../../components";
import { Navbar } from "../../components/Navbar/Navbar";

type Props = {
  children: any;
  isLoading?: boolean;
};

export const PageLayout = (props: Props) => {
  const { children, isLoading } = props;

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      <div className="lg:pl-72">
        <Navbar />
        <main className="py-10">
          {isLoading ? (
            <div className="flex h-screen">
              <div className="m-auto">
                <Spinner size="medium" color="blue" />
              </div>
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
