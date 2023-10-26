import { useId } from "react";

type CardContainerProps = {
  children: React.ReactNode;
};

export const CardContainer = (props: CardContainerProps) => {
  const { children } = props;
  const id = useId();
  return (
    <div
      className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      key={id}
    >
      {children}
    </div>
  );
};
