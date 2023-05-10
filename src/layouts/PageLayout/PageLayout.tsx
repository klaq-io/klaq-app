import { useState, useEffect } from "react";
import { Sidebar } from "../../components";
import Header from "../../components/Navbar/Navbar";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

export const PageLayout = (props: Props) => {
  const { children } = props;

  return (
    <main className="relative h-screen overflow-hidden bg-gray-100 ">
      <div className="flex items-start justify-between">
        <div className="relative hidden h-screen lg:block w-60">
          <Sidebar />
        </div>
        <div className="flex flex-col w-full ">
          <Header />
          <div className="m-4 h-screen">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default PageLayout;
