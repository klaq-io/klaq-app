import { useId } from 'react';
import { classNames } from 'utils/utils';

type CardContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const CardContainer = (props: CardContainerProps) => {
  const { children, className } = props;
  const id = useId();
  return (
    <div
      className={classNames('bg-white shadow-sm sm:rounded-xl', className)}
      key={id}
    >
      {children}
    </div>
  );
};
