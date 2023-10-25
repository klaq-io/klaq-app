type CardContainerProps = {
  children: React.ReactNode;
};

export const CardContainer = (props: CardContainerProps) => {
  const { children } = props;
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
      {children}
    </div>
  );
};
