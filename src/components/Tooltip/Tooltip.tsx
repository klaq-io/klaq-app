import { FC } from "react";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

export const Tooltip: FC<TooltipProps> = (props: TooltipProps) => {
  const { text, children } = props;
  return (
    <div className="has-tooltip">
      <span className="tooltip rounded shadow-lg p-1 bg-gray-100 text-gray-800 -mt-8 text-sm">
        {text}
      </span>
      {children}
    </div>
  );
};
