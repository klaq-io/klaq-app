import { FC, ReactNode } from "react";

type InvoiceLayoutProps = {
  children: ReactNode;
};

export const InvoiceLayout: FC<InvoiceLayoutProps> = (
  props: InvoiceLayoutProps
) => {
  const { children } = props;
  return (
    <div className="bg-white -mx-4 px-4 py-8 shadow-lg ring-1 ring-gray-900/5 sm:mx-0 sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16 2xl:m-auto a4 overflow-y-scroll">
      {children}
    </div>
  );
};
