import { FC } from "react";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

export const Tooltip: FC<TooltipProps> = (props: TooltipProps) => {
  const { text, children } = props;
  return (
    <div className="has-tooltip">
      <span className="tooltip shadow-sm ring-1 ring-gray-900/5 rounded-xl p-1 bg-gray-50 text-gray-600 -mt-8 text-sm">
        {text}
      </span>
      {children}
    </div>
  );
};
