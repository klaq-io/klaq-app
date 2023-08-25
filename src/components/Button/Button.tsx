import { FC, ReactNode } from "react";
import { classNames } from "../../utils/utils";
import { Spinner } from "../Spinner";
import { ReactJSXElementAttributesProperty } from "@emotion/react/types/jsx-namespace";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  color: "primary" | "secondary";
  variant: "contained" | "outlined" | "text" | "link";
  onClick?: () => void;
  href?: string;
  type: "button" | "submit" | "reset";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

export const Button: FC<ButtonProps> = (props: ButtonProps) => {
  const {
    leadingIcon,
    trailingIcon,
    children,
    disabled,
    isLoading,
    onClick,
    type,
    color,
    variant,
    size = "xl",
  } = props;

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-sm",
    xl: "px-3.5 py-2.5 text-sm",
  };

  const variants = {
    contained:
      color === "primary"
        ? "text-white bg-klaq-600 hover:bg-klaq-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klaq-600"
        : "text-gray-900 bg-white hover:bg-gray-50 shadow-sm ring-gray-300 ring-1 ring-inset bg-white hover:bg-gray-50",
    outlined: `${
      color === "secondary" ? "ring-gray-600" : "ring-gray-300"
    } ring-1 ring-inset bg-white hover:bg-gray-50 text-gray-900`,
    text:
      color === "secondary"
        ? "text-gray-900 hover:text-gray-600"
        : "text-klaq-600 hover:text-klaq-500",
    link: "text-klaq-600 hover:text-klaq-500",
  };
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      className={classNames(
        "inline-flex items-center gap-x-2 rounded-md font-semibold disabled:cursor-not-allowed disabled:opacity-30",
        variants[variant],
        variant !== "link" && sizes[size]
      )}
    >
      {isLoading && <Spinner size="small" color={color} />}
      <>
        {leadingIcon}
        {children}
        {trailingIcon}
      </>
    </button>
  );
};

export default Button;
