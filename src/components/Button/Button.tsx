import { classNames } from "../../utils/utils";
import { Spinner } from "../Spinner";

const buttonVariants = {
  primary:
    "rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-30",
  secondary:
    "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white",
};

type Props = {
  text?: string;
  onClick?: () => void;
  variant: "primary" | "secondary";
  type: "button" | "submit" | "reset";
  classes?: string;
  disabled?: boolean;
  isLoading?: boolean;
} & {
  iconPosition?: "trailing" | "leading";
  Icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
};

export const Button = (props: Props) => {
  const {
    text,
    onClick,
    variant,
    Icon,
    type,
    classes,
    iconPosition,
    disabled,
    isLoading,
  } = props;
  return (
    <button
      onClick={onClick}
      type={type}
      className={classNames(
        classNames(
          Icon ? "inline-flex items-center gap-x-2 " : null,
          buttonVariants[variant]
        ),
        classes
      )}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Spinner
            size="small"
            color={variant === "primary" ? "gray" : "blue"}
          />
        </>
      ) : (
        <>
          {Icon && iconPosition === "leading" ? (
            <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          ) : null}
          {text}
          {Icon && iconPosition === "trailing" ? (
            <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          ) : null}
        </>
      )}
    </button>
  );
};
