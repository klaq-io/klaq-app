import { classNames } from "../../utils/utils";

const buttonVariants = {
  primary:
    "rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
  secondary:
    "rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
};

type Props = {
  text?: string;
  onClick?: () => void;
  variant: "primary" | "secondary";
  Icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  type: "button" | "submit" | "reset";
  classes?: string;
};

export const Button = (props: Props) => {
  const { text, onClick, variant, Icon, type, classes } = props;
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
    >
      {Icon ? <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" /> : null}
      {text}
    </button>
  );
};
