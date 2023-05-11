import { useState, useEffect } from "react";
import { Sidebar } from "../../components";
import Header from "../../components/Navbar/Navbar";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

export const PageLayout = (props: Props) => {
  const { children } = props;

  return (
    <main className="relative h-screen bg-gray-100 overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="relative hidden h-screen lg:block w-60">
          <Sidebar />
        </div>
        <div className="flex flex-col w-full">
          <Header />
          <div className="m-4 h-screen overflow-scroll">
            {children}
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageLayout;
