import { FC } from 'react';
import { classNames } from 'utils/utils';

type TooltipProps = {
  children: React.ReactNode;
  text: string;
  position: 'top' | 'bottom';
};

export const Tooltip: FC<TooltipProps> = (props: TooltipProps) => {
  const { text, children, position } = props;
  return (
    <div className="has-tooltip">
      <span
        className={classNames(
          'tooltip shadow-sm ring-1 ring-gray-900/5 rounded-xl p-2 bg-gray-50 text-gray-600 text-sm -ml-2',
          position === 'top' && '-mt-12',
          position === 'bottom' && 'mt-12',
        )}
      >
        {text}
      </span>
      {children}
    </div>
  );
};
