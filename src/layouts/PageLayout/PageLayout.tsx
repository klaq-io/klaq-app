import { Sidebar } from "../../components";
import Header from "../../components/Navbar/Navbar";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

export const PageLayout = (props: Props) => {
  const { children } = props;
  return (
    <main className="relative h-screen overflow-hidden bg-gray-100 rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="relative hidden h-screen shadow-lg lg:block w-60">
          <Sidebar />
        </div>
        <div className="flex flex-col w-full pl-0 md:space-y-4">
          <Header />
          {children}
        </div>
      </div>
    </main>
  );
};

export default PageLayout;
