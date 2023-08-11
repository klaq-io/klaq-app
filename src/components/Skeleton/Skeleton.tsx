import { FC } from "react";
import { classNames } from "../../utils/utils";

type Props = {
  variant: "text" | "circle" | "rectangular" | "rounded";
  width: string | number;
  height: string | number;
  className?: string;
};

export const Skeleton: FC<Props> = (props: Props) => {
  const { variant, width, height, className } = props;
  return (
    <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
      {variant === "circle" && (
        <div
          className={classNames(
            "bg-gray-300 rounded-full",
            `h-${height}`,
            `w-${width}`,
            className
          )}
        ></div>
      )}
      {variant === "rounded" && (
        <div
          className={classNames(
            "bg-gray-300 rounded-md ",
            `h-${height}`,
            `w-${width}`,
            className
          )}
        ></div>
      )}
      {variant === "text" && (
        <div
          className={classNames(
            "bg-gray-300",
            `h-${height}`,
            `w-${width}`,
            className
          )}
        ></div>
      )}
    </div>
  );
};

export default Skeleton;
