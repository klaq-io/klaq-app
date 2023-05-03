import { useState, useEffect } from "react";
import { Sidebar } from "../../components";
import Header from "../../components/Navbar/Navbar";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const MINIMUM_SCREEN_SIZE = {
  width: 1024,
  height: 690,
};

export const PageLayout = (props: Props) => {
  const { children } = props;

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return dimensions.width <= MINIMUM_SCREEN_SIZE.width ||
    dimensions.height <= MINIMUM_SCREEN_SIZE.height ? (
    <div className="flex justify-center bg-primary h-full">
      <div className="card w-96 bg-base-100 shadow-xl m-6">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Oups!</h2>
          <p className="text-xl">
            Please use a computer to use{" "}
            <span className="font-bold">Klaq.io</span>
          </p>
        </div>
      </div>
    </div>
  ) : (
    <main className="relative h-screen overflow-hidden bg-gray-100 ">
      <div className="flex items-start justify-between">
        <div className="relative hidden h-screen lg:block w-60">
          <Sidebar />
        </div>
        <div className="flex flex-col w-full ">
          <Header />
          <div className="m-4">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default PageLayout;
